'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import styles from './s.module.css';

// Вспомогательные константы и функции для работы с минутами и углами
const MINUTES_IN_DAY = 24 * 60;

function minutesToAngle(minutes) {
    // 0 минут = -90 градусов (верх циферблата)
    return (minutes / MINUTES_IN_DAY) * 360 - 90;
}

function angleToMinutes(angle, stepMinutes) {
    // Нормализуем угол к диапазону [0, 360)
    let normalizedAngle = (angle + 90) % 360;
    if (normalizedAngle < 0) normalizedAngle += 360;

    const rawMinutes = (normalizedAngle / 360) * MINUTES_IN_DAY;
    // Округляем до ближайшего шага
    const steppedMinutes = Math.round(rawMinutes / stepMinutes) * stepMinutes;
    return steppedMinutes % MINUTES_IN_DAY;
}

function minutesToTimeStr(totalMinutes) {
    const hours = Math.floor(totalMinutes / 60) % 24;
    const minutes = totalMinutes % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}

// Генерация SVG дуги для интервала с правильным смещением к центру

function describeArc(startMinutes, endMinutes, radius, center) {
    const startAngle = minutesToAngle(startMinutes);
    const endAngle = minutesToAngle(endMinutes);

    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;

    // Добавляем center к каждой координате!
    const x1 = center + radius * Math.cos(startRad);
    const y1 = center + radius * Math.sin(startRad);
    const x2 = center + radius * Math.cos(endRad);
    const y2 = center + radius * Math.sin(endRad);

    let diff = endMinutes - startMinutes;
    if (diff < 0) diff += MINUTES_IN_DAY;

    const largeArcFlag = diff > MINUTES_IN_DAY / 2 ? 1 : 0;

    return `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`;
}

