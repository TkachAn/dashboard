'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Dashboard_Layout } from '@/app/layouts/layout';
import { Section, Article } from '@/app/ui/structure/struct';
import { ColumnSetWidget } from '@/app/ui/widgets/unific/SetColumn/column';
import {
    ArrowLeft,
    Power,
    Sparkles,
    Bot,
    Sun,
    Wind,
    Thermometer,
    Droplets,
    Gauge,
    Sliders,
    Fan,
    Compass,
    ArrowRight,
    CheckCircle2,
    AlertCircle,
    Info
} from 'lucide-react';

export default function LivingRoomClimatePage() {
    // Уставки пользователя (задатчики)
    const [targetTemp, setTargetTemp] = useState(22.5);
    const [targetHumidity, setTargetHumidity] = useState(50);
    const [isAutoMode, setIsAutoMode] = useState(true);

    // Симуляция внешних условий для проверки логики
    const [scenario, setScenario] = useState('natural_draft'); // 'natural_draft' | 'calm_fans' | 'heatwave_ac' | 'comfort'

    // Датчики в гостиной (BME280 + Люксметр на окне)
    const indoor = {
        temp: 24.0,
        humidity: 48,
        pressure: 1014,
        lux: 650 // Освещённость в помещении / у окна
    };

    // Параметры двух лоджий в зависимости от выбранного сценария для тестирования:
    const weatherConditions = useMemo(() => {
        switch (scenario) {
            case 'natural_draft':
                // Ветерок: прохладно, разность давлений 3 гПа -> сквозняк только заслонками
                return {
                    se: { temp: 18.5, humidity: 45, pressure: 1015, lux: 1200, name: 'Лоджия ЮВ' },
                    nw: { temp: 17.8, humidity: 52, pressure: 1012, lux: 450, name: 'Лоджия СЗ' },
                    desc: 'Сценарий 1: Прохладно, разница давлений 3 гПа (ЮВ > СЗ)'
                };
            case 'calm_fans':
                // Штиль: прохладно, но перепада давления нет (0 гПа) -> нужны вентиляторы
                return {
                    se: { temp: 18.5, humidity: 45, pressure: 1014, lux: 1100, name: 'Лоджия ЮВ' },
                    nw: { temp: 18.3, humidity: 47, pressure: 1014, lux: 500, name: 'Лоджия СЗ' },
                    desc: 'Сценарий 2: Штиль, перепад давления 0 гПа (нужна помощь вентиляторов)'
                };
            case 'heatwave_ac':
                // Жара на улице: +29°C -> заслонки закрыты, работает кондиционер
                return {
                    se: { temp: 29.5, humidity: 38, pressure: 1013, lux: 1600, name: 'Лоджия ЮВ' },
                    nw: { temp: 28.2, humidity: 40, pressure: 1013, lux: 700, name: 'Лоджия СЗ' },
                    desc: 'Сценарий 3: Летняя жара (+29°C), естественное охлаждение невозможно'
                };
            case 'comfort':
            default:
                // Норма: температура совпадает с уставкой
                return {
                    se: { temp: 21.0, humidity: 48, pressure: 1014, lux: 800, name: 'Лоджия ЮВ' },
                    nw: { temp: 20.5, humidity: 50, pressure: 1013, lux: 400, name: 'Лоджия СЗ' },
                    desc: 'Сценарий 4: Норма (температура в комнате равна уставке)'
                };
        }
    }, [scenario]);

    // Каскадный расчет микроклимата
    const logic = useMemo(() => {
        const { se, nw } = weatherConditions;
        const currentTemp = indoor.temp;
        const tempDelta = Number((currentTemp - targetTemp).toFixed(1)); // > 0 означает необходимость охлаждения
        const pressureDelta = se.pressure - nw.pressure; // Положительное: поток ЮВ -> СЗ, Отрицательное: СЗ -> ЮВ
        const minOutdoorTemp = Math.min(se.temp, nw.temp);

        // 1. Проверяем потребность в охлаждении
        if (tempDelta <= 0.3) {
            return {
                mode: 'comfort',
                modeTitle: 'Комфорт / Цель достигнута',
                badgeColor: 'var(--color-green, #10b981)',
                badgeBg: 'rgba(16, 185, 129, 0.12)',
                dampers: { se: 15, nw: 15 },
                fans: { se: 0, nw: 0 },
                ac: { power: false, target: targetTemp, note: 'Выключен' },
                activeStep: 1,
                reason: `Температура в гостиной (${currentTemp}°C) соответствует целевой уставке ${targetTemp}°C. Заслонки приоткрыты на 15% для дежурной санитарной вентиляции, вентиляторы и кондиционер отключены.`
            };
        }

        // 2. Если охлаждение нужно, но на улице жарко (> indoor.temp)
        if (minOutdoorTemp >= currentTemp - 0.5) {
            return {
                mode: 'ac_active',
                modeTitle: 'Активное охлаждение: Кондиционер (BroadLink ИК)',
                badgeColor: 'var(--color-blue-500, #3b82f6)',
                badgeBg: 'rgba(59, 130, 246, 0.12)',
                dampers: { se: 0, nw: 0 },
                fans: { se: 0, nw: 0 },
                ac: { power: true, target: targetTemp, note: `Охлаждение до ${targetTemp}°C` },
                activeStep: 5,
                reason: `В комнате ${currentTemp}°C, а на улице жара (${se.temp}°C / ${nw.temp}°C). Приток уличного воздуха нагрел бы помещение. Заслонки полностью ЗАКРЫТЫ (0%), включен кондиционер через ИК-базу BroadLink.`
            };
        }

        // 3. На улице прохладнее! Проверяем перепад давления для естественного сквозняка
        const absDeltaP = Math.abs(pressureDelta);

        if (absDeltaP >= 1.5) {
            // ЕСТЕСТВЕННЫЙ СКВОЗНЯК ЗА СЧЕТ ЗАДАННОГО ДАВЛЕНИЯ
            const windward = pressureDelta > 0 ? 'ЮВ' : 'СЗ';
            const leeward = pressureDelta > 0 ? 'СЗ' : 'ЮВ';

            return {
                mode: 'natural_draft',
                modeTitle: 'Естественный сквозняк заслонками (без вентиляторов)',
                badgeColor: 'var(--color-green, #10b981)',
                badgeBg: 'rgba(16, 185, 129, 0.15)',
                dampers: { se: 65, nw: 65 },
                fans: { se: 0, nw: 0 }, // ВЕНТИЛЯТОРЫ ВЫКЛЮЧЕНЫ!
                ac: { power: false, target: targetTemp, note: 'Выключен (экономия энергии)' },
                activeStep: 3,
                direction: `${windward} → ${leeward}`,
                deltaP: pressureDelta,
                reason: `В гостиной ${currentTemp}°C при уставке ${targetTemp}°C. На улице прохладно (${se.temp}°C / ${nw.temp}°C), а перепад давления между лоджиями составляет ${absDeltaP} гПа (${windward}: высокое давление → ${leeward}: низкое). Автоматика открыла заслонки на 65% для естественного сквозняка БЕЗ включения вентиляторов. Шум: 0 дБ, расход энергии: 0 Вт.`
            };
        }

        // 4. На улице прохладно, но перепад давления мал (< 1.5 гПа, штиль) -> включаем вентиляторы
        return {
            mode: 'forced_draft',
            modeTitle: 'Принудительный сквозняк (заслонки + вентиляторы)',
            badgeColor: 'var(--color-amber-d, #d97706)',
            badgeBg: 'rgba(217, 119, 6, 0.15)',
            dampers: { se: 70, nw: 70 },
            fans: { se: 45, nw: 45 }, // Вентиляторы включаются на умеренную скорость
            ac: { power: false, target: targetTemp, note: 'Выключен' },
            activeStep: 4,
            deltaP: pressureDelta,
            reason: `На улице прохладно (${minOutdoorTemp}°C), но перепад давления между фасадами отсутствует (${absDeltaP} гПа). Естественной тяги недостаточно, поэтому автоматика открыла заслонки на 70% и запустила вентиляторы на 45% (ШИМ) для активной продувки помещения без кондиционера.`
        };
    }, [weatherConditions, indoor.temp, targetTemp]);

    // Ручное переключение кондиционера (если не авто)
    const [manualAcPower, setManualAcPower] = useState(false);
    const acPowerState = isAutoMode ? logic.ac.power : manualAcPower;

    return (
        <Dashboard_Layout title="Гостиная — Микроклимат">
            {/* Навигация назад */}
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

            <Section title="Умный микроклимат гостиной">
                <Article title="Координированное управление заслонками, вентиляторами и кондиционером">
                    
                    {/* КАРТОЧКА ИНТЕЛЛЕКТУАЛЬНОГО РЕШЕНИЯ */}
                    <div style={{
                        backgroundColor: 'var(--card-bg)',
                        border: '2px solid color-mix(in srgb, var(--accent-primary) 35%, var(--border-default))',
                        borderRadius: 16,
                        padding: '20px',
                        marginBottom: 24,
                        boxShadow: '0 4px 16px rgba(0,0,0,0.06)'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <div style={{
                                    width: 36,
                                    height: 36,
                                    borderRadius: 10,
                                    backgroundColor: 'color-mix(in srgb, var(--accent-primary) 15%, transparent)',
                                    color: 'var(--accent-primary)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <Bot size={22} />
                                </div>
                                <div>
                                    <h3 style={{ margin: 0, fontSize: '1.05rem', color: 'var(--text-main)', fontWeight: 700 }}>
                                        Интеллект микроклимата: {logic.modeTitle}
                                    </h3>
                                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                        Автоматический выбор оптимального энергоэффективного каскада
                                    </span>
                                </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <span style={{
                                    padding: '5px 12px',
                                    borderRadius: 20,
                                    fontSize: '0.8rem',
                                    fontWeight: 700,
                                    backgroundColor: logic.badgeBg,
                                    color: logic.badgeColor
                                }}>
                                    ● {logic.modeTitle}
                                </span>

                                <div style={{ display: 'flex', backgroundColor: 'var(--bg-surface)', padding: 3, borderRadius: 8, border: '1px solid var(--border-default)' }}>
                                    <button
                                        type="button"
                                        onClick={() => setIsAutoMode(true)}
                                        style={{
                                            border: 'none',
                                            padding: '6px 12px',
                                            borderRadius: 6,
                                            cursor: 'pointer',
                                            fontWeight: 600,
                                            fontSize: '0.8rem',
                                            backgroundColor: isAutoMode ? 'var(--accent-primary)' : 'transparent',
                                            color: isAutoMode ? '#fff' : 'var(--text-muted)'
                                        }}
                                    >
                                        <Sparkles size={12} style={{ display: 'inline', marginRight: 4 }} /> Авто
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setIsAutoMode(false)}
                                        style={{
                                            border: 'none',
                                            padding: '6px 12px',
                                            borderRadius: 6,
                                            cursor: 'pointer',
                                            fontWeight: 600,
                                            fontSize: '0.8rem',
                                            backgroundColor: !isAutoMode ? 'var(--accent-primary)' : 'transparent',
                                            color: !isAutoMode ? '#fff' : 'var(--text-muted)'
                                        }}
                                    >
                                        Ручной
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Пояснение текущего действия */}
                        <div style={{
                            padding: '12px 16px',
                            borderRadius: 10,
                            backgroundColor: 'var(--bg-surface)',
                            borderLeft: `4px solid ${logic.badgeColor}`,
                            fontSize: '0.9rem',
                            lineHeight: 1.5,
                            color: 'var(--text-main)'
                        }}>
                            <strong>Логика решения:</strong> {logic.reason}
                        </div>

                        {/* ВИЗУАЛЬНАЯ ЦЕПОЧКА ПРИНЯТИЯ РЕШЕНИЙ (КАСКАД) */}
                        <div style={{ marginTop: 18 }}>
                            <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 8, letterSpacing: '0.04em' }}>
                                Каскадный алгоритм принятия решений:
                            </div>
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                                gap: 10
                            }}>
                                {/* Шаг 1: Датчик помещения */}
                                <div style={{
                                    padding: '10px 12px',
                                    borderRadius: 10,
                                    border: '1px solid var(--border-default)',
                                    backgroundColor: 'var(--bg-surface)',
                                    opacity: 1
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-main)' }}>
                                        <Thermometer size={14} color="var(--color-amber-d, #d97706)" />
                                        <span>1. Датчики комнаты</span>
                                    </div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>
                                        Т: {indoor.temp}°C, Цель: {targetTemp}°C<br />
                                        Свет: <strong>{indoor.lux} лк</strong>
                                    </div>
                                </div>

                                {/* Шаг 2: Сравнение с лоджиями */}
                                <div style={{
                                    padding: '10px 12px',
                                    borderRadius: 10,
                                    border: '1px solid var(--border-default)',
                                    backgroundColor: 'var(--bg-surface)'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-main)' }}>
                                        <Gauge size={14} color="var(--accent-primary)" />
                                        <span>2. Анализ улицы</span>
                                    </div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>
                                        ΔP: <strong>{Math.abs(weatherConditions.se.pressure - weatherConditions.nw.pressure)} гПа</strong><br />
                                        Улица: {weatherConditions.se.temp}°C / {weatherConditions.nw.temp}°C
                                    </div>
                                </div>

                                {/* Шаг 3: Сквозняк заслонками */}
                                <div style={{
                                    padding: '10px 12px',
                                    borderRadius: 10,
                                    border: logic.activeStep === 3 ? '2px solid var(--color-green, #10b981)' : '1px solid var(--border-default)',
                                    backgroundColor: logic.activeStep === 3 ? 'rgba(16, 185, 129, 0.08)' : 'var(--bg-surface)'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8rem', fontWeight: 700, color: logic.activeStep === 3 ? 'var(--color-green, #10b981)' : 'var(--text-main)' }}>
                                        <Wind size={14} />
                                        <span>3. Сквозняк заслонками</span>
                                    </div>
                                    <div style={{ fontSize: '0.75rem', color: logic.activeStep === 3 ? 'var(--text-main)' : 'var(--text-muted)', marginTop: 4 }}>
                                        {logic.activeStep === 3 ? 'АКТИВЕН (без вентиляторов!)' : 'Если ΔP ≥ 1.5 гПа и Tулицы < Tкомнаты'}
                                    </div>
                                </div>

                                {/* Шаг 4: Вентиляторы */}
                                <div style={{
                                    padding: '10px 12px',
                                    borderRadius: 10,
                                    border: logic.activeStep === 4 ? '2px solid var(--color-amber-d, #d97706)' : '1px solid var(--border-default)',
                                    backgroundColor: logic.activeStep === 4 ? 'rgba(217, 119, 6, 0.08)' : 'var(--bg-surface)'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8rem', fontWeight: 700, color: logic.activeStep === 4 ? 'var(--color-amber-d, #d97706)' : 'var(--text-main)' }}>
                                        <Fan size={14} />
                                        <span>4. Вентиляторы</span>
                                    </div>
                                    <div style={{ fontSize: '0.75rem', color: logic.activeStep === 4 ? 'var(--text-main)' : 'var(--text-muted)', marginTop: 4 }}>
                                        {logic.activeStep === 4 ? 'АКТИВНЫ (помощь при штиле)' : 'Только если заслонок мало'}
                                    </div>
                                </div>

                                {/* Шаг 5: Кондиционер */}
                                <div style={{
                                    padding: '10px 12px',
                                    borderRadius: 10,
                                    border: logic.activeStep === 5 ? '2px solid var(--color-blue-500, #3b82f6)' : '1px solid var(--border-default)',
                                    backgroundColor: logic.activeStep === 5 ? 'rgba(59, 130, 246, 0.08)' : 'var(--bg-surface)'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8rem', fontWeight: 700, color: logic.activeStep === 5 ? 'var(--color-blue-500, #3b82f6)' : 'var(--text-main)' }}>
                                        <Power size={14} />
                                        <span>5. Кондиционер (ИК)</span>
                                    </div>
                                    <div style={{ fontSize: '0.75rem', color: logic.activeStep === 5 ? 'var(--text-main)' : 'var(--text-muted)', marginTop: 4 }}>
                                        {logic.activeStep === 5 ? 'АКТИВЕН (за бортом жарко)' : 'Крайняя мера при жаре на улице'}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* КНОПКИ ДЛЯ ПРОВЕРКИ СЦЕНАРИЕВ В РЕЖИМЕ СИМУЛЯЦИИ */}
                        <div style={{ marginTop: 20, paddingTop: 14, borderTop: '1px dashed var(--border-default)' }}>
                            <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 8 }}>
                                Проверка работы умного алгоритма при разных погодных условиях:
                            </span>
                            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                                <button
                                    type="button"
                                    onClick={() => setScenario('natural_draft')}
                                    style={{
                                        padding: '6px 12px',
                                        borderRadius: 8,
                                        fontSize: '0.8rem',
                                        cursor: 'pointer',
                                        fontWeight: 600,
                                        border: '1px solid var(--border-default)',
                                        backgroundColor: scenario === 'natural_draft' ? 'var(--accent-primary)' : 'var(--bg-surface)',
                                        color: scenario === 'natural_draft' ? '#fff' : 'var(--text-main)'
                                    }}
                                >
                                    🍃 Сценарий 1: Прохладный сквозняк (ΔP=3 гПа, без вентиляторов)
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setScenario('calm_fans')}
                                    style={{
                                        padding: '6px 12px',
                                        borderRadius: 8,
                                        fontSize: '0.8rem',
                                        cursor: 'pointer',
                                        fontWeight: 600,
                                        border: '1px solid var(--border-default)',
                                        backgroundColor: scenario === 'calm_fans' ? 'var(--accent-primary)' : 'var(--bg-surface)',
                                        color: scenario === 'calm_fans' ? '#fff' : 'var(--text-main)'
                                    }}
                                >
                                    🌀 Сценарий 2: Штиль на улице (ΔP=0 гПа, запуск вентиляторов)
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setScenario('heatwave_ac')}
                                    style={{
                                        padding: '6px 12px',
                                        borderRadius: 8,
                                        fontSize: '0.8rem',
                                        cursor: 'pointer',
                                        fontWeight: 600,
                                        border: '1px solid var(--border-default)',
                                        backgroundColor: scenario === 'heatwave_ac' ? 'var(--accent-primary)' : 'var(--bg-surface)',
                                        color: scenario === 'heatwave_ac' ? '#fff' : 'var(--text-main)'
                                    }}
                                >
                                    ☀️ Сценарий 3: Жара (+29°C) (Заслонки закрыты, кондиционер)
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setScenario('comfort')}
                                    style={{
                                        padding: '6px 12px',
                                        borderRadius: 8,
                                        fontSize: '0.8rem',
                                        cursor: 'pointer',
                                        fontWeight: 600,
                                        border: '1px solid var(--border-default)',
                                        backgroundColor: scenario === 'comfort' ? 'var(--accent-primary)' : 'var(--bg-surface)',
                                        color: scenario === 'comfort' ? '#fff' : 'var(--text-main)'
                                    }}
                                >
                                    ✅ Сценарий 4: Норма (T=уставке, тихий дежурный приток)
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* СРАВНЕНИЕ ТЕЛЕМЕТРИИ ПОМЕЩЕНИЯ И ДВУХ ЛОДЖИЙ */}
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: '0 0 12px 0', color: 'var(--text-main)' }}>
                        Телеметрия: Гостиная vs Лоджия ЮВ (справа) vs Лоджия СЗ (слева)
                    </h3>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                        gap: 16,
                        marginBottom: 24
                    }}>
                        {/* 1. ГОСТИНАЯ (ВНУТРИ) */}
                        <div style={{
                            backgroundColor: 'var(--card-bg)',
                            border: '1px solid var(--border-default)',
                            borderRadius: 14,
                            padding: 16
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <div style={{ color: 'var(--color-amber-d, #d97706)' }}>
                                        <Thermometer size={18} />
                                    </div>
                                    <strong style={{ fontSize: '0.95rem', color: 'var(--text-main)' }}>Гостиная (BME280 + Люксметр)</strong>
                                </div>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Внутри</span>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                                <div style={{ backgroundColor: 'var(--bg-surface)', padding: '10px 12px', borderRadius: 8 }}>
                                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block' }}>Температура</span>
                                    <strong style={{ fontSize: '1.25rem', color: 'var(--color-amber-d, #d97706)' }}>{indoor.temp} °C</strong>
                                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>Цель: {targetTemp} °C</span>
                                </div>

                                <div style={{ backgroundColor: 'var(--bg-surface)', padding: '10px 12px', borderRadius: 8 }}>
                                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block' }}>Влажность</span>
                                    <strong style={{ fontSize: '1.25rem', color: 'var(--color-green, #10b981)' }}>{indoor.humidity} %</strong>
                                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>Цель: {targetHumidity} %</span>
                                </div>

                                <div style={{ backgroundColor: 'var(--bg-surface)', padding: '10px 12px', borderRadius: 8 }}>
                                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block' }}>Давление</span>
                                    <strong style={{ fontSize: '1.15rem', color: 'var(--accent-primary)' }}>{indoor.pressure} гПа</strong>
                                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>760.5 мм рт. ст.</span>
                                </div>

                                {/* ДАТЧИК ОСВЕЩЁННОСТИ В МИКРОКЛИМАТЕ */}
                                <div style={{ backgroundColor: 'var(--bg-surface)', padding: '10px 12px', borderRadius: 8 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                        <Sun size={12} color="#eab308" />
                                        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Освещённость</span>
                                    </div>
                                    <strong style={{ fontSize: '1.15rem', color: '#eab308' }}>{indoor.lux} лк</strong>
                                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>Датчик на окне</span>
                                </div>
                            </div>
                        </div>

                        {/* 2. ЛОДЖИЯ ЮГО-ВОСТОЧНАЯ */}
                        <div style={{
                            backgroundColor: 'var(--card-bg)',
                            border: '1px solid var(--border-default)',
                            borderRadius: 14,
                            padding: 16
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <div style={{ color: 'var(--accent-primary)' }}>
                                        <Compass size={18} />
                                    </div>
                                    <strong style={{ fontSize: '0.95rem', color: 'var(--text-main)' }}>Лоджия ЮВ (Улица, Фасад 1)</strong>
                                </div>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Приток / Вытяжка</span>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                                <div style={{ backgroundColor: 'var(--bg-surface)', padding: '10px 12px', borderRadius: 8 }}>
                                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block' }}>Температура</span>
                                    <strong style={{ fontSize: '1.25rem', color: 'var(--text-main)' }}>{weatherConditions.se.temp} °C</strong>
                                    <span style={{ fontSize: '0.7rem', color: weatherConditions.se.temp < indoor.temp ? 'var(--color-green)' : 'var(--color-red)' }}>
                                        {weatherConditions.se.temp < indoor.temp ? `Прохладнее (-${(indoor.temp - weatherConditions.se.temp).toFixed(1)}°C)` : 'Жарче'}
                                    </span>
                                </div>

                                <div style={{ backgroundColor: 'var(--bg-surface)', padding: '10px 12px', borderRadius: 8 }}>
                                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block' }}>Влажность</span>
                                    <strong style={{ fontSize: '1.25rem', color: 'var(--text-main)' }}>{weatherConditions.se.humidity} %</strong>
                                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Относительная</span>
                                </div>

                                <div style={{ backgroundColor: 'var(--bg-surface)', padding: '10px 12px', borderRadius: 8 }}>
                                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block' }}>Давление барометра</span>
                                    <strong style={{ fontSize: '1.15rem', color: 'var(--accent-primary)' }}>{weatherConditions.se.pressure} гПа</strong>
                                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                                        {weatherConditions.se.pressure > weatherConditions.nw.pressure ? '▲ Наветренная сторона' : 'Равное'}
                                    </span>
                                </div>

                                <div style={{ backgroundColor: 'var(--bg-surface)', padding: '10px 12px', borderRadius: 8 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                        <Sun size={12} color="#eab308" />
                                        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Люксметр ЮВ</span>
                                    </div>
                                    <strong style={{ fontSize: '1.15rem', color: '#eab308' }}>{weatherConditions.se.lux} лк</strong>
                                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Инсоляция фасада</span>
                                </div>
                            </div>
                        </div>

                        {/* 3. ЛОДЖИЯ СЕВЕРО-ЗАПАДНАЯ */}
                        <div style={{
                            backgroundColor: 'var(--card-bg)',
                            border: '1px solid var(--border-default)',
                            borderRadius: 14,
                            padding: 16
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <div style={{ color: 'var(--accent-primary)' }}>
                                        <Wind size={18} />
                                    </div>
                                    <strong style={{ fontSize: '0.95rem', color: 'var(--text-main)' }}>Лоджия СЗ (Улица, Фасад 2)</strong>
                                </div>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Приток / Вытяжка</span>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                                <div style={{ backgroundColor: 'var(--bg-surface)', padding: '10px 12px', borderRadius: 8 }}>
                                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block' }}>Температура</span>
                                    <strong style={{ fontSize: '1.25rem', color: 'var(--text-main)' }}>{weatherConditions.nw.temp} °C</strong>
                                    <span style={{ fontSize: '0.7rem', color: weatherConditions.nw.temp < indoor.temp ? 'var(--color-green)' : 'var(--color-red)' }}>
                                        {weatherConditions.nw.temp < indoor.temp ? `Прохладнее (-${(indoor.temp - weatherConditions.nw.temp).toFixed(1)}°C)` : 'Жарче'}
                                    </span>
                                </div>

                                <div style={{ backgroundColor: 'var(--bg-surface)', padding: '10px 12px', borderRadius: 8 }}>
                                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block' }}>Влажность</span>
                                    <strong style={{ fontSize: '1.25rem', color: 'var(--text-main)' }}>{weatherConditions.nw.humidity} %</strong>
                                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Относительная</span>
                                </div>

                                <div style={{ backgroundColor: 'var(--bg-surface)', padding: '10px 12px', borderRadius: 8 }}>
                                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block' }}>Давление барометра</span>
                                    <strong style={{ fontSize: '1.15rem', color: 'var(--accent-primary)' }}>{weatherConditions.nw.pressure} гПа</strong>
                                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                                        {weatherConditions.se.pressure > weatherConditions.nw.pressure ? '▼ Подветренная сторона' : 'Равное'}
                                    </span>
                                </div>

                                <div style={{ backgroundColor: 'var(--bg-surface)', padding: '10px 12px', borderRadius: 8 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                        <Sun size={12} color="#eab308" />
                                        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Люксметр СЗ</span>
                                    </div>
                                    <strong style={{ fontSize: '1.15rem', color: '#eab308' }}>{weatherConditions.nw.lux} лк</strong>
                                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Теневая сторона</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* СОСТОЯНИЕ ИСПОЛНИТЕЛЬНЫХ МЕХАНИЗМОВ: ЗАСЛОНКИ, ВЕНТИЛЯТОРЫ, КОНДИЦИОНЕР */}
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: '0 0 12px 0', color: 'var(--text-main)' }}>
                        Состояние исполнительных устройств (заслонки лоджий + вентиляторы + кондиционер)
                    </h3>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                        gap: 16,
                        marginBottom: 24
                    }}>
                        {/* ЗАСЛОНКИ ОБЕИХ ЛОДЖИЙ */}
                        <div style={{
                            backgroundColor: 'var(--card-bg)',
                            border: '1px solid var(--border-default)',
                            borderRadius: 14,
                            padding: 16
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                                <Sliders size={18} color="var(--accent-primary)" />
                                <strong style={{ fontSize: '0.92rem', color: 'var(--text-main)' }}>Заслонки (Сервоприводы)</strong>
                            </div>

                            <div style={{ marginBottom: 12 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: 4 }}>
                                    <span>Заслонка ЮВ (Приток):</span>
                                    <strong style={{ color: logic.dampers.se > 0 ? 'var(--color-green)' : 'var(--text-muted)' }}>
                                        {logic.dampers.se}% {logic.dampers.se > 0 ? 'Открыта' : 'Закрыта'}
                                    </strong>
                                </div>
                                <div style={{ height: 8, backgroundColor: 'var(--bg-surface)', borderRadius: 4, overflow: 'hidden' }}>
                                    <div style={{ height: '100%', width: `${logic.dampers.se}%`, backgroundColor: 'var(--color-green)', transition: 'width 0.3s ease' }} />
                                </div>
                            </div>

                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: 4 }}>
                                    <span>Заслонка СЗ (Вытяжка):</span>
                                    <strong style={{ color: logic.dampers.nw > 0 ? 'var(--color-green)' : 'var(--text-muted)' }}>
                                        {logic.dampers.nw}% {logic.dampers.nw > 0 ? 'Открыта' : 'Закрыта'}
                                    </strong>
                                </div>
                                <div style={{ height: 8, backgroundColor: 'var(--bg-surface)', borderRadius: 4, overflow: 'hidden' }}>
                                    <div style={{ height: '100%', width: `${logic.dampers.nw}%`, backgroundColor: 'var(--color-green)', transition: 'width 0.3s ease' }} />
                                </div>
                            </div>

                            <div style={{ marginTop: 12, fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                {logic.dampers.se > 0 ? 'Естественная тяга через квартиру организована' : 'Герметично закрыты для сохранения холода кондиционера'}
                            </div>
                        </div>

                        {/* ВЕНТИЛЯТОРЫ ЛОДЖИЙ */}
                        <div style={{
                            backgroundColor: 'var(--card-bg)',
                            border: '1px solid var(--border-default)',
                            borderRadius: 14,
                            padding: 16
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                                <Fan size={18} color="var(--color-amber-d, #d97706)" />
                                <strong style={{ fontSize: '0.92rem', color: 'var(--text-main)' }}>Вентиляторы (ШИМ-регулирование)</strong>
                            </div>

                            <div style={{ marginBottom: 12 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: 4 }}>
                                    <span>Вентилятор ЮВ:</span>
                                    <strong style={{ color: logic.fans.se > 0 ? 'var(--color-amber-d, #d97706)' : 'var(--text-muted)' }}>
                                        {logic.fans.se > 0 ? `${logic.fans.se}% (Активен)` : '0% (ВЫКЛ)'}
                                    </strong>
                                </div>
                                <div style={{ height: 8, backgroundColor: 'var(--bg-surface)', borderRadius: 4, overflow: 'hidden' }}>
                                    <div style={{ height: '100%', width: `${logic.fans.se}%`, backgroundColor: 'var(--color-amber-d, #d97706)', transition: 'width 0.3s ease' }} />
                                </div>
                            </div>

                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: 4 }}>
                                    <span>Вентилятор СЗ:</span>
                                    <strong style={{ color: logic.fans.nw > 0 ? 'var(--color-amber-d, #d97706)' : 'var(--text-muted)' }}>
                                        {logic.fans.nw > 0 ? `${logic.fans.nw}% (Активен)` : '0% (ВЫКЛ)'}
                                    </strong>
                                </div>
                                <div style={{ height: 8, backgroundColor: 'var(--bg-surface)', borderRadius: 4, overflow: 'hidden' }}>
                                    <div style={{ height: '100%', width: `${logic.fans.nw}%`, backgroundColor: 'var(--color-amber-d, #d97706)', transition: 'width 0.3s ease' }} />
                                </div>
                            </div>

                            <div style={{ marginTop: 12, fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                {logic.fans.se === 0
                                    ? 'Вентиляторы спят — охлаждение идет только бесплатным сквозняком!'
                                    : 'Включены для создания принудительного сквозняка при слабом ветре.'}
                            </div>
                        </div>

                        {/* КОНДИЦИОНЕР BROADLINK ИК */}
                        <div style={{
                            backgroundColor: 'var(--card-bg)',
                            border: '1px solid var(--border-default)',
                            borderRadius: 14,
                            padding: 16,
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between'
                        }}>
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <Power size={18} color={acPowerState ? 'var(--color-blue-500)' : 'var(--text-muted)'} />
                                        <strong style={{ fontSize: '0.92rem', color: 'var(--text-main)' }}>Кондиционер (BroadLink ИК)</strong>
                                    </div>
                                    <button
                                        type="button"
                                        disabled={isAutoMode}
                                        onClick={() => setManualAcPower(!manualAcPower)}
                                        style={{
                                            padding: '4px 10px',
                                            borderRadius: 6,
                                            border: 'none',
                                            cursor: isAutoMode ? 'not-allowed' : 'pointer',
                                            fontWeight: 700,
                                            fontSize: '0.75rem',
                                            backgroundColor: acPowerState ? 'var(--color-green)' : 'var(--btn-normal-bg)',
                                            color: acPowerState ? '#fff' : 'var(--text-muted)',
                                            opacity: isAutoMode ? 0.8 : 1
                                        }}
                                    >
                                        {acPowerState ? 'ВКЛ' : 'ВЫКЛ'}
                                    </button>
                                </div>

                                <div style={{ fontSize: '0.82rem', color: 'var(--text-main)', lineHeight: 1.4 }}>
                                    Статус: <strong>{logic.ac.note}</strong>
                                </div>
                                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 4 }}>
                                    Уставка сплит-системы: <strong>{targetTemp} °C</strong>
                                </div>
                            </div>

                            <div style={{ paddingTop: 10, borderTop: '1px solid var(--border-default)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                {isAutoMode ? 'Управляется автоматикой через BroadLink RM4 mini' : 'Ручной режим управления ИК-сигналами'}
                            </div>
                        </div>
                    </div>

                    {/* ЗАДАТЧИКИ УСТАВОК ТЕМПЕРАТУРЫ И ВЛАЖНОСТИ */}
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: '0 0 12px 0', color: 'var(--text-main)' }}>
                        Задатчики целевой температуры и влажности (перетаскивайте стрелку на шкале):
                    </h3>

                    <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', alignItems: 'stretch' }}>
                        <ColumnSetWidget
                            title="Температура"
                            iconName="thermometer"
                            current={indoor.temp}
                            initial={targetTemp}
                            min={16}
                            max={30}
                            unit="°C"
                            colorTheme="orange"
                            onTargetChange={(val) => setTargetTemp(val)}
                        />

                        <ColumnSetWidget
                            title="Влажность"
                            iconName="droplet"
                            current={indoor.humidity}
                            initial={targetHumidity}
                            min={20}
                            max={80}
                            unit="%"
                            colorTheme="blue"
                            onTargetChange={(val) => setTargetHumidity(val)}
                        />

                        {/* КАРТОЧКА СВЯЗИ С ЖАЛЮЗИ И ОСВЕЩЁННОСТЬЮ */}
                        <div style={{
                            flex: '1 1 280px',
                            backgroundColor: 'var(--card-bg)',
                            border: '1px solid var(--border-default)',
                            borderRadius: 14,
                            padding: 16,
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between'
                        }}>
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                                    <Sun size={18} color="#eab308" />
                                    <strong style={{ fontSize: '0.95rem', color: 'var(--text-main)' }}>Влияние освещенности на климат</strong>
                                </div>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-main)', lineHeight: 1.5, margin: 0 }}>
                                    Прямой солнечный свет сквозь окна нагревает помещение (парниковый эффект).
                                    При освещенности выше <strong>400 лк</strong> умный дом автоматически прикрывает вертикальные жалюзи, снижая нагрузку на систему охлаждения.
                                </p>
                                <div style={{ marginTop: 12, padding: '10px 12px', backgroundColor: 'var(--bg-surface)', borderRadius: 8, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                    Текущий датчик окна: <strong style={{ color: '#eab308' }}>{indoor.lux} лк</strong> (Жалюзи прикрыты в положение &laquo;Только дверь&raquo;)
                                </div>
                            </div>

                            <div style={{ paddingTop: 14, marginTop: 14, borderTop: '1px solid var(--border-default)' }}>
                                <Link
                                    href="/rooms/living-room/blinds"
                                    style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: 6,
                                        color: 'var(--accent-primary)',
                                        textDecoration: 'none',
                                        fontWeight: 600,
                                        fontSize: '0.85rem'
                                    }}
                                >
                                    <span>Перейти к управлению жалюзи</span>
                                    <ArrowRight size={14} />
                                </Link>
                            </div>
                        </div>
                    </div>

                </Article>
            </Section>
        </Dashboard_Layout>
    );
}
