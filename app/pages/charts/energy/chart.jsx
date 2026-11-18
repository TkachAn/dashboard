'use client';

import React, { useMemo } from 'react';
import { Chart } from 'react-google-charts';
import styles from './s.module.css';

// Настройки каскадного сдвига, чтобы линии не сливались:
const Y_OFFSET_STEP = 15; // Сдвиг вверх на 15 Вт (или В) за каждый день
const TIME_OFFSET_SEC = 30; // Сдвиг вправо на 30 секунд за каждый день

function parseTimeToBaseDate(timeStr, offsetSeconds = 0) {
    const [hours, minutes, seconds = 0] = timeStr.split(':').map(Number);
    return new Date(1970, 0, 1, hours, minutes, seconds + offsetSeconds);
}

export default function EnergyCompareChart({ lineTitle, daysData }) {
    const chartData = useMemo(() => {
        if (!daysData || daysData.length === 0) return [];

        // 1. Заголовок таблицы
        const header = [
            { type: 'datetime', label: 'Время суток' },
            ...daysData.map((day) => ({ type: 'number', label: day.label })),
        ];

        // 2. Собираем все точки со всех дней с учетом их индивидуального сдвига по времени
        const allTimestamps = new Set();

        const shiftedDays = daysData.map((day, dayIndex) => {
            const timeOffset = dayIndex * TIME_OFFSET_SEC;
            const valueOffset = dayIndex * Y_OFFSET_STEP;
            const pointMap = new Map();

            day.points.forEach((p) => {
                const shiftedDate = parseTimeToBaseDate(p.time, timeOffset);
                const ts = shiftedDate.getTime();
                allTimestamps.add(ts);

                // Сохраняем сдвинутую координату (v) для графика и реальную цифру (f) для подсказки
                pointMap.set(ts, {
                    v: p.value + valueOffset,
                    f: `${p.value} (реальное время: ${p.time})`,
                });
            });

            return pointMap;
        });

        // 3. Сортируем все отметки времени по порядку
        const sortedTimestamps = Array.from(allTimestamps).sort((a, b) => a - b);

        // 4. Формируем итоговые строки для Google Charts
        const rows = sortedTimestamps.map((ts) => {
            const dateObj = new Date(ts);
            const values = shiftedDays.map((map) =>
                map.has(ts) ? map.get(ts) : null
            );
            return [dateObj, ...values];
        });

        return [header, ...rows];
    }, [daysData]);

    const seriesStyles = useMemo(() => {
        const seriesConfig = {};
        daysData.forEach((day, index) => {
            seriesConfig[index] = day.isCurrent
                ? { lineWidth: 3, pointSize: 0 }
                : { lineWidth: 1.5, lineDashStyle: 1, pointSize: 0 };
        });
        return seriesConfig;
    }, [daysData]);

    const options = {
        title: lineTitle,
        titleTextStyle: { fontSize: 16, bold: true, color: '#1f2937' },
        interpolateNulls: true,
        curveType: 'none',
        legend: { position: 'top', alignment: 'end' },
        chartArea: { left: 65, right: 25, top: 55, bottom: 45 },
        hAxis: {
            format: 'HH:mm',
            gridlines: { color: '#e5e7eb', count: 12 },
            minorGridlines: { color: '#f3f4f6' },
            viewWindow: {
                min: new Date(1970, 0, 1, 0, 0, 0),
                max: new Date(1970, 0, 1, 23, 59, 59),
            },
        },
        vAxis: {
            title: 'Нагрузка (Вт)',
            minValue: 0,
            gridlines: { color: '#e5e7eb' },
        },
        series: seriesStyles,
        explorer: {
            actions: ['dragToZoom', 'rightClickToReset'],
            axis: 'horizontal',
            keepInBounds: true,
            maxZoomIn: 0.01,
        },
        focusTarget: 'datum', // Подсказка срабатывает при наведении на конкретную линию
    };

    if (chartData.length <= 1) {
        return <div className={styles.emptyState}>Нет данных для отображения</div>;
    }

    return (
        <div className={styles.card}>
            <Chart
                chartType="LineChart"
                width="100%"
                height="400px"
                data={chartData}
                options={options}
            />
        </div>
    );
}