export default function CircularScheduler({
    title = 'Heating time',
    intervals = [
        { id: 1, start: 900, end: 1200, label: 'Day time' },       // 15:00 - 20:00
        { id: 2, start: 1350, end: 660, label: 'Evening time' }   // 22:30 - 11:00 (через полночь)
    ],
    stepMinutes = 5, // Шаг дискретности в минутах (10, 15, 30)
    onChange
}) {
    const svgRef = useRef(null);
    const [dragging, setDragging] = useState(null); // { intervalIndex, type: 'start' | 'end' }
    const [currentTimeMinutes, setCurrentTimeMinutes] = useState(0);

    // Инициализируем состояние интервалов один раз при монтировании
    const [activeIntervals, setActiveIntervals] = useState(intervals);

    // Обновление текущего времени (каждые 30 секунд)
    useEffect(() => {
        const updateNow = () => {
            const now = new Date();
            setCurrentTimeMinutes(now.getHours() * 60 + now.getMinutes());
        };
        updateNow();
        const timer = setInterval(updateNow, 30000);
        return () => clearInterval(timer);
    }, []);

    // Обработка начала перетаскивания бегунка
    const handlePointerDown = (index, type, e) => {
        e.preventDefault();
        setDragging({ intervalIndex: index, type });
        e.target.setPointerCapture(e.pointerId);
    };

    // Перетаскивание бегунка с проверкой пересечений
    const handlePointerMove = useCallback((e) => {
        if (!dragging || !svgRef.current) return;

        const rect = svgRef.current.getBoundingClientRect();
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        // Координаты указателя относительно центра SVG
        const clientX = e.clientX - rect.left;
        const clientY = e.clientY - rect.top;

        const radians = Math.atan2(clientY - centerY, clientX - centerX);
        let degrees = (radians * 180) / Math.PI;

        const newMinutes = angleToMinutes(degrees, stepMinutes);

        setActiveIntervals((prev) => {
            const updated = [...prev];
            const currentInterval = { ...updated[dragging.intervalIndex] };

            if (dragging.type === 'start') {
                currentInterval.start = newMinutes;
            } else {
                currentInterval.end = newMinutes;
            }

            updated[dragging.intervalIndex] = currentInterval;
            if (onChange) onChange(updated);
            return updated;
        });
    }, [dragging, stepMinutes, onChange]);

    const handlePointerUp = (e) => {
        if (dragging) {
            setDragging(null);
            try {
                e.target.releasePointerCapture(e.pointerId);
            } catch {
                // игнорируем, если фокус уже утерян
            }
        }
    };

    // Геометрия циферблата (фиксированная сетка viewBox 280x280)
    const size = 200;
    const center = size / 2; // 140
    const radius = 85;       // Единый радиус для серого кольца, дуг и бегунков

    // Генерация минутных рисок для циферблата
    const ticks = [];
    for (let m = 0; m < MINUTES_IN_DAY; m += 30) {
        const isMajor = m % 180 === 0; // Каждые 3 часа — основные риски
        const angle = minutesToAngle(m);
        const rad = (angle * Math.PI) / 180;
        const innerR = isMajor ? radius - 15 : radius - 13;
        const outerR = radius - 8;

        ticks.push({
            id: m,
            x1: center + innerR * Math.cos(rad),
            y1: center + innerR * Math.sin(rad),
            x2: center + outerR * Math.cos(rad),
            y2: center + outerR * Math.sin(rad),
            isMajor
        });
    }

    // Позиция точки текущего времени
    const nowAngle = minutesToAngle(currentTimeMinutes);
    const nowRad = (nowAngle * Math.PI) / 180;
    const nowX = center + (radius - 22) * Math.cos(nowRad);
    const nowY = center + (radius - 22) * Math.sin(nowRad);

    return (
        <div className={styles.container}>
            <div className={styles.svgWrapper}>
                <svg
                    ref={svgRef}
                    viewBox={`0 0 ${size} ${size}`}
                    className={styles.svg}
                    onPointerMove={handlePointerMove}
                    onPointerUp={handlePointerUp}
                >
                    {/* Базовое фоновое кольцо */}
                    <circle cx={center} cy={center} r={radius} className={styles.trackCircle} />

                    {/* Риски циферблата */}
                    {ticks.map((t) => (
                        <line
                            key={t.id}
                            x1={t.x1}
                            y1={t.y1}
                            x2={t.x2}
                            y2={t.y2}
                            className={t.isMajor ? styles.tickMajor : styles.tickMinor}
                        />
                    ))}

                    {/* Цифровые метки часов (24, 6, 12, 18) */}
                    <text x={center} y={center - radius + 20} className={styles.hourLabel}>24</text>
                    <text x={center + radius - 20} y={center} className={styles.hourLabel}>6</text>
                    <text x={center} y={center + radius - 20} className={styles.hourLabel}>12</text>
                    <text x={center - radius + 20} y={center} className={styles.hourLabel}>18</text>

                    {/* Активные дуги интервалов */}
                    {activeIntervals.map((interval, idx) => (
                        <path
                            key={interval.id || idx}

                            d={describeArc(interval.start, interval.end, radius, center)}
                            className={styles.activeArc}
                        />
                    ))}

                    {/* Индикатор текущего времени */}
                    <circle cx={nowX} cy={nowY} r={4.5} className={styles.nowDot} />

                    {/* Бегунки (ручки управления для каждого интервала) */}
                    {activeIntervals.map((interval, idx) => {
                        const startAngle = minutesToAngle(interval.start);
                        const endAngle = minutesToAngle(interval.end);
                        const startRad = (startAngle * Math.PI) / 180;
                        const endRad = (endAngle * Math.PI) / 180;

                        const startX = center + radius * Math.cos(startRad);
                        const startY = center + radius * Math.sin(startRad);
                        const endX = center + radius * Math.cos(endRad);
                        const endY = center + radius * Math.sin(endRad);

                        return (
                            <React.Fragment key={idx}>
                                {/* Бегунок начала интервала */}
                                <g
                                    className={`${styles.handleGroup} ${dragging?.intervalIndex === idx && dragging?.type === 'start' ? styles.handleDragging : ''}`}
                                    onPointerDown={(e) => handlePointerDown(idx, 'start', e)}
                                    transform={`translate(${startX}, ${startY})`}
                                >
                                    <circle r={14} className={styles.handleHitArea} />
                                    <circle r={9} className={styles.handleOuter} />
                                    <circle r={4.5} className={styles.handleInner} />
                                </g>

                                {/* Бегунок конца интервала */}
                                <g
                                    className={`${styles.handleGroup} ${dragging?.intervalIndex === idx && dragging?.type === 'end' ? styles.handleDragging : ''}`}
                                    onPointerDown={(e) => handlePointerDown(idx, 'end', e)}
                                    transform={`translate(${endX}, ${endY})`}
                                >
                                    <circle r={14} className={styles.handleHitArea} />
                                    <circle r={9} className={styles.handleOuter} />
                                    <circle r={4.5} className={styles.handleInner} />
                                </g>
                            </React.Fragment>
                        );
                    })}
                </svg>

                {/* Центральный информационный блок */}
                <div className={styles.centerContent}>
                    <p className={styles.title}>{title}</p>
                    <div className={styles.intervalsList}>
                        {activeIntervals.map((interval, idx) => (
                            <div key={idx} className={styles.intervalItem}>
                                <span className={styles.intervalLabel}>{interval.label}</span>
                                <span className={styles.intervalTime}>
                                    {minutesToTimeStr(interval.start)}-{minutesToTimeStr(interval.end)}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}