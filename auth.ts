import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "@/lib/prisma";
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import NextAuth, { NextAuthOptions } from "next-auth";
import { Role } from '@prisma/client';
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
	adapter: PrismaAdapter(prisma),
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
					throw new Error("EMAIL_PASSWORD_REQUIRED");
				}

				console.log("Authorizing user with email:", credentials.email);

				try {
					const user = await prisma.user.findUnique({
						where: {
							email: credentials.email as string
						}
					});

					if (!user) {
						throw new Error("USER_NOT_FOUND");
					}

					if (!user.password) {
						throw new Error("OAUTH_ACCOUNT");
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
								email: freshUser.email!,
								name: freshUser.name || freshUser.email || "User",
								image: freshUser.image || null,
								role: freshUser.role,
								emailVerified: freshUser.emailVerified ? new Date() : null,
							};
						} else {
							throw new Error("EMAIL_NOT_VERIFIED");
						}
					}

					// Check if email is verified for regular password login
					if (!user.emailVerified) {
						throw new Error("EMAIL_NOT_VERIFIED");
					}

					// Regular password check using bcryptjs
					const isPasswordValid = await bcrypt.compare(credentials.password as string, user.password);
					console.log("Password Valid: " + isPasswordValid);

					if (!isPasswordValid) {
						throw new Error("INVALID_CREDENTIALS");
					}

					return {
						id: user.id,
						email: user.email!,
						name: user.name || user.email || "User",
						image: user.image || null,
						role: user.role,
						emailVerified: user.emailVerified ? new Date() : null,
					};
				} catch (error) {
					console.error("Authorization error:", error);
					// Re-throw the error to be handled by NextAuth
					throw error;
				}
			}
		}),
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID || "",
			clientSecret: process.env.GOOGLE_SECRET_ID || "",
			authorization: {
				params: {
					scope: "https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile",
				},
			},
		}),
	],
	callbacks: {
		async jwt({ token, user, trigger }) {
			// Only add user data on initial sign in
			if (user) {
				token.id = user.id!;
				token.role = user.role;
				token.emailVerified = user.emailVerified;
			}

			// Only fetch fresh data if explicitly triggered or if essential data is missing
			if (trigger === 'update') {
				try {
					const dbUser = await prisma.user.findUnique({
						where: { id: token.id as string },
						select: {
							emailVerified: true,
							role: true,
						}
					});

					if (dbUser) {
						token.emailVerified = dbUser.emailVerified ? new Date() : null;
						token.role = dbUser.role;
					}
				} catch (error) {
					console.error('JWT callback error:', error);
				}
			}

			return token;
		},
		async session({ session, token }) {
			if (session.user) {
				session.user.id = token.id as string;
				session.user.role = token.role as Role;
				session.user.emailVerified = token.emailVerified ? new Date() : null;
			}
			return session;
		},
		async signIn({ user, account, profile }) {
			if (account?.provider === 'google') {
				const existingUser = await prisma.user.findUnique({
					where: { email: profile?.email as string }
				});

				if (existingUser) {
					// Update email verification for existing Google users
					await prisma.user.update({
						where: {
							email: profile?.email as string
						},
						data: {
							emailVerified: new Date()
						}
					});
					return true;
				}

				// For new Google users, emailVerified will be set automatically by adapter
				return true;
			}
			return true;
		},
		async redirect({ url, baseUrl }) {
			// Handle callback URLs from middleware and auth dialog
			if (url.startsWith("/")) return `${baseUrl}${url}`
			if (new URL(url).origin === baseUrl) return url
			
			// Default redirect
			return baseUrl
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
}

export default NextAuth(authOptions)

// Helper function for server-side auth check (compatible with v5 syntax used in the app)
export async function auth() {
	const { getServerSession } = await import('next-auth/next');
	return await getServerSession(authOptions);
}

// Export getServerSession for direct use if needed
export { getServerSession } from 'next-auth/next';