'use client';

import React, { useState } from 'react';
import { ClimateWidget } from '../../bme/bme280';
import { Blinds } from "lucide-react"

import styles from './s.module.css';
/**
 * Компонент управления вертикальными жалюзи (Спальня)
 * @param {string} title - Название виджета
 * @param {'auto' | 'manual'} initialMode - Режим по умолчанию
 * @param {'closed' | 'door' | 'full'} initialPosition - Позиция жалюзи
 * @param {number} initialAngle - Угол ламелей (-90 до 90, 0 = Лайт)
 * @param {number} currentLightIndoor - Внутренняя освещенность (люкс)
 * @param {number} currentLightOutdoor - Внешняя освещенность (люкс)
 * 
 */
//const titleC = (<h3>Жалюзи</h3><small> Оконный + дверь</small><br/>);
const titleC = (
    <>
        <span style={{ fontSize: '1.1rem', fontWeight: '600', display: 'block' }}>Жалюзи</span>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '400' }}>Оконный блок + дверь</span>
    </>
);


export function VerticalBlindsControl({
    title = titleC,
    initialMode = 'auto',
    initialPosition = 'door', // 'closed' | 'door' | 'full'
    initialAngle = 0,        // от -90 до 90
    currentLightOutdoor = 650, // люксы на улице
    currentLightIndoor = 300,  // люксы в помещении
    lightThreshold = 400,      // порог срабатывания
    onModeChange,
    onPositionChange,
    onAngleChange,
}) {
    const [mode, setMode] = useState(initialMode); // 'auto' | 'manual'
    const [position, setPosition] = useState(initialPosition);
    const [angle, setAngle] = useState(initialAngle);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Переключение режима Авто / Ручной
    const toggleMode = () => {
        const newMode = mode === 'auto' ? 'manual' : 'auto';
        setMode(newMode);
        if (onModeChange) onModeChange(newMode);
    };

    // Выбор позиции в ручном режиме
    const handlePosSelect = (pos) => {
        if (mode !== 'manual') return;
        setPosition(pos);
        if (onPositionChange) onPositionChange(pos);
    };

    // Изменение угла поворота ламелей в ручном режиме
    const handleAngleChange = (e) => {
        if (mode !== 'manual') return;
        const val = Number(e.target.value);
        setAngle(val);
        if (onAngleChange) onAngleChange(val);
    };

    // Текстовое описание текущей позиции
    const getPositionLabel = (pos) => {
        switch (pos) {
            case 'closed': return 'Закрыто';
            case 'door': return 'Только дверь';
            case 'full': return 'Открыто';
            default: return pos;
        }
    };

    return (
        <div className={styles.blindsCard}>
            {/* Шапка виджета */}
            <div className={styles.cardHeader}>
                <div className={styles.titleWrapper}>

                    <h3 className={styles.cardTitle}>{title}</h3>

                </div>

                {/* Кнопка переключения режима */}
                <button
                    className={styles.modeToggleBtn}
                    onClick={toggleMode}
                >
                    {mode === 'auto' ? 'Ручн.' : 'Авто'}
                </button>
            </div>

            <div className={styles.cardBody}>
                {mode === 'auto' ? (
                    /* РЕЖИМ АВТО: 3 блока-индикатора, идентичные по компоновке ручному режиму */
                    <div className={styles.autoModeBox}>

                        {/* Блок 1: Освещенность (улица / комната) */}
                        <div className={styles.positionSection}>
                            <div className={styles.positionTitle}>

                                <span className={styles.sectionLabel}>Освещенность</span>

                                <span className={styles.blockTitle}>Срабатывание</span>
                            </div>
                            <div className={styles.positionButtons}>


                                <span className={styles.text}><small>снаружи:</small> <strong>{currentLightOutdoor} </strong><small>лк</small></span>


                                <span className={styles.text}><small>внутри:</small> <strong>{currentLightIndoor} </strong><small>лк</small></span>


                                <button
                                    className={`${styles.posBtn} ${styles.activePos}`}
                                    onClick={() => setIsModalOpen(true)}
                                >
                                    <small>парог: </small>{lightThreshold} <small>лк</small>
                                </button>


                            </div>
                        </div>

                        {/* Блок 3: Текущее состояние штор и ламелей */}
                        <div className={styles.infoSection}>
                            <div className={styles.subIndicatorBox}>
                                <span className={styles.subTitle}>Положение штор</span>
                                <span className={styles.subVal}>{getPositionLabel(position)}</span>
                            </div>
                            <div className={styles.subIndicatorBox}>
                                <span className={styles.subTitle}>Угол ламелей</span>
                                <span className={styles.subVal}>{angle}° ({angle === 0 ? 'Лайт' : 'Дарк'})</span>
                            </div>
                        </div>
                    </div>
                ) : (
                    /* РЕЖИМ РУЧНОЙ: Элементы управления с той же вертикальной структурой */
                    <div className={styles.manualModeBox}>

                        {/* 1. Кнопки фиксированных позиций */}
                        <div className={styles.positionSection}>
                            <div className={styles.positionTitle}>
                                <span className={styles.sectionLabel}>Положение штор:</span>
                            </div>
                            <div className={styles.positionButtons}>
                                <button
                                    className={`${styles.posBtn} ${position === 'closed' ? styles.activePos : ''}`}
                                    onClick={() => handlePosSelect('closed')}
                                >
                                    Закрыто
                                </button>
                                <button
                                    className={`${styles.posBtn} ${position === 'door' ? styles.activePos : ''}`}
                                    onClick={() => handlePosSelect('door')}
                                >
                                    Только дверь
                                </button>
                                <button
                                    className={`${styles.posBtn} ${position === 'full' ? styles.activePos : ''}`}
                                    onClick={() => handlePosSelect('full')}
                                >
                                    Открыто
                                </button>
                            </div>
                        </div>

                        {/* 2. Поворот ламелей с помощью регулятора (-90 до 90) */}

                        <div className={styles.angleSection}>
                            <div className={styles.angleHeader}>
                                <span className={styles.sectionLabel}>Поворот ламелей:</span>
                                <span className={styles.angleValueBadge}>
                                    {angle}° ({angle === 0 ? 'Лайт (0°)' : angle < 0 ? 'Дарк (Лево)' : 'Дарк (Право)'})
                                </span>
                            </div>

                            <div className={styles.sliderContainer}>
                                <span className={styles.scaleMarker}>-90°<br /><small>Дарк</small></span>
                                <div className={styles.sliderWrapper}>
                                    <input
                                        type="range"
                                        min="-90"
                                        max="90"
                                        step="5"
                                        value={angle}
                                        onChange={handleAngleChange}
                                        className={styles.angleRange}
                                    />
                                    <div className={styles.scaleTicks}>
                                        <span>-90</span>
                                        <span>-45</span>
                                        <span className={styles.tickZero}>0 (Лайт)</span>
                                        <span>+45</span>
                                        <span>+90</span>
                                    </div>
                                </div>
                                <span className={styles.scaleMarker}>+90°<br /><small>Дарк</small></span>
                            </div>
                        </div>
                    </div>
                )}
            </div>


            {/* Модальное окно для настройки порога освещенности */}
            {isModalOpen && (
                <div className={styles.modalOverlay} onClick={() => setIsModalOpen(false)}>
                    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h3>Уставка порога освещенности</h3>
                            <button className={styles.closeBtn} onClick={() => setIsModalOpen(false)}>✕</button>
                        </div>
                        {/* Краткое описание под зеленым маркером */}
                        <p className={styles.modalDescription}>
                            Установите целевой порог освещенности. Как только датчик на улице зафиксирует значение выше или ниже заданного уровня, автоматика плавно отрегулирует положение штор и угол ламелей.
                        </p>

                        {/* Вставляем ваш готовый компонент уставки и задаем ему значения для люксов */}
                        <div className={styles.modalBody}>
                            <ClimateWidget
                                title=""
                                current={currentLightIndoor}    // Передаст текущее значение (650)
                                initialTarget={lightThreshold}    // Передаст уставку порога (400)
                                min={0}                           // Минимум шкалы для люксов
                                max={2000}                        // Максимум шкалы для люксов
                                unit="лк"                         // Единица измерения
                                colorTheme="blue"                 // Тема оформления
                                onTargetChange={(newVal) => {
                                    // Здесь можно сохранить измененный порог
                                }}
                            />
                        </div>

                        <div className={styles.modalFooter}>
                            <button className={styles.saveBtn} onClick={() => setIsModalOpen(false)}>
                                Готово
                            </button>
                        </div>
                    </div>
                </div>
            )}


        </div>
    );
}



