'use client';

import React, { useState, useRef, useEffect } from 'react';
import s from './s.module.css';

/**
 * Виджет заслонки и вентилятора с двумя режимами (Только индикация / Ручное управление)
 */
export function DamperFanWidgetMan({
    title = "Заслонка и Вентилятор",
    currentPosition = 35, // Текущее положение заслонки (0-100%)
    initialTarget = 50,    // Цель заслонки (0-100%)
    currentFan = 1,        // Текущая скорость вентилятора (0-3)
    initialFanTarget = 2,  // Цель/управление скоростью вентилятора (0-3)
    min = 0,
    max = 100,
    unit = '%',
    colorTheme = 'blue',
    onTargetChange,
    onFanTargetChange,
}) {
    // Состояние режима: false — только индикация, true — ручное управление
    const [isEditMode, setIsEditMode] = useState(false);

    // Локальные состояния для целей в режиме ручного управления
    const [damperTarget, setDamperTarget] = useState(initialTarget);
    const [fanTarget, setFanTarget] = useState(initialFanTarget);

    const [isDraggingDamper, setIsDraggingDamper] = useState(false);
    const [isDraggingFan, setIsDraggingFan] = useState(false);

    const damperScaleRef = useRef(null);
    const fanScaleRef = useRef(null);

    const clamp = (val, minVal, maxVal) => Math.max(minVal, Math.min(maxVal, val));

    // Проценты для текущих и целевых значений
    const currentDamperPercent = ((clamp(currentPosition, min, max) - min) / (max - min)) * 100;
    const targetDamperPercent = ((clamp(damperTarget, min, max) - min) / (max - min)) * 100;

    // Для вентилятора шкала от 0 до 3 (4 ступени: Выкл, 1, 2, 3)
    const currentFanPercent = (currentFan / 3) * 100;
    const targetFanPercent = (fanTarget / 3) * 100;

    // Расчет значения заслонки по клику/перетаскиванию
    const calculateDamperFromMouse = (clientY) => {
        if (!damperScaleRef.current) return;
        const rect = damperScaleRef.current.getBoundingClientRect();
        const offsetY = rect.bottom - clientY;
        const percentage = clamp(offsetY / rect.height, 0, 1);
        const rawValue = min + percentage * (max - min);
        return Math.round(rawValue);
    };

    // Расчет скорости вентилятора по клику/перетаскиванию (0 - 3)
    const calculateFanFromMouse = (clientY) => {
        if (!fanScaleRef.current) return;
        const rect = fanScaleRef.current.getBoundingClientRect();
        const offsetY = rect.bottom - clientY;
        const percentage = clamp(offsetY / rect.height, 0, 1);
        const rawValue = percentage * 3;
        return Math.round(rawValue);
    };

    // Обработчики мыши для Заслонки
    const handleDamperMouseDown = (e) => {
        if (!isEditMode) return;
        e.preventDefault();
        setIsDraggingDamper(true);
        const val = calculateDamperFromMouse(e.clientY);
        if (val !== undefined) {
            setDamperTarget(val);
            if (onTargetChange) onTargetChange(val);
        }
    };

    // Обработчики мыши для Вентилятора
    const handleFanMouseDown = (e) => {
        if (!isEditMode) return;
        e.preventDefault();
        setIsDraggingFan(true);
        const val = calculateFanFromMouse(e.clientY);
        if (val !== undefined) {
            setFanTarget(val);
            if (onFanTargetChange) onFanTargetChange(val);
        }
    };

    useEffect(() => {
        const handleMouseMove = (e) => {
            if (isDraggingDamper) {
                const val = calculateDamperFromMouse(e.clientY);
                if (val !== undefined) {
                    setDamperTarget(val);
                    if (onTargetChange) onTargetChange(val);
                }
            }
            if (isDraggingFan) {
                const val = calculateFanFromMouse(e.clientY);
                if (val !== undefined) {
                    setFanTarget(val);
                    if (onFanTargetChange) onFanTargetChange(val);
                }
            }
        };

        const handleMouseUp = () => {
            setIsDraggingDamper(false);
            setIsDraggingFan(false);
        };

        if (isDraggingDamper || isDraggingFan) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        }
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDraggingDamper, isDraggingFan, min, max]);

    return (
        <div className={`${s.widgetCard} ${s[colorTheme]} ${isEditMode ? s.editActive : ''}`}>
            {/* Заголовок виджета с кнопкой переключения режима (иконка-шестеренка / замок) */}
            <div className={s.widgetHeader}>
                <span className={s.title}>{title}</span>
                <div className={s.headerRight}>
                    <span className={s.modeIndicatorText}>
                        {isEditMode ? 'Ручное' : 'Индикация'}
                    </span>
                    <button
                        className={`${s.modeToggleBtn} ${isEditMode ? s.activeModeBtn : ''}`}
                        onClick={() => setIsEditMode(!isEditMode)}
                        title={isEditMode ? "Заблокировать (только индикация)" : "Включить ручное управление"}
                    >
                        {/* Иконка переключения режима (настройки/ползунки) */}
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1Z" />
                        </svg>
                    </button>
                </div>
            </div>

            <div className={s.widgetBody}>
                {/* Два столбца: первый для заслонки, второй для вентилятора (как в BME280) */}
                <div className={s.columnsWrapper}>

                    {/* СТОЛБЕЦ 1: Заслонка */}
                    <div className={s.columnUnit}>
                        <span className={s.columnTitle}>Заслонка</span>
                        <div
                            className={`${s.scaleGroup} ${isEditMode ? s.interactive : ''}`}
                            ref={damperScaleRef}
                            onMouseDown={handleDamperMouseDown}
                        >
                            {/* Градации шкалы заслонки */}
                            <div className={s.graduations}>
                                <span>{max}</span>
                                <span>{((max + min) / 2).toFixed(0)}</span>
                                <span>{min}</span>
                            </div>

                            {/* Полый столбец заслонки */}
                            <div className={s.hollowColumn}>
                                <div
                                    className={s.fillLevel}
                                    style={{ height: `${currentDamperPercent}%` }}
                                />
                            </div>

                            {/* Указатель цели заслонки (виден только в ручном режиме) */}
                            {isEditMode && (
                                <div className={s.targetSliderArea}>
                                    <div
                                        className={s.targetPointer}
                                        style={{ bottom: `${targetDamperPercent}%` }}
                                        title={`Цель: ${damperTarget}%`}
                                    >
                                        <div className={s.triangle} />
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className={s.columnValueBottom}>
                            <span className={s.valNumber}>{currentPosition}</span>
                            <span className={s.valUnit}>{unit}</span>
                        </div>
                        {isEditMode && (
                            <span className={s.targetSubLabel}>Цель: {damperTarget}%</span>
                        )}
                    </div>

                    {/* СТОЛБЕЦ 2: Вентилятор */}
                    <div className={s.columnUnit}>
                        <span className={s.columnTitle}>Вентилятор</span>
                        <div
                            className={`${s.scaleGroup} ${isEditMode ? s.interactive : ''}`}
                            ref={fanScaleRef}
                            onMouseDown={handleFanMouseDown}
                        >
                            {/* Градации шкалы вентилятора (скорости 0-3) */}
                            <div className={s.graduations}>
                                <span>3</span>
                                <span>2</span>
                                <span>0</span>
                            </div>

                            {/* Полый столбец вентилятора */}
                            <div className={s.hollowColumn}>
                                <div
                                    className={`${s.fillLevel} ${s.fanFill}`}
                                    style={{ height: `${currentFanPercent}%` }}
                                />
                            </div>

                            {/* Указатель цели вентилятора (виден только в ручном режиме) */}
                            {isEditMode && (
                                <div className={s.targetSliderArea}>
                                    <div
                                        className={s.targetPointer}
                                        style={{ bottom: `${targetFanPercent}%` }}
                                        title={`Цель: ${fanTarget}`}
                                    >
                                        <div className={s.triangle} />
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className={s.columnValueBottom}>
                            <span className={s.valNumber}>{currentFan === 0 ? 'Выкл' : currentFan}</span>
                        </div>
                        {isEditMode && (
                            <span className={s.targetSubLabel}>Цель: {fanTarget === 0 ? 'Выкл' : fanTarget}</span>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
}