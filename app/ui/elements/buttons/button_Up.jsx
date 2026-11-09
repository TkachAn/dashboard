"use client";

import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";
import styles from "./button_Up.module.css";

export function ScrollToTopButton({ className = "", threshold = 300 } = {}) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => {
            // Кнопка появляется, если прокрутить страницу вниз больше порога (по умолчанию 300px)
            if (window.scrollY > threshold) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        // Первичная проверка при монтировании
        toggleVisibility();

        window.addEventListener("scroll", toggleVisibility, { passive: true });
        return () => window.removeEventListener("scroll", toggleVisibility);
    }, [threshold]);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    return (
        <button
            type="button"
            onClick={scrollToTop}
            className={`${styles.scrollToTopBtn} ${isVisible ? styles.visible : ""} ${className}`.trim()}
            aria-label="Вернуться наверх"
            title="Вернуться наверх"
            aria-hidden={!isVisible}
            tabIndex={isVisible ? 0 : -1}
        >
            <ArrowUp size={24} />
        </button>
    );
}
