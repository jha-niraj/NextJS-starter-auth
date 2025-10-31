'use server';

import { prisma } from "@/lib/prisma";
import { z } from "zod";

const newsletterSchema = z.object({
    email: z.string().email("Please enter a valid email address"),
});

export async function subscribeToNewsletter(email: string) {
    try {
        // Validate email
        const validatedData = newsletterSchema.parse({ email });

        // Check if email already exists
        const existing = await prisma.newsletter.findUnique({
            where: { email: validatedData.email },
        });

        if (existing) {
            if (existing.isActive) {
                return {
                    success: false,
                    message: "This email is already subscribed to our newsletter!",
                };
            } else {
                // Reactivate subscription
                await prisma.newsletter.update({
                    where: { email: validatedData.email },
                    data: { isActive: true, subscribedAt: new Date() },
                });
                return {
                    success: true,
                    message: "Welcome back! Your newsletter subscription has been reactivated.",
                };
            }
        }

        // Create new subscription
        await prisma.newsletter.create({
            data: {
                email: validatedData.email,
            },
        });

        return {
            success: true,
            message: "Thank you for subscribing! You'll receive our latest updates.",
        };
    } catch (error) {
        if (error instanceof z.ZodError) {
            return {
                success: false,
                message: error.errors[0].message,
            };
        }

        console.error("Newsletter subscription error:", error);
        return {
            success: false,
            message: "Something went wrong. Please try again later.",
        };
    }
}

export async function unsubscribeFromNewsletter(email: string) {
    try {
        const validatedData = newsletterSchema.parse({ email });

        await prisma.newsletter.update({
            where: { email: validatedData.email },
            data: { isActive: false },
        });

        return {
            success: true,
            message: "You have been unsubscribed from our newsletter.",
        };
    } catch (error) {
        console.error("Newsletter unsubscribe error:", error);
        return {
            success: false,
            message: "Something went wrong. Please try again later.",
        };
    }
}