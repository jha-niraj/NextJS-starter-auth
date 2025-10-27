import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "@/lib/prisma";
import { PrismaAdapter } from "@auth/prisma-adapter"
import NextAuth from "next-auth";
import { Role } from '@prisma/client';
import bcrypt from "bcryptjs";

export const { auth, handlers, signIn, signOut } = NextAuth({
	adapter: PrismaAdapter(prisma) as any,
	providers: [
		CredentialsProvider({
			name: "Credentials",
			credentials: {
				email: {
					label: "Email",
					type: "email",
				},
				password: {
					label: "Password",
					type: "password"
				}
			},
			async authorize(credentials) {
				if (!credentials?.email || !credentials?.password) {
					return null;
				}

				try {
					const user = await prisma.user.findUnique({
						where: {
							email: credentials.email as string
						}
					});

					if (!user || !user.password) {
						return null;
					}

					// For special case where password is "verified" (after OTP verification)
					if (credentials.password === "verified") {
						// Refetch user to get latest verification status
						const freshUser = await prisma.user.findUnique({
							where: {
								email: credentials.email as string
							}
						});

						if (freshUser && freshUser.emailVerified) {
							return {
								id: freshUser.id,
								email: freshUser.email,
								name: freshUser.name,
								image: freshUser.image,
								role: freshUser.role,
								roleExplicitlyChosen: freshUser.roleExplicitlyChosen,
								onboardingCompleted: freshUser.onboardingCompleted,
							};
						} else {
							throw new Error("Email verification not completed");
						}
					}

					// Check if email is verified for regular password login
					if (!user.emailVerified) {
						throw new Error("Please verify your email before signing in");
					}

					// Regular password check
					const isPasswordValid = await bcrypt.compare(credentials.password as string, user.password);

					if (!isPasswordValid) {
						return null;
					}

					return {
						id: user.id,
						email: user.email,
						name: user.name,
						image: user.image,
						role: user.role,
						roleExplicitlyChosen: user.roleExplicitlyChosen,
					};
				} catch (error) {
					console.error("Authorization error:", error);
					throw new Error(error instanceof Error ? error.message : "Authentication failed");
				}
			}
		}),
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID || "",
			clientSecret: process.env.GOOGLE_SECRET_ID || ""
		}),
	],
	callbacks: {
		async jwt({ token, user, trigger, session }) {
			if (user) {
				token.id = user.id!;
				token.role = user.role;
				token.roleExplicitlyChosen = user.roleExplicitlyChosen;
			}

			// Only fetch from database during session updates or when explicitly triggered
			// This prevents Prisma from running in Edge Runtime during middleware execution
			if (token && !token.roleExplicitlyChosen && (trigger === "update" || trigger === "signIn")) {
				try {
					// Check if we're in Edge Runtime by trying to access process
					if (typeof process !== 'undefined' && process.env) {
						const dbUser = await prisma.user.findUnique({
							where: { id: token.id as string },
							select: { roleExplicitlyChosen: true }
						});
						if (dbUser) {
							token.roleExplicitlyChosen = dbUser.roleExplicitlyChosen;
						}
					}
				} catch (error) {
					// Silently fail if running in Edge Runtime (middleware)
					console.log("JWT callback: Skipping database query in Edge Runtime");
				}
			}

			return token;
		},
		async session({ session, token }) {
			if (session.user) {
				session.user.id = token.id as string;
				session.user.role = token.role as Role
				session.user.roleExplicitlyChosen = Boolean(token.roleExplicitlyChosen);
			}
			return session;
		},
		async signIn({ user, account, profile }) {
			if (account?.provider === 'google') {
				const existingUser = await prisma.user.findUnique({
					where: { email: profile?.email as string }
				});

				if (existingUser) {
					await prisma.user.update({
						where: {
							email: profile?.email as string
						},
						data: {
							emailVerified: new Date()
						}
					});
				}

				return true;
			}
			return true;
		},
		async redirect({ url, baseUrl }) {
			// If user is signing in and no specific redirect URL, go to dashboard
			if (url.startsWith("/")) {
				if (url === "/signin" || url === "/signup") {
					return `${baseUrl}/dashboard`
				}
				return `${baseUrl}${url}`
			}
			if (new URL(url).origin === baseUrl) return url
			return `${baseUrl}/dashboard`
		},
	},
	pages: {
		signIn: '/signin',
		error: '/error',
		signOut: '/'
	},
	session: {
		strategy: "jwt",
	},
	secret: process.env.NEXTAUTH_SECRET,
	cookies: {
		csrfToken: {
			name: "next-auth.csrf-token",
			options: {
				httpOnly: true,
				sameSite: "lax",
				path: "/",
				secure: process.env.NODE_ENV === "production",
			},
		},
	},
})