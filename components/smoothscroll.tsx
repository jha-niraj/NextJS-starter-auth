"use client"

import type React from "react"
import { useEffect } from "react"
import { ReactLenis, useLenis } from "@/lib/lenis"

interface LenisProps {
    children: React.ReactNode
}

function SmoothScroll({ children }: LenisProps) {
    const lenis = useLenis(({ }) => { })

    useEffect(() => {
        if (!lenis) return;

        // Initial resize with a delay to ensure all content is loaded
        const initializeScroll = () => {
            lenis.resize();
        };

        // Delay initial resize to allow for component mounting
        setTimeout(initializeScroll, 300);

        // Handle window resize with debouncing
        let resizeTimeout: NodeJS.Timeout;
        const handleResize = () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                if (lenis) {
                    lenis.resize();
                }
            }, 200);
        };

        // Set up a mutation observer for significant DOM changes only
        let mutationTimeout: NodeJS.Timeout;
        const mutationObserver = new MutationObserver((mutations) => {
            // Only respond to significant changes
            const hasSignificantChange = mutations.some(mutation =>
                mutation.type === 'childList' && mutation.addedNodes.length > 0
            );

            if (hasSignificantChange) {
                clearTimeout(mutationTimeout);
                mutationTimeout = setTimeout(() => {
                    if (lenis) {
                        lenis.resize();
                    }
                }, 150);
            }
        });

        // Event listeners
        window.addEventListener("resize", handleResize);
        window.addEventListener("load", initializeScroll);

        // Observe the main content area instead of entire body
        if (typeof window !== "undefined") {
            const main = document.querySelector('main');
            if (main) {
                mutationObserver.observe(main, {
                    childList: true,
                    subtree: true,
                });
            }
        }

        // Clean up
        return () => {
            mutationObserver.disconnect();
            window.removeEventListener("resize", handleResize);
            window.removeEventListener("load", initializeScroll);
            clearTimeout(resizeTimeout);
            clearTimeout(mutationTimeout);
        };
    }, [lenis]);

    return (
        <ReactLenis
            root
            options={{
                duration: 1.2, // Slightly longer duration for smoother scrolling
                easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
                orientation: "vertical",
                gestureOrientation: "vertical",
                smoothWheel: true,
                wheelMultiplier: 0.8, // Reduced for smoother scrolling
                touchMultiplier: 0.8, // Reduced for smoother scrolling
                syncTouch: true,
                syncTouchLerp: 0.1, // Slightly higher for better responsiveness
                infinite: false,
                autoResize: true,
                // @ts-expect-error - smoothTouch is not defined in the type
                smoothTouch: false,
            }}
        >
            {children}
        </ReactLenis>
    )
}

export default SmoothScroll;