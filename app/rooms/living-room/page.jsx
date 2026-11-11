'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Dashboard_Layout } from '@/app/layouts/layout';
import { Section, Article } from '@/app/ui/structure/struct';
import s from './s.module.css';
import {
    ArrowLeft,
    Thermometer,
    Droplets,
    Gauge,
    Sliders,
    Lightbulb,
    ArrowRight,
    Sun,
    Tv,
    Sparkles,
    Wind,
    Fan
} from 'lucide-react';

export default function LivingRoomOverviewPage() {
    // Состояние 5 источников света в гостиной:
    const [lights] = useState({
        ceiling: true,   // Потолочные светильники
        dining: false,   // Над столовой зоной
        work: false,     // Над рабочей зоной (физический выключатель)
        passage: true,   // Проходная зона
        tv: false        // Подсветка телевизора
    });

    const activeLightsCount = Object.values(lights).filter(Boolean).length;

    return (
        <Dashboard_Layout title="Гостиная (Зал)">
            {/* Кнопка возврата на главный дашборд */}
            <div style={{ marginBottom: 16 }}>
                <Link href="/" className={s.backBtn}>
                    <ArrowLeft size={16} />
                    <span>На главный обзор помещений!!!!!!!</span>
                </Link>
            </div>

            <Section id='1' title="Гостиная (Зал)" className={s.widgetGrid}>
                <Article id='11' title="Модульный обзор помещения — короткая сводка по блокам (кликните по блоку для перехода к подробным настройкам):">


                    {/* 1. БЛОК ОСВЕЩЕНИЯ (5 ИСТОЧНИКОВ СВЕТА) */}
                    <Link href="/rooms/living-room/lighting" className={s.cardLink}>
                        <div className={s.blockCard}>
                            <div className={s.cardHeader}>
                                <div className={s.headerTitleRow}>
                                    <div className={s.iconBadge} style={{ color: '#eab308', backgroundColor: 'rgba(234, 179, 8, 0.12)' }}>
                                        <Lightbulb size={20} />
                                    </div>
                                    <div>
                                        <h3 className={s.cardTitle}>Освещение (5 зон)</h3>
                                        <span className={s.cardSubtitle}>Индикаторы: что сейчас горит</span>
                                    </div>
                                </div>
                                <span className={s.statusBadge}>
                                    {activeLightsCount} из 5 горит
                                </span>
                            </div>

                            {/* Список 5 источников света с наглядными индикаторами */}
                            <div className={s.lightsList}>
                                <div className={`${s.lightItem} ${lights.ceiling ? s.lightActive : ''}`}>
                                    <span className={s.lightDot}>●</span>
                                    <span className={s.lightLabel}>Потолочные светильники</span>
                                    <span className={s.lightState}>{lights.ceiling ? 'Горит' : 'Выкл'}</span>
                                </div>

                                <div className={`${s.lightItem} ${lights.dining ? s.lightActive : ''}`}>
                                    <span className={s.lightDot}>●</span>
                                    <span className={s.lightLabel}>Над столовой зоной</span>
                                    <span className={s.lightState}>{lights.dining ? 'Горит' : 'Выкл'}</span>
                                </div>

                                <div className={`${s.lightItem} ${lights.work ? s.lightActive : ''}`}>
                                    <span className={s.lightDot}>●</span>
                                    <span className={s.lightLabel}>Над рабочей зоной (ручной)</span>
                                    <span className={s.lightState}>{lights.work ? 'Горит' : 'Выкл'}</span>
                                </div>

                                <div className={`${s.lightItem} ${lights.passage ? s.lightActive : ''}`}>
                                    <span className={s.lightDot}>●</span>
                                    <span className={s.lightLabel}>Проходная зона</span>
                                    <span className={s.lightState}>{lights.passage ? 'Горит' : 'Выкл'}</span>
                                </div>

                                <div className={`${s.lightItem} ${lights.tv ? s.lightActive : ''}`}>
                                    <span className={s.lightDot}>●</span>
                                    <span className={s.lightLabel}>Подсветка телевизора</span>
                                    <span className={s.lightState}>{lights.tv ? 'Горит' : 'Выкл'}</span>
                                </div>
                            </div>

                            <div className={s.cardFooter}>
                                <span>Управление радиовыключателями</span>
                                <span className={s.goArrow}><ArrowRight size={14} /></span>
                            </div>
                        </div>
                    </Link>
                </Article>
                <Article id='12' title="Модульный">
                    {/* 2. БЛОК ВЕРТИКАЛЬНЫХ ЖАЛЮЗИ */}
                    <Link href="/rooms/living-room/blinds" className={s.cardLink}>
                        <div className={s.blockCard}>
                            <div className={s.cardHeader}>
                                <div className={s.headerTitleRow}>
                                    <div className={s.iconBadge} style={{ color: 'var(--accent-primary)', backgroundColor: 'color-mix(in srgb, var(--accent-primary) 12%, transparent)' }}>
                                        <Sliders size={20} />
                                    </div>
                                    <div>
                                        <h3 className={s.cardTitle}>Вертикальные жалюзи</h3>
                                        <span className={s.cardSubtitle}>Оконный блок + балконная дверь</span>
                                    </div>
                                </div>
                                <span className={s.statusBadge} style={{ color: 'var(--accent-primary)', backgroundColor: 'color-mix(in srgb, var(--accent-primary) 12%, transparent)' }}>
                                    Только дверь
                                </span>
                            </div>

                            <div className={s.compactGrid}>
                                <div className={s.metricBox}>
                                    <span className={s.boxLabel}>Положение полотна</span>
                                    <strong className={s.boxValue}>Только дверь</strong>
                                    <span className={s.boxHint}>Проход на балкон свободен</span>
                                </div>

                                <div className={s.metricBox}>
                                    <span className={s.boxLabel}>Угол поворота ламелей</span>
                                    <strong className={s.boxValue}>0° (Лайт)</strong>
                                    <span className={s.boxHint}>Максимальное освещение</span>
                                </div>

                                <div className={s.metricBox}>
                                    <span className={s.boxLabel}>Освещённость (улица)</span>
                                    <strong className={s.boxValue}>650 лк</strong>
                                    <span className={s.boxHint}>Датчик на лоджии</span>
                                </div>

                                <div className={s.metricBox}>
                                    <span className={s.boxLabel}>Режим автоматики</span>
                                    <strong className={s.boxValue}>Авто</strong>
                                    <span className={s.boxHint}>Порог: 400 лк</span>
                                </div>
                            </div>

                            <div className={s.cardFooter}>
                                <span>Настройка положений и ламелей</span>
                                <span className={s.goArrow}><ArrowRight size={14} /></span>
                            </div>
                        </div>
                    </Link>
                </Article>
                <Article id='13' title="Модульный">
                    {/* 3. БЛОК КЛИМАТА И ДАТЧИКОВ */}
                    <Link href="/rooms/living-room/climate" className={s.cardLink}>
                        <div className={s.blockCard}>
                            <div className={s.cardHeader}>
                                <div className={s.headerTitleRow}>
                                    <div className={s.iconBadge} style={{ color: 'var(--color-amber-d, #d97706)', backgroundColor: 'rgba(217, 119, 6, 0.12)' }}>
                                        <Thermometer size={20} />
                                    </div>
                                    <div>
                                        <h3 className={s.cardTitle}>Микроклимат комнаты</h3>
                                        <span className={s.cardSubtitle}>Датчик BME280 и кондиционер</span>
                                    </div>
                                </div>
                                <span className={s.statusBadge} style={{ color: 'var(--color-green)', backgroundColor: 'rgba(16, 185, 129, 0.12)' }}>
                                    Норма
                                </span>
                            </div>

                            <div className={s.compactGrid}>
                                <div className={s.metricBox}>
                                    <span className={s.boxLabel}>Температура</span>
                                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 3 }}>
                                        <strong className={s.boxValue} style={{ color: 'var(--color-amber-d, #d97706)' }}>24.0</strong>
                                        <small style={{ color: 'var(--text-muted)' }}>°C</small>
                                    </div>
                                    <span className={s.boxHint}>Уставка: 22.5 °C</span>
                                </div>

                                <div className={s.metricBox}>
                                    <span className={s.boxLabel}>Влажность</span>
                                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 3 }}>
                                        <strong className={s.boxValue} style={{ color: 'var(--color-green, #10b981)' }}>48</strong>
                                        <small style={{ color: 'var(--text-muted)' }}>%</small>
                                    </div>
                                    <span className={s.boxHint}>Уставка: 50 %</span>
                                </div>

                                <div className={s.metricBox}>
                                    <span className={s.boxLabel}>Давление</span>
                                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 3 }}>
                                        <strong className={s.boxValue} style={{ color: 'var(--accent-primary)' }}>1014</strong>
                                        <small style={{ color: 'var(--text-muted)' }}>гПа</small>
                                    </div>
                                    <span className={s.boxHint}>760.5 мм рт. ст.</span>
                                </div>

                                <div className={s.metricBox}>
                                    <span className={s.boxLabel}>
                                        <Sun size={11} style={{ display: 'inline', marginRight: 2 }} /> Люксметр (окно)
                                    </span>
                                    <strong className={s.boxValue} style={{ color: '#eab308' }}>650 лк</strong>
                                    <span className={s.boxHint}>Датчик на окне гостиной</span>
                                </div>

                                <div className={s.metricBox}>
                                    <span className={s.boxLabel}>
                                        <Wind size={11} style={{ display: 'inline', marginRight: 2 }} /> Заслонки / Вент.
                                    </span>
                                    <strong className={s.boxValue} style={{ color: 'var(--color-green)' }}>Сквозняк 65%</strong>
                                    <span className={s.boxHint}>Вентиляторы выключены</span>
                                </div>
                            </div>

                            <div className={s.cardFooter}>
                                <span>Заслонки, вентиляторы, кондиционер, уставки</span>
                                <span className={s.goArrow}><ArrowRight size={14} /></span>
                            </div>
                        </div>
                    </Link>
                    <div className={s.widgetGrid}>
                    </div>
                </Article>
            </Section>
        </Dashboard_Layout>
    );
}