/* 

 <div className={styles.angleSection}>

<span className={styles.divider}>|</span>
<div>
                                    <span className={styles.blockBigValue}><small>парог: </small><strong>{lightThreshold} <small>лк</small></strong></span>

                                </div>










РЕЖИМ РУЧНОЙ: Элементы управления с той же вертикальной структурой 
                    <div className={styles.manualControls}>

                        {/* 1. Кнопки фиксированных позиций 
                        <div className={styles.positionSection}>
                            <span className={styles.sectionLabel}>Положение штор:</span>
                            <div className={styles.positionButtons}>
                                <button
                                    className={`${styles.posBtn} ${position === 'closed' ? styles.activePos : ''}`}
                                    onClick={() => handlePosSelect('closed')}
                                >
                                    Закрыто
                                </button>
                                <button
                                    className={`${styles.posBtn} ${position === 'door' ? styles.activePos : ''}`}
                                    onClick={() => handlePosSelect('door')}
                                >
                                    Только дверь
                                </button>
                                <button
                                    className={`${styles.posBtn} ${position === 'full' ? styles.activePos : ''}`}
                                    onClick={() => handlePosSelect('full')}
                                >
                                    Полностью
                                </button>
                            </div>
                        </div>

                        {/* 2. Поворот ламелей с помощью регулятора (-90 до 90) 
                        <div className={styles.angleSection}>
                            <div className={styles.angleHeader}>
                                <span className={styles.sectionLabel}>Поворот ламелей:</span>
                                <span className={styles.angleValueBadge}>
                                    {angle}° ({angle === 0 ? 'Лайт (0°)' : angle < 0 ? 'Дарк (Лево)' : 'Дарк (Право)'})
                                </span>
                            </div>

                            <div className={styles.sliderContainer}>
                                <span className={styles.scaleMarker}>-90°<br /><small>Дарк</small></span>
                                <div className={styles.sliderWrapper}>
                                    <input
                                        type="range"
                                        min="-90"
                                        max="90"
                                        step="5"
                                        value={angle}
                                        onChange={handleAngleChange}
                                        className={styles.angleRange}
                                    />
                                    <div className={styles.scaleTicks}>
                                        <span>-90</span>
                                        <span>-45</span>
                                        <span className={styles.tickZero}>0 (Лайт)</span>
                                        <span>+45</span>
                                        <span>+90</span>
                                    </div>
                                </div>
                                <span className={styles.scaleMarker}>+90°<br /><small>Дарк</small></span>
                            </div>
                        </div>

                    </div>


{/* Блок 2: Порог срабатывания (уставка) 
                        <div className={styles.infoBlockCard}>
                            <span className={styles.blockTitle}>Порог срабатывания</span>
                            <span className={styles.blockBigValue}>{lightThreshold} <small>лк</small></span>
                        </div>*/