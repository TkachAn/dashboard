import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react"; // Используем иконку из вашего package.json

export default function ScrollToTopButton() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => {
            // Кнопка появится, если прокрутить страницу вниз больше чем на 400 пикселей
            if (window.scrollY > 400) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener("scroll", toggleVisibility);

        // Обязательно очищаем слушатель событий при размонтировании
        return () => window.removeEventListener("scroll", toggleVisibility);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth", // Благодаря вашему стилю в index.css это будет супер-плавно
        });
    };

    // Если прокрутки мало, компонент ничего не рендерит
    if (!isVisible) return null;

    return (
        <button
            onClick={scrollToTop}
            className="back-to-top-btn"
            aria-label="Вернуться наверх"
        >
            <ArrowUp size={24} />
        </button>
    );
}