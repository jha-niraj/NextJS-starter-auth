"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
    Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram, Youtube, Calendar,
    Users, TrendingUp, Shield, Award, Ticket, ArrowUp
} from "lucide-react";
import { NewsletterSubscription } from "@/components/newslettersubscription";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function OrganizerFooterSection() {
    const handleComingSoon = (featureName: string) => {
        toast.info("Coming Soon!", {
            description: `${featureName} is currently under development. We'll notify you when it's ready!`,
            duration: 3000,
        });
    };

    const quickLinks = [
        { name: "Home", href: "/organizer" },
        { name: "Features", href: "/organizer#features" },
        { name: "Event Types", href: "/organizer#event-types" },
        { name: "Pricing", href: "/organizer#certificates" },
        { name: "Testimonials", href: "/organizer#testimonials" },
    ];

    const resources = [
        { name: "Documentation", href: "/docs", comingSoon: true },
        { name: "API Reference", href: "/docs/api", comingSoon: true },
        { name: "Help Center", href: "/help", comingSoon: true },
        { name: "Video Tutorials", href: "/tutorials", comingSoon: true },
        { name: "Best Practices", href: "/best-practices", comingSoon: true },
        { name: "Case Studies", href: "/case-studies", comingSoon: true },
    ];

    const eventTypes = [
        { name: "Hackathons", href: "/organizer#event-types", icon: Calendar },
        { name: "Job Fairs", href: "/organizer#event-types", icon: Users },
        { name: "Cultural Events", href: "/organizer#event-types", icon: TrendingUp },
        { name: "Workshops", href: "/organizer#event-types", icon: Shield },
        { name: "Conferences", href: "/organizer#event-types", icon: Award },
    ];

    const company = [
        { name: "About Us", href: "/about", comingSoon: false },
        { name: "Contact", href: "/contact", comingSoon: false },
        { name: "Careers", href: "/careers", comingSoon: true },
        { name: "Press Kit", href: "/press", comingSoon: true },
        { name: "Partners", href: "/partners", comingSoon: true },
    ];

    const legal = [
        { name: "Privacy Policy", href: "/privacy", comingSoon: false },
        { name: "Terms of Service", href: "/terms", comingSoon: false },
        { name: "Cookie Policy", href: "/cookies", comingSoon: true },
        { name: "Refund Policy", href: "/refunds", comingSoon: false },
        { name: "Security", href: "/security", comingSoon: true },
    ];

    const socialLinks = [
        { name: "Facebook", icon: Facebook, href: "https://facebook.com/eventeye" },
        { name: "Twitter", icon: Twitter, href: "https://twitter.com/eventeye" },
        { name: "LinkedIn", icon: Linkedin, href: "https://linkedin.com/company/eventeye" },
        { name: "Instagram", icon: Instagram, href: "https://instagram.com/eventeye" },
        { name: "YouTube", icon: Youtube, href: "https://youtube.com/@eventeye" },
    ];

    const features = [
        { icon: Ticket, text: "100% Secure Payments" },
        { icon: Shield, text: "24/7 Support" },
        { icon: Award, text: "Trusted by 10,000+ Organizers" },
    ];

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    return (
        <footer className="bg-gradient-to-b from-background to-muted/20 border-t border-border">
            <div className="max-w-7xl mx-auto px-6 py-12 border-b border-border">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                    <div>
                        <h3 className="text-2xl font-bold mb-2">Stay Updated</h3>
                        <p className="text-muted-foreground">
                            Get the latest updates on new features, best practices, and event management tips
                        </p>
                    </div>
                    <div>
                        <NewsletterSubscription />
                    </div>
                </div>
            </div>
            <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 mb-12">
                    <div>
                        <h4 className="font-semibold mb-4 text-foreground">Quick Links</h4>
                        <ul className="space-y-3">
                            {
                                quickLinks.map((link) => (
                                    <li key={link.name}>
                                        <Link
                                            href={link.href}
                                            className="text-muted-foreground hover:text-primary transition-colors text-sm"
                                        >
                                            {link.name}
                                        </Link>
                                    </li>
                                ))
                            }
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-4 text-foreground">Event Types</h4>
                        <ul className="space-y-3">
                            {
                                eventTypes.map((type) => (
                                    <li key={type.name}>
                                        <Link
                                            href={type.href}
                                            className="text-muted-foreground hover:text-primary transition-colors text-sm flex items-center gap-2"
                                        >
                                            <type.icon className="w-3 h-3" />
                                            {type.name}
                                        </Link>
                                    </li>
                                ))
                            }
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-4 text-foreground">Resources</h4>
                        <ul className="space-y-3">
                            {
                                resources.map((link) => (
                                    <li key={link.name}>
                                        {
                                            link.comingSoon ? (
                                                <button
                                                    onClick={() => handleComingSoon(link.name)}
                                                    className="text-muted-foreground hover:text-primary transition-colors text-sm text-left cursor-pointer"
                                                >
                                                    {link.name}
                                                </button>
                                            ) : (
                                                <Link
                                                    href={link.href}
                                                    className="text-muted-foreground hover:text-primary transition-colors text-sm"
                                                >
                                                    {link.name}
                                                </Link>
                                            )
                                        }
                                    </li>
                                ))
                            }
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-4 text-foreground">Company</h4>
                        <ul className="space-y-3">
                            {
                                company.map((link) => (
                                    <li key={link.name}>
                                        {
                                            link.comingSoon ? (
                                                <button
                                                    onClick={() => handleComingSoon(link.name)}
                                                    className="text-muted-foreground hover:text-primary transition-colors text-sm text-left cursor-pointer"
                                                >
                                                    {link.name}
                                                </button>
                                            ) : (
                                                <Link
                                                    href={link.href}
                                                    className="text-muted-foreground hover:text-primary transition-colors text-sm"
                                                >
                                                    {link.name}
                                                </Link>
                                            )
                                        }
                                    </li>
                                ))
                            }
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-4 text-foreground">Legal</h4>
                        <ul className="space-y-3">
                            {
                                legal.map((link) => (
                                    <li key={link.name}>
                                        {
                                            link.comingSoon ? (
                                                <button
                                                    onClick={() => handleComingSoon(link.name)}
                                                    className="text-muted-foreground hover:text-primary transition-colors text-sm text-left cursor-pointer"
                                                >
                                                    {link.name}
                                                </button>
                                            ) : (
                                                <Link
                                                    href={link.href}
                                                    className="text-muted-foreground hover:text-primary transition-colors text-sm"
                                                >
                                                    {link.name}
                                                </Link>
                                            )
                                        }
                                    </li>
                                ))
                            }
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-4 text-foreground">Legal</h4>
                        <ul className="space-y-3">
                            {
                                legal.map((link) => (
                                    <li key={link.name}>
                                        {
                                            link.comingSoon ? (
                                                <button
                                                    onClick={() => handleComingSoon(link.name)}
                                                    className="text-muted-foreground hover:text-primary transition-colors text-sm text-left cursor-pointer"
                                                >
                                                    {link.name}
                                                </button>
                                            ) : (
                                                <Link
                                                    href={link.href}
                                                    className="text-muted-foreground hover:text-primary transition-colors text-sm"
                                                >
                                                    {link.name}
                                                </Link>
                                            )
                                        }
                                    </li>
                                ))
                            }
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-4 text-foreground">Contact Us</h4>
                        <ul className="space-y-3">
                            <li className="flex items-start gap-2 text-sm text-muted-foreground">
                                <Mail className="w-4 h-4 mt-0.5 shrink-0 text-primary" />
                                <a href="mailto:support@eventeye.com" className="hover:text-primary transition-colors">
                                    support@eventeye.com
                                </a>
                            </li>
                            <li className="flex items-start gap-2 text-sm text-muted-foreground">
                                <Phone className="w-4 h-4 mt-0.5 shrink-0 text-primary" />
                                <a href="tel:+1234567890" className="hover:text-primary transition-colors">
                                    +1 (234) 567-890
                                </a>
                            </li>
                            <li className="flex items-start gap-2 text-sm text-muted-foreground">
                                <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-primary" />
                                <span>
                                    123 Event Street<br />
                                    Tech City, TC 12345
                                </span>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-8 mb-8 border-y border-border">
                    {
                        features.map((feature, index) => {
                            const IconComponent = feature.icon;
                            return (
                                <motion.div
                                    key={feature.text}
                                    initial={{ opacity: 0, y: 10 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, amount: 0.1 }}
                                    transition={{ delay: index * 0.1, duration: 0.5 }}
                                    className="flex items-center justify-center gap-3"
                                >
                                    <div className="p-2 rounded-lg bg-primary/10">
                                        <IconComponent className="w-5 h-5 text-primary" />
                                    </div>
                                    <span className="font-medium text-sm">{feature.text}</span>
                                </motion.div>
                            );
                        })
                    }
                </div>
                <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-8 border-t border-border">
                    <div className="text-center md:text-left">
                        <div className="flex items-center gap-2 justify-center md:justify-start mb-2">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center">
                                <Calendar className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-xl font-bold">EventEye</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            © {new Date().getFullYear()} EventEye. All rights reserved.
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                            Empowering event organizers worldwide
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        {
                            socialLinks.map((social) => {
                                const IconComponent = social.icon;
                                return (
                                    <Link
                                        key={social.name}
                                        href={social.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-2 rounded-lg bg-card border border-border hover:border-primary hover:bg-primary/10 transition-all group"
                                        aria-label={social.name}
                                    >
                                        <IconComponent className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                                    </Link>
                                );
                            })
                        }
                    </div>
                </div>
                <div className="mt-8 pt-6 border-t border-border text-center">
                    <p className="text-xs text-muted-foreground mb-3">Trusted Payment Partners</p>
                    <div className="flex items-center justify-center gap-6 flex-wrap">
                        <div className="px-4 py-2 rounded-lg bg-card border border-border text-sm font-medium text-muted-foreground">
                            Razorpay
                        </div>
                        <div className="px-4 py-2 rounded-lg bg-card border border-border text-sm font-medium text-muted-foreground">
                            Stripe
                        </div>
                        <div className="px-4 py-2 rounded-lg bg-card border border-border text-sm font-medium text-muted-foreground">
                            SSL Secured
                        </div>
                        <div className="px-4 py-2 rounded-lg bg-card border border-border text-sm font-medium text-muted-foreground">
                            PCI DSS Compliant
                        </div>
                    </div>
                </div>
                <div className="mt-8 border-t border-neutral-200/20 dark:border-neutral-800/20 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                        © {new Date().getFullYear()} EventEye. All rights reserved.
                    </p>
                    <div className="flex items-center gap-3">
                        <Button
                            onClick={scrollToTop}
                            variant="outline"
                            size="sm"
                            className="border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-2xl"
                        >
                            <ArrowUp className="h-4 w-4 mr-1" />
                            Back to Top
                        </Button>
                        <Link href="/signin?ref=organizer">
                            <Button
                                variant="ghost"
                                className="text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white rounded-2xl"
                            >
                                Sign In
                            </Button>
                        </Link>
                        <Link href="/signup?ref=organizer">
                            <Button className="bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-black rounded-2xl font-semibold transition-all duration-200">
                                Get Started
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}