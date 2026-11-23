'use client';

import React, { useState, useEffect, useMemo } from 'react';
import s from './s.module.css';

const WEATHER_CODES = {
    0: { label: 'Ясно', icon: '☀️' },
    1: { label: 'Преимущественно ясно', icon: '🌤️' },
    2: { label: 'Переменная облачность', icon: '⛅' },
    3: { label: 'Пасмурно', icon: '☁️' },
    45: { label: 'Туман', icon: '🌫️' },
    48: { label: 'Изморозь', icon: '🌫️' },
    51: { label: 'Слабая морось', icon: '🌦️' },
    53: { label: 'Морось', icon: '🌦️' },
    55: { label: 'Сильная морось', icon: '🌧️' },
    61: { label: 'Небольшой дождь', icon: '🌧️' },
    63: { label: 'Умеренный дождь', icon: '🌧️' },
    65: { label: 'Сильный дождь', icon: '🌧️' },
    71: { label: 'Небольшой снег', icon: '🌨️' },
    73: { label: 'Снег', icon: '🌨️' },
    75: { label: 'Сильный снег', icon: '❄️' },
    80: { label: 'Ливень', icon: '🌧️' },
    81: { label: 'Сильный ливень', icon: '🌧️' },
    82: { label: 'Грозовой ливень', icon: '⛈️' },
    95: { label: 'Гроза', icon: '🌩️' },
};

const WEEKDAYS_FULL = [
    'воскресенье',
    'понедельник',
    'вторник',
    'среда',
    'четверг',
    'пятница',
    'суббота',
];

const MONTHS_GENITIVE = [
    'января',
    'февраля',
    'марта',
    'апреля',
    'мая',
    'июня',
    'июля',
    'августа',
    'сентября',
    'октября',
    'ноября',
    'декабря',
];

function formatSignedTemp(val) {
    if (typeof val !== 'number' || Number.isNaN(val)) return '—';
    const r = Math.round(val);
    return r > 0 ? `+${r}°` : `${r}°`;
}

function hpaToMmHg(hpa) {
    if (typeof hpa !== 'number' || Number.isNaN(hpa)) return '—';
    return Math.round(hpa * 0.750062);
}

function kmhToMs(kmh) {
    if (typeof kmh !== 'number' || Number.isNaN(kmh)) return '—';
    return (kmh / 3.6).toFixed(1);
}

function getPartOfDay(hour) {
    if (hour >= 0 && hour < 6) return 'ночь';
    if (hour >= 6 && hour < 12) return 'утро';
    if (hour >= 12 && hour < 18) return 'день';
    return 'вечер';
}

