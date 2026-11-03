'use client';

import React, { useState, useRef, useEffect } from 'react';
import s from './s.module.css';

export function CircleSetWidget({
    title = "Параметр",
    currentPosition = 35,
    initialTarget = 50,
    min = 15,
    max = 90,
    unit = '%',
    colorTheme = 'blue',
    onTargetChange,

}) {
    // Состояние режима: 'auto' (авто) или 'manual' (ручной)
    const [target, setTarget] = useState(initialTarget);
    const [isDragging, setIsDragging] = useState(false);
    const svgRef = useRef(null);
    // Параметры SVG окружности (дуга 270 градусов: от -225° до 45°)
    const radius = 70;
    const circumference = 2 * Math.PI * radius;
    const arcLength = circumference * 0.75;

    // Конвертируем значение 0-100% в угол по дуге
    const percentToAngle = (val) => {
        const clamped = Math.max(0, Math.min(100, val));
        return -135 + (clamped / 100) * 270;
    };

    const currentPercent = Math.max(0, Math.min(100, currentPosition));

    // Расчет процента заполнения для SVG дуги
    const currentStrokeDashoffset = arcLength - (currentPercent / 100) * arcLength;

    // Вычисление положения круглого ползунка-указателя на окружности по углам
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

    const targetCoords = getCoordinatesForPercent(target);

    // Обработка клика/перетаскивания по кругу для изменения цели (только в ручном режиме)
    const updateTargetFromMouse = (clientX, clientY) => {
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

        const newPercent = ((scaleVal + 135) / 270) * 100;
        const rounded = Math.round(newPercent);

        setTarget(rounded);
        if (onTargetChange) onTargetChange(rounded);
    };

    const handleMouseDown = (e) => {

        e.preventDefault();
        setIsDragging(true);
        updateTargetFromMouse(e.clientX, e.clientY);
    };

    useEffect(() => {
        const handleMouseMove = (e) => {
            if (!isDragging) return;
            updateTargetFromMouse(e.clientX, e.clientY);
        };

        const handleMouseUp = () => {
            if (isDragging) setIsDragging(false);
        };

        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        }
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging]);
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
                        {/* Заполняющаяся дуга текущего положения заслонки */}
                        <circle
                            className={s.progressTrack}
                            cx="90"
                            cy="90"
                            r={radius}
                            strokeDasharray={`${arcLength} ${circumference}`}
                            strokeDashoffset={currentStrokeDashoffset}
                        />
                    </svg>
                    <div
                        className={s.targetCirclePointerContainer}
                        style={{
                            /* Вращаем контейнер из центра на нужный угол */
                            transform: `translate(-50%, -50%) rotate(${percentToAngle(target)}deg)`,
                        }}
                        title={`Цель: ${target}%`}
                    >
                        <div className={s.circleIndicator} />
                    </div>
                    {/* Центральный блок: текущее открытие */}
                    <div className={s.centerInfo}>
                        <span className={s.currentVal}>{currentPosition}<small>{unit}</small></span>
                        <span className={s.subText}>|</span>
                        <span className={s.targetLabel}>Цель: {target} <small>{unit}</small> </span>
                    </div>
                </div>
            </div>
        </div>
    );
}