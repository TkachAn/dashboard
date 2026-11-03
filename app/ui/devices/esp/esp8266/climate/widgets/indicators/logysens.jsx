'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import styles from './s.module.css';

/**
 * Компактный виджет-индикатор климата для главного дашборда
 * Размеры ~300x200px. При клике переходит на страницу детальных датчиков.
 */
export function LoggyWidget({
    title = "SE Window ESP8266",
    temp = 25,
    humidity = 60,
    pressure = 1017,
    light = 435,
    navigateTo = "/climate"
}) {
    const router = useRouter();

    const handleClick = () => {
        if (navigateTo) {
            router.push(navigateTo);
        }
    };

    // Вычисляем угол поворота стрелки/дуги для заслонки (0% - 100%)
    //const damperPercent = Math.max(0, Math.min(100, damper));

    return (
        <div className={styles.card} onClick={handleClick} title="Нажмите, чтобы открыть подробные датчики">
            <div className={styles.header}>
                <span className={styles.title}>{title}</span>
                <span className={styles.badge}>Live</span>
            </div>

            <div className={styles.grid}>
                {/* Температура */}
                <div className={`${styles.item} ${styles.temp}`}>
                    <span className={styles.label}>Температура</span>
                    <div className={styles.valueRow}>
                        <span className={styles.value}>{temp}</span>
                        <span className={styles.unit}>°C</span>
                    </div>
                </div>

                {/* Влажность */}
                <div className={`${styles.item} ${styles.humidity}`}>
                    <span className={styles.label}>Влажность</span>
                    <div className={styles.valueRow}>
                        <span className={styles.value}>{humidity}</span>
                        <span className={styles.unit}>%</span>
                    </div>
                </div>

                {/* Давление */}
                <div className={`${styles.item} ${styles.pressure}`}>
                    <span className={styles.label}>Давление</span>
                    <div className={styles.valueRow}>
                        <span className={styles.value}>{pressure}</span>
                        <span className={styles.unit}>гПа</span>
                    </div>
                </div>

                {/* Заслонка (Мини-индикатор) */}
                <div className={`${styles.item} ${styles.light}`}>
                    <span className={styles.label}>Освещение</span>
                    <div className={styles.valueRow}>ё
                        <span className={styles.value}>{light}</span>
                        <span className={styles.unit}>ln</span>
                    </div>
                </div>
            </div>
        </div>
    );
}