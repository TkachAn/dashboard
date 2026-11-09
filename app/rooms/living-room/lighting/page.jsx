'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Dashboard_Layout } from '@/app/layouts/layout';
import { Section, Article, Card } from '@/app/ui/structure/struct';
import { ArrowLeft, Lightbulb, Power } from 'lucide-react';

export default function LivingRoomLightingPage() {
    const [lights, setLights] = useState({
        ceiling: true,   // Потолочные светильники
        dining: false,   // Над столовой зоной
        work: false,     // Над рабочей зоной (ручной)
        passage: true,   // Проходная зона
        tv: false        // Подсветка телевизора
    });

    const toggle = (key) => {
        setLights((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    const allOff = () => {
        setLights({ ceiling: false, dining: false, work: false, passage: false, tv: false });
    };

    const eveningScene = () => {
        setLights({ ceiling: false, dining: true, work: false, passage: false, tv: true });
    };

    const allOn = () => {
        setLights({ ceiling: true, dining: true, work: true, passage: true, tv: true });
    };

    const lightSources = [
        {
            key: 'ceiling',
            title: 'Потолочные светильники',
            desc: 'Центральная группа освещения',
            type: 'Радиоуправление BroadLink RF 433 МГц'
        },
        {
            key: 'dining',
            title: 'Над столовой зоной',
            desc: 'Локальный подвесной свет над обеденным столом',
            type: 'Радиоуправление BroadLink RF 433 МГц'
        },
        {
            key: 'work',
            title: 'Над рабочей зоной',
            desc: 'Подсветка рабочего стола',
            type: 'Физический настенный выключатель'
        },
        {
            key: 'passage',
            title: 'Проходная зона',
            desc: 'Направляемый коридорный свет вдоль зоны перемещения',
            type: 'Радиоуправление BroadLink RF 433 МГц'
        },
        {
            key: 'tv',
            title: 'Подсветка телевизора',
            desc: 'Декоративная контурная подсветка ТВ-зоны',
            type: 'Радиоуправление BroadLink RF 433 МГц'
        }
    ];

    return (
        <Dashboard_Layout title="Гостиная — Освещение">
            <div style={{ marginBottom: 16 }}>
                <Link
                    href="/rooms/living-room"
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 8,
                        color: 'var(--accent-primary)',
                        fontWeight: 600,
                        fontSize: '0.9rem',
                        padding: '8px 16px',
                        backgroundColor: 'var(--bg-surface)',
                        border: '1px solid var(--border-default)',
                        borderRadius: 8,
                        textDecoration: 'none'
                    }}
                >
                    <ArrowLeft size={16} />
                    <span>Вернуться в Гостиную</span>
                </Link>
            </div>

            <Section title="Управление освещением гостиной (5 зон)">
                <Article title="Индивидуальное переключение зон и быстрые сценарии">
                    {/* Быстрые сценарии */}
                    <div style={{
                        display: 'flex',
                        gap: 10,
                        flexWrap: 'wrap',
                        marginBottom: 20,
                        padding: '14px 16px',
                        backgroundColor: 'var(--card-bg)',
                        border: '1px solid var(--border-default)',
                        borderRadius: 12
                    }}>
                        <span style={{ fontWeight: 600, fontSize: '0.9rem', alignSelf: 'center', marginRight: 10 }}>
                            Сценарии:
                        </span>
                        <button
                            type="button"
                            onClick={allOff}
                            style={{
                                padding: '8px 14px',
                                borderRadius: 8,
                                border: '1px solid var(--border-default)',
                                backgroundColor: 'var(--bg-surface)',
                                cursor: 'pointer',
                                fontWeight: 600,
                                fontSize: '0.82rem'
                            }}
                        >
                            Выключить всё
                        </button>
                        <button
                            type="button"
                            onClick={eveningScene}
                            style={{
                                padding: '8px 14px',
                                borderRadius: 8,
                                border: '1px solid var(--accent-primary)',
                                backgroundColor: 'color-mix(in srgb, var(--accent-primary) 12%, transparent)',
                                color: 'var(--accent-primary)',
                                cursor: 'pointer',
                                fontWeight: 600,
                                fontSize: '0.82rem'
                            }}
                        >
                            Вечерний кино-режим (Столовая + ТВ)
                        </button>
                        <button
                            type="button"
                            onClick={allOn}
                            style={{
                                padding: '8px 14px',
                                borderRadius: 8,
                                border: '1px solid var(--border-default)',
                                backgroundColor: 'var(--bg-surface)',
                                cursor: 'pointer',
                                fontWeight: 600,
                                fontSize: '0.82rem'
                            }}
                        >
                            Включить всё
                        </button>
                    </div>

                    {/* Сетка карточек 5 источников света */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                        gap: 16
                    }}>
                        {lightSources.map((item) => {
                            const isOn = lights[item.key];

                            return (
                                <div
                                    key={item.key}
                                    style={{
                                        backgroundColor: 'var(--card-bg)',
                                        border: `1px solid ${isOn ? 'var(--accent-primary)' : 'var(--border-default)'}`,
                                        borderRadius: 14,
                                        padding: 16,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'space-between',
                                        boxShadow: '0 2px 8px var(--card-shadow)',
                                        transition: 'border-color 0.2s ease, box-shadow 0.2s ease'
                                    }}
                                >
                                    <div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                                            <div style={{
                                                width: 36,
                                                height: 36,
                                                borderRadius: 8,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                backgroundColor: isOn ? 'rgba(234, 179, 8, 0.15)' : 'var(--bg-surface)',
                                                color: isOn ? '#eab308' : 'var(--text-muted)'
                                            }}>
                                                <Lightbulb size={20} />
                                            </div>
                                            <span style={{
                                                fontSize: '0.72rem',
                                                fontWeight: 700,
                                                textTransform: 'uppercase',
                                                color: isOn ? '#eab308' : 'var(--text-muted)'
                                            }}>
                                                {isOn ? 'Включено' : 'Выключено'}
                                            </span>
                                        </div>

                                        <h3 style={{ margin: '0 0 4px 0', fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)' }}>
                                            {item.title}
                                        </h3>
                                        <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                                            {item.desc}
                                        </p>
                                    </div>

                                    <div style={{
                                        marginTop: 16,
                                        paddingTop: 12,
                                        borderTop: '1px solid var(--border-default)',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center'
                                    }}>
                                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                                            {item.type}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => toggle(item.key)}
                                            style={{
                                                padding: '6px 16px',
                                                borderRadius: 8,
                                                border: 'none',
                                                cursor: 'pointer',
                                                fontWeight: 700,
                                                fontSize: '0.85rem',
                                                backgroundColor: isOn ? 'var(--accent-primary)' : 'var(--btn-normal-bg, #e5e7eb)',
                                                color: isOn ? '#ffffff' : 'var(--text-muted)',
                                                transition: 'all 0.2s ease'
                                            }}
                                        >
                                            {isOn ? 'ВКЛ' : 'ВЫКЛ'}
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </Article>
            </Section>
        </Dashboard_Layout>
    );
}
