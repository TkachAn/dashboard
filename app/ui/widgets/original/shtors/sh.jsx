'use client';
import React, { useState } from 'react';
import styles from './s1.module.css';

/**
 * Виджет управления обычной (тканевой / рулонной) шторой
 * @param {string} title - Название виджета
 * @param {'auto' | 'manual'} initialMode - Режим работы по умолчанию
 * @param {'closed' | 'door' | 'full'} initialPosition - Фиксированная позиция шторы
 * @param {number} currentLightOutdoor - Внешняя освещенность (лк)
 * @param {number} currentLightIndoor - Внутренняя освещенность (лк)
 * @param {number} lightThreshold - Порог уставки для автоматики (лк)
 */
export function FabricCurtainControl({
    title = "Штора (Оконный блок)",
    initialMode = 'auto',
    initialPosition = 'closed', // 'closed' | 'door' | 'full'
    currentLightOutdoor = 650,
    currentLightIndoor = 300,
    lightThreshold = 400,
    onModeChange,
    onPositionChange,
}) {
    const [mode, setMode] = useState(initialMode);
    const [position, setPosition] = useState(initialPosition);

    // Переключение режимов (Авто / Ручной)
    const toggleMode = () => {
        const newMode = mode === 'auto' ? 'manual' : 'auto';
        setMode(newMode);
        if (onModeChange) onModeChange(newMode);
    };

    // Ручная смена положения шторы
    const handlePosSelect = (pos) => {
        if (mode !== 'manual') return;
        setPosition(pos);
        if (onPositionChange) onPositionChange(pos);
    };

    // Обозначение текущей позиции текстом
    const getPositionLabel = (pos) => {
        switch (pos) {
            case 'closed': return 'Закрыта';
            case 'door': return 'Только дверь';
            case 'full': return 'Открыта полностью';
            default: return pos;
        }
    };

    return (
        <div className={styles.curtainCard}>
            {/* Шапка виджета */}
            <div className={styles.cardHeader}>
                <div className={styles.titleWrapper}>
                    <span className={styles.icon}>🪟</span>
                    <h3 className={styles.cardTitle}>{title}</h3>
                </div>

                {/* Переключатель режима */}
                <button
                    className={styles.modeToggleBtn}
                    onClick={toggleMode}
                    title="Переключить режим Авто / Ручной"
                >
                    {mode === 'auto' ? 'Ручн.' : 'Авто'}
                </button>
            </div>

            <div className={styles.cardBody}>
                {mode === 'auto' ? (
                    /* РЕЖИМ АВТО: Системная информация и текущий статус */
                    <div className={styles.autoStateContainer}>
                        {/* Блок 1: Датчики освещенности */}
                        <div className={styles.infoBlock}>
                            <span className={styles.blockLabel}>Освещенность</span>
                            <div className={styles.lightValuesRow}>
                                <span className={styles.lightBadge}>Улица: <b>{currentLightOutdoor} лк</b></span>
                                <span className={styles.lightBadge}>Помещ: <b>{currentLightIndoor} лк</b></span>
                            </div>
                        </div>

                        {/* Блок 2: Порог автоматики */}
                        <div className={styles.infoBlock}>
                            <span className={styles.blockLabel}>Порог срабатывания</span>
                            <span className={styles.blockValueHighlight}>{lightThreshold} лк</span>
                        </div>

                        {/* Блок 3: Текущее автоматическое состояние */}
                        <div className={styles.infoBlock}>
                            <span className={styles.blockLabel}>Статус автоматики</span>
                            <div className={styles.statusSubRow}>
                                <span>Положение: <b>{getPositionLabel(position)}</b></span>
                            </div>
                        </div>
                    </div>
                ) : (
                    /* РЕЖИМ РУЧНОЙ: Кнопки выбора 3 положений */
                    <div className={styles.manualStateContainer}>
                        {/* Блок 1: Ручной выбор положения */}
                        <div className={styles.controlBlock}>
                            <span className={styles.blockLabel}>Положение шторы</span>
                            <div className={styles.posButtonsGroup}>
                                <button
                                    className={`${styles.posBtn} ${position === 'closed' ? styles.active : ''}`}
                                    onClick={() => handlePosSelect('closed')}
                                >
                                    Закрыта
                                </button>
                                <button
                                    className={`${styles.posBtn} ${position === 'door' ? styles.active : ''}`}
                                    onClick={() => handlePosSelect('door')}
                                >
                                    Дверь
                                </button>
                                <button
                                    className={`${styles.posBtn} ${position === 'full' ? styles.active : ''}`}
                                    onClick={() => handlePosSelect('full')}
                                >
                                    Полностью
                                </button>
                            </div>
                        </div>

                        {/* Блок 2: Выбранное состояние */}
                        <div className={styles.controlBlock}>
                            <span className={styles.blockLabel}>Текущее состояние</span>
                            <span className={styles.blockValueHighlight}>{getPositionLabel(position)}</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}