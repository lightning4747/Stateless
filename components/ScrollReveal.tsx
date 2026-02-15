import { useEffect, useRef, useState } from "react";

interface ScrollRevealProps {
    children: React.ReactNode;
    className?: string;
    threshold?: number;
}

const ScrollReveal = ({ children, className = "", threshold = 0.1 }: ScrollRevealProps) => {
    const ref = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.unobserve(element);
                }
            },
            {
                threshold,
                rootMargin: "0px 0px -50px 0px"
            }
        );

        observer.observe(element);

        return () => {
            if (element) observer.unobserve(element);
        };
    }, [threshold]);

    return (
        <div
            ref={ref}
            className={`transition-all duration-1000 ease-out transform ${isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                } ${className}`}
        >
            {children}
        </div>
    );
};

export default ScrollReveal;
