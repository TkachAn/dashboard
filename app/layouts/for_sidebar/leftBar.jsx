'use client';

import React, { useEffect, useState } from "react";
import s from "./s.module.css";

const IGNORE_CLASS = "ignore-smart-menu";

export function SmartMenu() {
    const [anchors, setAnchors] = useState([]);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 1038);
        handleResize();
        window.addEventListener("resize", handleResize);

        const updateAnchors = () => {
            const elements = document.querySelectorAll(`[id][title]:not(.${IGNORE_CLASS})`);
            const foundAnchors = [];

            elements.forEach((el) => {
                const id = el.getAttribute("id")?.trim();
                const title = el.getAttribute("title")?.trim();

                if (!id || !title) return;

                let level = 1;
                let parent = el.parentElement;

                while (parent) {
                    const isIgnored = parent.classList?.contains(IGNORE_CLASS);
                    const pId = parent.getAttribute("id")?.trim();
                    const pTitle = parent.getAttribute("title")?.trim();

                    if (!isIgnored && pId && pTitle) {
                        level++;
                    }
                    parent = parent.parentElement;
                }

                foundAnchors.push({ id, title, level });
            });

            setAnchors(foundAnchors);
        };

        updateAnchors();
        window.addEventListener("content-updated", updateAnchors);

        return () => {
            window.removeEventListener("resize", handleResize);
            window.removeEventListener("content-updated", updateAnchors);
        };
    }, []);

    if (anchors.length === 0) return null;

    // Плавный скролл к секции при клике
    const handleClick = (e, id) => {
        e.preventDefault();
        const targetElement = document.getElementById(id);
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            // Обновляем хэш в строке браузера без резкого прыжка
            window.history.pushState(null, '', `#${id}`);
        }
    };

    const NavList = (
        <ul className={s.list}>
            {anchors.map((anchor) => (
                <li key={anchor.id} className={s.item}>
                    <a
                        href={`#${anchor.id}`}
                        onClick={(e) => handleClick(e, anchor.id)}
                        style={{
                            '--level': anchor.level,
                            paddingLeft: `calc((${anchor.level} - 1) * 20px)`
                        }}
                        className={s.link}
                    >
                        {anchor.title}
                    </a>
                </li>
            ))}
        </ul>
    );
    return (
        <nav className={s.anchorNav}>
            {NavList}
        </nav>
    );

    /*
    return (
        <nav className={s.anchorNav}>
            {isMobile ? (
                <details className={s.mobileDetails}>
                    <summary className={s.summary}>Меню раздела</summary>
                    {NavList}
                </details>
            ) : (
                NavList
            )}
        </nav>
    );*/
}