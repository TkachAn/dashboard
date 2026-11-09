'use client';

import React, { useState, useRef, useEffect } from 'react';
import s from './s.module.css';

export function CircleSetWidget({
    title = "Параметр:",
    current = 18,
    initialTarget = 22,
    min = 15,
    max = 27,
    unit = 'ед.',
    colorTheme = 'blue',
    onTargetChange,
}) {
    const [target, setTarget] = useState(initialTarget);
    const [isDragging, setIsDragging] = useState(false);
    const svgRef = useRef(null);

    const clamp = (val, minVal, maxVal) => Math.max(minVal, Math.min(maxVal, val));

    // Параметры SVG окружности (дуга 270 градусов: от -225° до 45°)
    const radius = 70;
    const circumference = 2 * Math.PI * radius;
    const arcLength = circumference * 0.75;

    // Конвертируем значение в проценты шкалы (0-100%) на основе min и max
    const currentPercent = ((clamp(current, min, max) - min) / (max - min)) * 100;
    const targetPercent = ((clamp(target, min, max) - min) / (max - min)) * 100;

    // Перевод процента заполнения (0-100) в угол дуги (-135° ... +135°)
    const percentToAngle = (percent) => {
        const clampedPercent = clamp(percent, 0, 100);
        return -135 + (clampedPercent / 100) * 270;
    };

    // Расчет процента заполнения для SVG дуги текущего значения
    const currentStrokeDashoffset = arcLength - (currentPercent / 100) * arcLength;

    // Вычисление положения указателя цели на окружности
    const getCoordinatesForPercent = (percent) => {
        const angleDeg = percentToAngle(percent);
        const angleRad = (angleDeg - 90) * (Math.PI / 180);
        const cx = 90;
        const cy = 90;
        return {
            x: cx + radius * Math.cos(angleRad),
            y: cy + radius * Math.sin(angleRad),
        };
    };

    const targetCoords = getCoordinatesForPercent(targetPercent);

    // Функция расчёта значения по позиции мыши вокруг центра окружности
    const calculateValueFromPosition = (clientX, clientY) => {
        if (!svgRef.current) return;
        const rect = svgRef.current.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;

        let radians = Math.atan2(clientY - cy, clientX - cx);
        let degrees = radians * (180 / Math.PI) + 90;
        if (degrees < 0) degrees += 360;

        let scaleVal = degrees;
        if (scaleVal > 225 && scaleVal <= 360) {
            scaleVal = scaleVal - 360;
        }

        if (scaleVal < -135) scaleVal = -135;
        if (scaleVal > 135) scaleVal = 135;

        // Переводим угол в процент шкалы (0-100)
        const percentage = (scaleVal + 135) / 270;

        // Мапим процент в диапазон min...max
        const rawValue = min + percentage * (max - min);
        const newValue = Math.round(rawValue * 10) / 10;

        return clamp(newValue, min, max);
    };

    const handleMouseDown = (e) => {
        e.preventDefault();
        setIsDragging(true);
        const newValue = calculateValueFromPosition(e.clientX, e.clientY);
        if (newValue !== undefined) {
            setTarget(newValue);
            if (onTargetChange) onTargetChange(newValue);
        }
    };

    const handleSetMin = (e) => {
        e.stopPropagation();
        setTarget(min);
        if (onTargetChange) onTargetChange(min);
    };

    const handleSetMax = (e) => {
        e.stopPropagation();
        setTarget(max);
        if (onTargetChange) onTargetChange(max);
    };

    useEffect(() => {
        const handleMouseMove = (e) => {
            if (!isDragging) return;
            const newValue = calculateValueFromPosition(e.clientX, e.clientY);
            if (newValue !== undefined) {
                setTarget(newValue);
                if (onTargetChange) onTargetChange(newValue);
            }
        };

        const handleMouseUp = () => {
            if (isDragging) {
                setIsDragging(false);
            }
        };

        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        }

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, min, max]);

    return (
        <div className={`${s.widgetCard} ${s[colorTheme]}`}>
            <div className={s.widgetHeader}>
                <span className={s.title}>{title}</span>
            </div>
            <div className={s.widgetBody}>
                {/* Круговая шкала */}
                <div
                    className={`${s.circularContainer} ${s.interactiveCircle}`}
                    ref={svgRef}
                    onMouseDown={handleMouseDown}
                    style={{ cursor: 'pointer', userSelect: 'none' }}
                >
                    <svg className={s.circularSvg} viewBox="0 0 180 180">
                        {/* Фоновая полая дуга шкалы */}
                        <circle
                            className={s.bgTrack}
                            cx="90"
                            cy="90"
                            r={radius}
                            strokeDasharray={`${arcLength} ${circumference}`}
                        />
                        {/* Заполняющаяся дуга текущего положения */}
                        <circle
                            className={s.progressTrack}
                            cx="90"
                            cy="90"
                            r={radius}
                            strokeDasharray={`${arcLength} ${circumference}`}
                            strokeDashoffset={currentStrokeDashoffset}
                        />
                    </svg>
                    {/* Подписи-кнопки Min и Max по краям шкалы (начало и конец дуги 270°) */}
                    <button
                        type="button"
                        className={s.scaleMinLabel}
                        onClick={handleSetMin}
                        onMouseDown={(e) => e.stopPropagation()}
                    >
                        min:{min}
                    </button>
                    <button
                        type="button"
                        className={s.scaleMaxLabel}
                        onClick={handleSetMax}
                        onMouseDown={(e) => e.stopPropagation()}
                    >
                        max:{max}
                    </button>
                    {/* Поворот указателя цели по шкале с учетом min/max */}
                    <div
                        className={s.targetCirclePointerContainer}
                        style={{
                            transform: `translate(-50%, -50%) rotate(${percentToAngle(targetPercent)}deg)`,
                        }}
                        title={`Цель: ${target}${unit}`}
                    >
                        <div className={s.circleIndicator} />
                    </div>

                    {/* Центральный блок: текущее открытие */}
                    <div className={s.centerInfo}>
                        <span className={s.currentVal}>{current}<small>{unit}</small></span>
                        <span className={s.subText}>|</span>
                        <span className={s.targetLabel}>Цель: <b>{target}</b>{unit}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}