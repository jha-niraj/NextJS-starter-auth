"use client"

import { useState } from "react"
import { subscribeToNewsletter } from "@/actions/newsletter.action"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2, Mail } from "lucide-react"
import { toast } from "sonner"

export function NewsletterSubscription() {
    const [email, setEmail] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!email) {
            toast.success("Email required", {
                description: "Please enter your email address",
            })
            return
        }

        setIsLoading(true)

        try {
            const result = await subscribeToNewsletter(email)

            if (result.success) {
                toast.success("Success!", {
                    description: result.message,
                })
                setEmail("") // Clear the input on success
            } else {
                toast.error("Subscription failed", {
                    description: result.message,
                })
            }
        } catch (error) {
            console.error("Newsletter subscription error:", error)
            toast.error("Error", {
                description: "Something went wrong. Please try again.",
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-3">
            <div className="flex gap-2">
                <div className="relative flex-1">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={isLoading}
                        className="pl-10"
                    />
                </div>
                <Button
                    type="submit"
                    disabled={isLoading}
                    className="shrink-0"
                >
                    {
                        isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Subscribing...
                            </>
                        ) : (
                            "Subscribe"
                        )
                    }
                </Button>
            </div>
        </form>
    )
}