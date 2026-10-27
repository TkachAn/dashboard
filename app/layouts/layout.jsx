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
    /*const [isMenuOpen, setIsMenuOpen] = useState(false);*/

    return (
        <Container className={s.dashboard_layout}>
            {/* Затемнение фона для мобильных при открытом сайдбаре */}
            <div
                className={`${s.overlay} ${isMobileOpen ? s.overlay_active : ''}`}
                onClick={() => setIsMobileOpen(false)}
            />
            {/* Закладка для открытия меню (видна только когда меню закрыто) */}
            {!isMobileOpen && (
                <button
                    className={s.menuToggleTab}
                    onClick={() => setIsMenuOpen(true)}
                    title="Открыть меню"
                >
                    ➔
                </button>
            )}
            {/* Сайдбар (на мобильных — всплывающий, на десктопе — в flex-ряду) */}
            <div className={`${s.sidebar_container} ${isMobileOpen ? s.sidebar_open : ''}`}>
                <Sidebar>
                    {sidebar ?? <SmartMenu />}
                </Sidebar>
            </div>

            {/* Правая обёртка: Header + Main */}
            <Wrapper className={s.content_wrapper}>
                <Header title="Header" id="0" className={s.header}>
                    {/* Кнопка гамбургер для мобильных устройств */}
                    <button
                        className={s.burger_btn}
                        onClick={() => setIsMobileOpen(!isMobileOpen)}
                        aria-label="Открыть меню"
                    >
                        ☰
                    </button>
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