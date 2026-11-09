'use client';

import React from 'react';
import Link from 'next/link';
import s from './s.module.css';
import { ArrowRight } from 'lucide-react';

export function RoomIndicatorCard({
    href,
    title,
    subtitle,
    icon: Icon,
    metrics = [],
    statusText,
    badge = "Live"
}) {
    return (
        <Link href={href} className={s.cardLink}>
            <article className={s.card}>
                <header className={s.header}>
                    <div className={s.titleRow}>
                        {Icon && (
                            <span className={s.iconWrapper}>
                                <Icon size={20} />
                            </span>
                        )}
                        <div className={s.titleBlock}>
                            <h3 className={s.title}>{title}</h3>
                            {subtitle && <p className={s.subtitle}>{subtitle}</p>}
                        </div>
                    </div>
                    {badge && <span className={s.badge}>{badge}</span>}
                </header>

                <div className={s.metricsGrid}>
                    {metrics.map((m, idx) => (
                        <div key={idx} className={`${s.metricItem} ${s[m.color || 'default']}`}>
                            <span className={s.metricLabel}>{m.label}</span>
                            <div className={s.metricValueRow}>
                                <span className={s.metricValue}>{m.value}</span>
                                {m.unit && <span className={s.metricUnit}>{m.unit}</span>}
                            </div>
                        </div>
                    ))}
                </div>

                <footer className={s.footer}>
                    <span className={s.statusText}>{statusText}</span>
                    <span className={s.actionLink}>
                        <span>Управление</span>
                        <ArrowRight size={14} />
                    </span>
                </footer>
            </article>
        </Link>
    );
}
