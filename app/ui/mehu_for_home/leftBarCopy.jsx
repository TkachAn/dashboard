'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import s from './s.module.css';
import {
    LayoutDashboard,
    Compass,
    Wind,
    Tv,
    Bed,
    Wrench,
    Utensils,
    Bath,
    DoorOpen,
    Route,
    Thermometer,
    FlaskConical
} from 'lucide-react';

const MENU_GROUPS = [
    {
        title: 'Обзор',
        items: [
            { href: '/', label: 'Главный дашборд', icon: LayoutDashboard }
        ]
    },
    {
        title: 'Помещения',
        items: [
            { href: '/rooms/se-balcony', label: 'Лоджия ЮВ', icon: Compass },
            { href: '/rooms/nw-balcony', label: 'Лоджия СЗ', icon: Wind },
            { href: '/rooms/living-room', label: 'Гостиная (Зал)', icon: Tv },
            { href: '/rooms/bedroom', label: 'Спальня', icon: Bed },
            { href: '/rooms/workshop', label: 'Мастерская', icon: Wrench },
            { href: '/rooms/kitchen', label: 'Кухня', icon: Utensils },
            { href: '/rooms/bathroom', label: 'Ванная комната', icon: Bath },
            { href: '/rooms/hallway', label: 'Прихожая', icon: DoorOpen },
            { href: '/rooms/corridor-1', label: 'Коридор 1 (Общий)', icon: Route },
            { href: '/rooms/corridor-2', label: 'Коридор 2 (Внутр.)', icon: Route },
        ]
    },
    {
        title: 'Сервисы и лаборатория',
        items: [
            { href: '/climate', label: 'Климат-контроль', icon: Thermometer },
            { href: '/pages/test', label: 'Тестовая страница', icon: FlaskConical },
        ]
    }
];

export function AiMenu() {
    const pathname = usePathname();

    return (
        <nav className={s.navContainer} aria-label="Основная навигация">
            {MENU_GROUPS.map((group, groupIdx) => (
                <div key={groupIdx} className={s.group}>
                    <div className={s.groupTitle}>{group.title}</div>
                    <ul className={s.list}>
                        {group.items.map((item) => {
                            const Icon = item.icon;
                            const isActive = pathname === item.href;

                            return (
                                <li key={item.href} className={s.item}>
                                    <Link
                                        href={item.href}
                                        className={`${s.link} ${isActive ? s.activeLink : ''}`}
                                    >
                                        <span className={s.iconWrapper}>
                                            <Icon size={18} />
                                        </span>
                                        <span className={s.linkLabel}>{item.label}</span>
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            ))}
        </nav>
    );
}
