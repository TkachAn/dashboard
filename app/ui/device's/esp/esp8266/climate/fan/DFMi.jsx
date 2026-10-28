'use client';

import React, { useState, useRef, useEffect } from 'react';
import s from './s.module.css';

/**
 * Виджет заслонки и вентилятора (управление сквозняком)
 */
export function DamperFanIndicator({
    title = "Заслонка и Вентилятор",
    currentPosition = 35,
    initialTarget = 50,
    fanSpeed = 1,
    colorTheme = 'blue',
    onTargetChange,
    onFanSpeedChange,
    onModeChange,
}) {
    // Состояние режима: 'auto' (авто) или 'manual' (ручной)
    const [target, setTarget] = useState(initialTarget);
    const [isDragging, setIsDragging] = useState(false);
    const svgRef = useRef(null);
    const [mode, setMode] = useState('auto');
    const [activeSpeed, setActiveSpeed] = useState(fanSpeed); // Состояние выбранной скорости

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
        if (mode !== 'manual' || !svgRef.current) return;
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
        if (mode !== 'manual') return;
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
    }, [isDragging, mode]);

    // Функция переключения режимов при нажатии на крайнюю кнопку
    const handleModeToggle = () => {
        const nextMode = mode === 'auto' ? 'manual' : 'auto';
        setMode(nextMode);
        if (onModeChange) onModeChange(nextMode);
    };
    // Обработка клика по кнопке скорости (1, 2, 3) — переключает активную скорость
    const handleSpeedClick = (speed) => {
        if (mode === 'auto') return;
        setActiveSpeed(speed);
        if (onFanSpeedChange) onFanSpeedChange(speed);
    };
    return (
        <div className={`${s.widgetCard} ${s[colorTheme]}`}>
            <div className={s.widgetHeader}>
                <span className={s.title}>{title}</span>

            </div>

            <div className={s.widgetBody}>
                {/* Круговая шкала */}
                <div
                    className={`${s.circularContainer} ${mode === 'manual' ? s.interactiveCircle : ''}`}
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

                    {/* Круглый ползунок отображается ТОЛЬКО в ручном режиме */}


                    {mode === 'manual' && (
                        <div
                            className={s.targetCirclePointerContainer}
                            style={{
                                /* Вращаем контейнер из центра на нужный угол */
                                transform: `translate(-50%, -50%) rotate(${percentToAngle(target)}deg)`,
                            }}
                            title={`Цель заслонки: ${target}%`}
                        >
                            <div className={s.circleIndicator} />
                        </div>
                    )}


                    {/* Центральный блок: текущее открытие */}
                    <div className={s.centerInfo}>
                        {mode === 'auto' ? <span className={s.targetLabel}>Авто</span> : <span className={s.targetLabel}>Ручной</span>}
                        <span className={s.currentVal}>{currentPosition}%</span>
                        <span className={s.subText}>Заслонка</span>
                        <span className={s.targetLabel}>Цель: {target}%</span>
                    </div>
                </div>

                {/* Панель управления скоростью вентилятора */}
                <div className={s.fanControlPanel}>
                    <span className={s.fanLabel}>Вентилятор сквозняка:</span>
                    <div className={s.fanButtons}>
                        {/* Кнопки скоростей 1, 2, 3 (активны только в ручном режиме) */}
                        {[1, 2, 3].map((speed) => (
                            <button
                                key={speed}
                                disabled={mode === 'auto'}
                                className={`${s.fanBtn} ${activeSpeed === speed && mode === 'manual' ? s.activeFan : ''}`}
                                onClick={() => handleSpeedClick(speed)}
                            >
                                {speed}
                            </button>
                        ))}


                        {/* Вместо кнопки "Выкл" теперь кнопка переключения режимов */}
                        <button
                            className={`${s.fanBtn} ${s.modeToggleBtn}`}
                            onClick={handleModeToggle}
                        >
                            {mode === 'auto' ? 'Ручн.' : 'Авто'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}


/*  {[1, 2, 3].map((speed) => (
                            <button
                                key={speed}
                                disabled={mode === 'auto'}
                                className={`${s.fanBtn} ${fanSpeed === speed ? s.activeFan : ''}`}
                                onClick={() => mode === 'manual' && onFanSpeedChange && onFanSpeedChange(speed)}
                            >
                                {speed}
                            </button>
                        ))}
*/



/*
{mode === 'manual' && <span className={s.targetLabel}>Цель: {target}%</span>}

 /* Круглый ползунок отображается ТОЛЬКО в ручном режиме 
                    {mode === 'manual' && (
                        <div
                            className={s.targetCirclePointerContainer}
                            style={{
                                left: `${targetCoords.x}px`,
                                top: `${targetCoords.y}px`,
                            }}
                            title={`Цель заслонки: ${target}%`}
                        >
                            <div className={s.circleIndicator} />
                        </div>
                    )}

                                            <circle
                            cx={targetCoords.x}
                            cy={targetCoords.y}
                            r="7"
                            className={s.svgPointer}
                        />


*/