'use client';

import React, { useState, useRef } from 'react';
import s from './s.module.css';

/**
 * Виджет заслонки и вентилятора (управление сквозняком)
 * @param {string} title - Название (например, "Приток: Кухня")
 * @param {number} currentPosition - Текущий угол/процент открытия заслонки (0-100%)
 * @param {number} initialTarget - Целевое положение заслонки (0-100%)
 * @param {number} fanSpeed - Текущая скорость вентилятора (0 - выкл, 1, 2, 3)
 * @param {'blue' | 'green' | 'orange'} colorTheme - Цветовая тема
 */
export function DamperFanWidget({
    title = "Заслонка и Вентилятор",
    currentPosition = 35,
    initialTarget = 50,
    fanSpeed = 1,
    colorTheme = 'blue',
    onTargetChange,
    onFanSpeedChange,
}) {
    const [target, setTarget] = useState(initialTarget);
    const [isDragging, setIsDragging] = useState(false);
    const svgRef = useRef(null);

    // Параметры SVG окружности (дуга 270 градусов: от -225° до 45°)
    const radius = 70;
    const circumference = 2 * Math.PI * radius;
    // Используем дугу в 3/4 окружности (270 градусов)
    const arcLength = circumference * 0.75;

    // Конвертируем значение 0-100% в угол по дуге
    const percentToAngle = (val) => {
        const clamped = Math.max(0, Math.min(100, val));
        // От -135 градусов до +135 градусов (всего 270°)
        return -135 + (clamped / 100) * 270;
    };

    const currentPercent = Math.max(0, Math.min(100, currentPosition));
    const targetPercent = Math.max(0, Math.min(100, target));

    // Расчет процента заполнения для SVG дуги
    const currentStrokeDashoffset = arcLength - (currentPercent / 100) * arcLength;

    // Вычисление положения ползунка-указателя на окружности по углам
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

    // Обработка клика/перетаскивания по кругу для изменения цели
    const updateTargetFromMouse = (clientX, clientY) => {
        if (!svgRef.current) return;
        const rect = svgRef.current.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;

        // Угол от центра до курсора
        let radians = Math.atan2(clientY - cy, clientX - cx);
        let degrees = radians * (180 / Math.PI) + 90;
        if (degrees < 0) degrees += 360;

        // Преобразуем 360° в нашу шкалу (-135° ... +135°)
        let scaleVal = degrees;
        if (scaleVal > 225 && scaleVal <= 360) {
            scaleVal = scaleVal - 360; // переводим в отрицательную зону левой части
        }

        // Ограничиваем диапазон от -135 до +135 градусов
        if (scaleVal < -135) scaleVal = -135;
        if (scaleVal > 135) scaleVal = 135;

        // Переводим градусы в проценты 0-100%
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

    React.useEffect(() => {
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
                <span className={s.targetLabel}>Цель: {target}%</span>
            </div>

            <div className={s.widgetBody}>
                {/* Круговая шкала */}
                <div
                    className={s.circularContainer}
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

                    {/* Треугольный ползунок-указатель цели на окружности */}
                    <div
                        className={s.targetPointerContainer}
                        style={{
                            left: `${targetCoords.x}px`,
                            top: `${targetCoords.y}px`,
                        }}
                        title={`Цель заслонки: ${target}%`}
                    >
                        <div className={s.triangleIndicator} />
                    </div>

                    {/* Центральный блок: текущее открытие и статус вентилятора */}
                    <div className={s.centerInfo}>
                        <span className={s.currentVal}>{currentPosition}%</span>
                        <span className={s.subText}>Заслонка</span>
                    </div>
                </div>

                {/* Панель управления скоростью вентилятора */}
                <div className={s.fanControlPanel}>
                    <span className={s.fanLabel}>Вентилятор сквозняка:</span>
                    <div className={s.fanButtons}>
                        {[0, 1, 2, 3].map((speed) => (
                            <button
                                key={speed}
                                className={`${s.fanBtn} ${fanSpeed === speed ? s.activeFan : ''}`}
                                onClick={() => onFanSpeedChange && onFanSpeedChange(speed)}
                            >
                                {speed === 0 ? 'Выкл' : speed}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}