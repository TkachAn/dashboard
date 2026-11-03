'use client';

import React, { useState, useRef, useEffect } from 'react';
import s from './s.module.css';

export function ClimateWidget({
    title = "Климат",
    current = 18,
    initialTarget = 22,
    min = 15,
    max = 27,
    unit = '°C',
    colorTheme = 'blue',
    onTargetChange, // Опциональный колбэк для передачи нового значения наверх/в ESP8266
}) {
    const [target, setTarget] = useState(initialTarget);
    const [isDragging, setIsDragging] = useState(false);
    const scaleRef = useRef(null);

    const clamp = (val, minVal, maxVal) => Math.max(minVal, Math.min(maxVal, val));

    const currentPercent = ((clamp(current, min, max) - min) / (max - min)) * 100;
    const targetPercent = ((clamp(target, min, max) - min) / (max - min)) * 100;

    // Функция расчёта значения по координате клика/перетаскивания мыши
    const calculateValueFromPosition = (clientY) => {
        if (!scaleRef.current) return;
        const rect = scaleRef.current.getBoundingClientRect();
        const height = rect.height;

        // Позиция Y относительно нижней границы шкалы (так как шкала снизу вверх)
        const offsetY = rect.bottom - clientY;
        const percentage = clamp(offsetY / height, 0, 1);

        // Вычисляем новое значение с округлением до десятых (или целых)
        const rawValue = min + percentage * (max - min);
        const newValue = Math.round(rawValue * 10) / 10;

        return clamp(newValue, min, max);
    };

    const handleMouseDown = (e) => {
        e.preventDefault();
        setIsDragging(true);
        const newValue = calculateValueFromPosition(e.clientY);
        if (newValue !== undefined) {
            setTarget(newValue);
            if (onTargetChange) onTargetChange(newValue);
        }
    };

    useEffect(() => {
        const handleMouseMove = (e) => {
            if (!isDragging) return;
            const newValue = calculateValueFromPosition(e.clientY);
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
                <span className={s.currentVal}>
                    {current}
                    <span className={s.unit}>{unit}</span>
                </span>
            </div>

            <div className={s.widgetBody}>
                {/* Интерактивный блок шкалы, соединенный с ref для отслеживания кликов и перетаскивания */}
                <div
                    className={s.scaleGroup}
                    ref={scaleRef}
                    onMouseDown={handleMouseDown}
                    style={{ cursor: 'pointer', userSelect: 'none' }}
                >
                    {/* Цифры шкалы (слева от столбца) */}
                    <div className={s.graduations}>
                        <span>{max}</span>
                        <span>{((max + min) / 2).toFixed(0)}</span>
                        <span>{min}</span>
                    </div>

                    {/* Полый столбец с заливкой */}
                    <div className={s.hollowColumn}>
                        <div
                            className={s.fillLevel}
                            style={{ height: `${currentPercent}%` }}
                        />
                    </div>

                    {/* Треугольный указатель цели (справа вплотную к столбцу) */}
                    <div className={s.targetSliderArea}>
                        <div
                            className={s.targetPointer}
                            style={{ bottom: `${targetPercent}%` }}
                            title={`Цель: ${target}${unit} (тяните для изменения)`}
                        >
                            <div className={s.triangle} />
                        </div>
                    </div>
                </div>

                {/* Текущее значение вынесено вниз для наглядности */}
                <div className={s.currentValueContainer}>

                    <span className={s.targetLabel}>Цель: {target}{unit}</span>
                </div>
            </div>
        </div>
    );
}