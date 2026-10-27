'use client';

import { useState } from 'react';
import { Container, Header, Sidebar, Wrapper, Main } from "../ui/structure/struct";
import s from "./s.module.css";
import { Logotype } from "../layouts/for_header/logotype";
import { SmartMenu } from "../layouts/for_sidebar/leftBar";
import { ThemeToggle } from "../ui/elements/buttons/IconButtons";

export function Dashboard_Layout({ children, sidebar }) {
    // Состояние для мобильного меню (открыто / закрыто)
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    // Функция для автоматического закрытия меню при клике на навигацию
    const handleNavClick = () => {
        setIsMobileOpen(false);
    };

    return (
        <Container className={s.dashboard_layout}>
            {/* Фиксированная кнопка-гамбургер (скрывается, когда меню открыто) */}
            <button
                className={`${s.burger_btn} ${isMobileOpen ? s.burger_hidden : ''}`}
                onClick={() => setIsMobileOpen(true)}
                aria-label="Открыть меню"
            >
                ☰
            </button>

            {/* Затемнение фона для мобильных при открытом сайдбаре */}
            <div
                className={`${s.overlay} ${isMobileOpen ? s.overlay_active : ''}`}
                onClick={() => setIsMobileOpen(false)}
            />

            {/* Сайдбар с обработчиком клика для автозакрытия */}
            <div
                className={`${s.sidebar_container} ${isMobileOpen ? s.sidebar_open : ''}`}
                onClick={handleNavClick}
            >
                <Sidebar>
                    {sidebar ?? <SmartMenu />}
                </Sidebar>
            </div>

            {/* Правая обёртка: Header + Main */}
            <Wrapper className={s.content_wrapper}>
                <Header title="Header" id="0" className={s.header}>
                    <Logotype />
                    <ThemeToggle />
                </Header>

                <Main className={s.main_content}>
                    {children}
                </Main>
            </Wrapper>
        </Container>
    );
}