function formatShortTime(isoStr) {
    if (!isoStr) return '—';
    const d = new Date(isoStr);
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

export function WeatherDeskMeteo({
    latitude = 46.975,
    longitude = 31.9946,
    city = 'Николаеве',
    regionSubtitle = 'Областной центр Николаевской области',
}) {
    const [data, setData] = useState(null);
    const [selectedDayIdx, setSelectedDayIdx] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const controller = new AbortController();

        async function fetchWeather() {
            try {
                setLoading(true);
                setError(null);

                const url =
                    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}` +
                    `&hourly=temperature_2m,apparent_temperature,pressure_msl,relative_humidity_2m,wind_speed_10m,wind_direction_10m,precipitation_probability,weather_code` +
                    `&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_probability_max` +
                    `&forecast_days=7&timezone=auto`;

                const res = await fetch(url, { signal: controller.signal, cache: 'no-store' });
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const json = await res.json();
                setData(json);
            } catch (err) {
                if (err.name === 'AbortError') return;
                setError(err.message || 'Ошибка загрузки');
            } finally {
                if (!controller.signal.aborted) setLoading(false);
            }
        }

        fetchWeather();
        return () => controller.abort();
    }, [latitude, longitude]);

    const days = useMemo(() => {
        if (!data?.daily?.time) return [];
        return data.daily.time.map((dateStr, idx) => {
            const dt = new Date(`${dateStr}T12:00:00`);
            const code = data.daily.weather_code?.[idx];
            const info = WEATHER_CODES[code] || { label: 'Переменно', icon: '⛅' };
            return {
                idx,
                dateStr,
                weekday: WEEKDAYS_FULL[dt.getDay()],
                weekdayCap:
                    WEEKDAYS_FULL[dt.getDay()].charAt(0).toUpperCase() +
                    WEEKDAYS_FULL[dt.getDay()].slice(1),
                dayNum: dt.getDate(),
                monthName: MONTHS_GENITIVE[dt.getMonth()],
                icon: info.icon,
                label: info.label,
                minTemp: data.daily.temperature_2m_min?.[idx],
                maxTemp: data.daily.temperature_2m_max?.[idx],
                sunrise: data.daily.sunrise?.[idx],
                sunset: data.daily.sunset?.[idx],
                maxPrecip: data.daily.precipitation_probability_max?.[idx] ?? 0,
            };
        });
    }, [data]);

    const activeDay = days[selectedDayIdx] || days[0];

    // 8 интервалов по 3 часа (00:00, 03:00, 06:00, 09:00, 12:00, 15:00, 18:00, 21:00) для выбранного дня
    const daySlots = useMemo(() => {
        if (!activeDay || !data?.hourly?.time) return [];
        const prefix = `${activeDay.dateStr}T`;
        const times = data.hourly.time;
        const slots = [];

        for (let i = 0; i < times.length; i++) {
            if (!times[i].startsWith(prefix)) continue;
            const dt = new Date(times[i]);
            const hour = dt.getHours();
            if (hour % 3 !== 0) continue;

            const code = data.hourly.weather_code?.[i];
            const info = WEATHER_CODES[code] || { label: 'Облачно', icon: '⛅' };

            slots.push({
                time: times[i],
                hour,
                part: getPartOfDay(hour),
                timeLabel: `${hour}:00`,
                icon: info.icon,
                label: info.label,
                temp: data.hourly.temperature_2m?.[i],
                feelsLike: data.hourly.apparent_temperature?.[i],
                pressureMmHg: hpaToMmHg(data.hourly.pressure_msl?.[i]),
                humidity: Math.round(data.hourly.relative_humidity_2m?.[i] ?? 0),
                windMs: kmhToMs(data.hourly.wind_speed_10m?.[i]),
                windDir: data.hourly.wind_direction_10m?.[i] ?? 0,
                precip: Math.round(data.hourly.precipitation_probability?.[i] ?? 0),
            });
        }

        return slots;
    }, [activeDay, data]);

    // Группировка интервалов по частям суток для верхнего заголовка таблицы
    const partGroups = useMemo(() => {
        const map = new Map();
        for (const sItem of daySlots) {
            map.set(sItem.part, (map.get(sItem.part) || 0) + 1);
        }
        return Array.from(map.entries());
    }, [daySlots]);

    if (loading) {
        return (
            <section className={s.card}>
                <div className={s.status}>Загрузка прогноза для {city}…</div>
            </section>
        );
    }

    if (error || !activeDay) {
        return (
            <section className={s.card}>
                <div className={s.status}>Не удалось загрузить погоду ({error || 'ошибка'})</div>
            </section>
        );
    }

    const daySummaryText =
        activeDay.maxPrecip >= 50
            ? `В течение дня возможны осадки (вероятность до ${activeDay.maxPrecip}%), температура от ${formatSignedTemp(activeDay.minTemp)} до ${formatSignedTemp(activeDay.maxTemp)}.`
            : `Ожидается погода «${activeDay.label.toLowerCase()}», температура в пределах ${formatSignedTemp(activeDay.minTemp)}…${formatSignedTemp(activeDay.maxTemp)}, вероятность осадков до ${activeDay.maxPrecip}%.`;

    return (
        <section className={s.card} aria-label={`Погода в ${city}`}>
            {/* Заголовок блока */}
            <div className={s.topHeader}>
                <div>
                    <h2 className={s.title}>
                        <span>Погода</span> в {city}
                    </h2>
                    <div className={s.subtitle}>{regionSubtitle}</div>
                </div>
                <span className={s.periodBadge}>Неделя</span>
            </div>

            {/* Лента дней сверху */}
            <div className={s.daysRow} role="tablist" aria-label="Дни недели">
                {days.map((d) => {
                    const isSelected = d.idx === activeDay.idx;
                    const isWeekend = d.dateStr && [0, 6].includes(new Date(`${d.dateStr}T12:00:00`).getDay());
                    return (
                        <button
                            key={d.dateStr}
                            type="button"
                            role="tab"
                            aria-selected={isSelected}
                            onClick={() => setSelectedDayIdx(d.idx)}
                            className={`${s.dayCard} ${isSelected ? s.dayCardActive : ''}`}
                        >
                            <div className={`${s.dayWeekday} ${isWeekend ? s.weekendText : ''}`}>
                                {d.weekdayCap}
                            </div>
                            <div className={`${s.dayNumber} ${isWeekend ? s.weekendText : ''}`}>
                                {d.dayNum}
                            </div>
                            <div className={s.dayMonth}>{d.monthName}</div>
                            <div className={s.dayIcon}>{d.icon}</div>
                            <div className={s.minMaxRow}>
                                <span>
                                    <small>мин.</small>
                                    <strong>{formatSignedTemp(d.minTemp)}</strong>
                                </span>
                                <span>
                                    <small>макс.</small>
                                    <strong>{formatSignedTemp(d.maxTemp)}</strong>
                                </span>
                            </div>
                        </button>
                    );
                })}
            </div>

            {/* Детали выбранного дня */}
            <div className={s.detailGrid}>
                {/* Левая колонка: дата и восход/закат */}
                <div className={s.daySideColumn}>
                    <div className={s.selectedDateBox}>
                        <div className={s.selectedWeekday}>{activeDay.weekday}</div>
                        <div className={s.selectedBigNum}>{activeDay.dayNum}</div>
                        <div className={s.selectedMonth}>{activeDay.monthName}</div>
                    </div>

                    <div className={s.astroBox}>
                        <div>
                            <span>Восход</span>
                            <strong>{formatShortTime(activeDay.sunrise)}</strong>
                        </div>
                        <div>
                            <span>Закат</span>
                            <strong>{formatShortTime(activeDay.sunset)}</strong>
                        </div>
                    </div>
                </div>

                {/* Правая колонка: таблица с одинаковыми строками по 3-часовым интервалам */}
                <div className={s.tableScroll}>
                    <table className={s.forecastTable}>
                        <thead>
                            <tr className={s.partHeaderRow}>
                                <th className={s.stickyCol} />
                                {partGroups.map(([partName, span]) => (
                                    <th key={partName} colSpan={span} className={s.partCell}>
                                        {partName}
                                    </th>
                                ))}
                            </tr>
                            <tr className={s.timeHeaderRow}>
                                <th className={s.stickyCol} />
                                {daySlots.map((slot) => (
                                    <th key={slot.time} className={s.timeCell}>
                                        {slot.timeLabel}
                                    </th>
                                ))}
                            </tr>
                        </thead>

                        <tbody>
                            <tr>
                                <th className={`${s.stickyCol} ${s.rowLabel}`}>Состояние</th>
                                {daySlots.map((slot) => (
                                    <td key={slot.time} className={s.iconCell} title={slot.label}>
                                        {slot.icon}
                                    </td>
                                ))}
                            </tr>

                            <tr>
                                <th className={`${s.stickyCol} ${s.rowLabel}`}>Температура, °C</th>
                                {daySlots.map((slot) => (
                                    <td key={slot.time} className={s.tempMainCell}>
                                        {formatSignedTemp(slot.temp)}
                                    </td>
                                ))}
                            </tr>

                            <tr>
                                <th className={`${s.stickyCol} ${s.rowLabel}`}>чувствуется как</th>
                                {daySlots.map((slot) => (
                                    <td key={slot.time} className={s.mutedCell}>
                                        {formatSignedTemp(slot.feelsLike)}
                                    </td>
                                ))}
                            </tr>

                            <tr className={s.bandRow}>
                                <th className={`${s.stickyCol} ${s.rowLabel}`}>Давление, мм</th>
                                {daySlots.map((slot) => (
                                    <td key={slot.time} className={s.dataCell}>
                                        {slot.pressureMmHg}
                                    </td>
                                ))}
                            </tr>

                            <tr>
                                <th className={`${s.stickyCol} ${s.rowLabel}`}>Влажность, %</th>
                                {daySlots.map((slot) => (
                                    <td key={slot.time} className={s.dataCell}>
                                        {slot.humidity}
                                    </td>
                                ))}
                            </tr>

                            <tr className={s.bandRow}>
                                <th className={`${s.stickyCol} ${s.rowLabel}`}>Ветер, м/с</th>
                                {daySlots.map((slot) => (
                                    <td key={slot.time} className={s.windCell}>
                                        <span
                                            className={s.arrow}
                                            style={{ transform: `rotate(${slot.windDir}deg)` }}
                                            title={`Направление: ${slot.windDir}°`}
                                        >
                                            ↑
                                        </span>
                                        <span>{slot.windMs}</span>
                                    </td>
                                ))}
                            </tr>

                            <tr>
                                <th className={`${s.stickyCol} ${s.rowLabel}`}>Вероятность осадков, %</th>
                                {daySlots.map((slot) => (
                                    <td key={slot.time} className={s.dataCell}>
                                        {slot.precip}
                                    </td>
                                ))}
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Краткая сводка дня внизу */}
            <p className={s.dayNote}>{daySummaryText}</p>
        </section>
    );
}