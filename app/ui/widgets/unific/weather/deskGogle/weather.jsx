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
    63: { label: 'Дождь', icon: '🌧️' },
    65: { label: 'Сильный дождь', icon: '🌧️' },
    71: { label: 'Небольшой снег', icon: '🌨️' },
    73: { label: 'Снег', icon: '🌨️' },
    75: { label: 'Сильный снег', icon: '❄️' },
    80: { label: 'Ливень', icon: '🌧️' },
    95: { label: 'Гроза', icon: '🌩️' },
};

const WEEKDAYS_SHORT = ['вс', 'пн', 'вт', 'ср', 'чт', 'пт', 'сб'];

function hpaToMmHg(hpa) {
    if (typeof hpa !== 'number' || Number.isNaN(hpa)) return null;
    return Math.round(hpa * 0.750062);
}

function buildSmoothSvgPaths(values, width = 600, height = 110, padTop = 24, padBottom = 14) {
    if (!values || values.length === 0) {
        return { linePath: '', areaPath: '', points: [] };
    }

    const minVal = Math.min(...values);
    const maxVal = Math.max(...values);
    const span = maxVal - minVal || 1;
    const usableH = height - padTop - padBottom;

    const points = values.map((val, idx) => {
        const x = values.length === 1 ? width / 2 : (idx / (values.length - 1)) * width;
        const norm = (val - minVal) / span;
        const y = padTop + (1 - norm) * usableH;
        return { x, y, val };
    });

    if (points.length === 1) {
        const p = points[0];
        return {
            linePath: `M ${p.x} ${p.y}`,
            areaPath: `M ${p.x} ${height} L ${p.x} ${p.y} L ${p.x} ${height} Z`,
            points,
        };
    }

    let linePath = `M ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`;
    for (let i = 0; i < points.length - 1; i++) {
        const p0 = points[i];
        const p1 = points[i + 1];
        const cx = ((p0.x + p1.x) / 2).toFixed(1);
        linePath += ` C ${cx} ${p0.y.toFixed(1)}, ${cx} ${p1.y.toFixed(1)}, ${p1.x.toFixed(1)} ${p1.y.toFixed(1)}`;
    }

    const last = points[points.length - 1];
    const first = points[0];
    const areaPath = `${linePath} L ${last.x.toFixed(1)} ${height} L ${first.x.toFixed(1)} ${height} Z`;

    return { linePath, areaPath, points };
}

export function WeatherDeskGoogle({
    latitude = 46.975,
    longitude = 31.9946,
    city = 'Николаев',
    district = 'Заводской район',
}) {
    const [metric, setMetric] = useState('temp'); // 'temp' | 'precip' | 'wind' | 'pressure'
    const [selectedDayIdx, setSelectedDayIdx] = useState(0);
    const [data, setData] = useState(null);
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
                    `&current=temperature_2m,relative_humidity_2m,precipitation_probability,pressure_msl,surface_pressure,weather_code,wind_speed_10m,wind_direction_10m` +
                    `&hourly=temperature_2m,weather_code,precipitation_probability,wind_speed_10m,wind_direction_10m,pressure_msl` +
                    `&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max` +
                    `&forecast_days=8&timezone=auto`;

                const res = await fetch(url, { signal: controller.signal, cache: 'no-store' });
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const json = await res.json();
                setData(json);
            } catch (err) {
                if (err.name === 'AbortError') return;
                setError(err.message || 'Ошибка сети');
            } finally {
                if (!controller.signal.aborted) setLoading(false);
            }
        }

        fetchWeather();
        return () => controller.abort();
    }, [latitude, longitude]);

    const nowDate = useMemo(() => new Date(), []);

    // Берём 8 точек шагом в 3 часа начиная с текущего часа
    const chartSlots = useMemo(() => {
        if (!data?.hourly?.time) return [];
        const times = data.hourly.time;
        const temps = data.hourly.temperature_2m || [];
        const precips = data.hourly.precipitation_probability || [];
        const winds = data.hourly.wind_speed_10m || [];
        const windDirs = data.hourly.wind_direction_10m || [];
        const pressures = data.hourly.pressure_msl || [];

        const nowHourKey = `${nowDate.getFullYear()}-${String(nowDate.getMonth() + 1).padStart(2, '0')}-${String(
            nowDate.getDate()
        ).padStart(2, '0')}T${String(nowDate.getHours()).padStart(2, '0')}:00`;

        let startIdx = times.findIndex((t) => t >= nowHourKey);
        if (startIdx < 0) startIdx = 0;

        const slots = [];
        for (let i = startIdx; i < times.length && slots.length < 8; i += 3) {
            const dt = new Date(times[i]);
            const pMmHg = hpaToMmHg(pressures[i]);
            slots.push({
                time: times[i],
                label: `${String(dt.getHours()).padStart(2, '0')}:00`,
                temp: Math.round(temps[i] ?? 0),
                precip: Math.round(precips[i] ?? 0),
                wind: Math.round(winds[i] ?? 0),
                windDir: windDirs[i] ?? 0,
                pressureMmHg: pMmHg ?? 0,
            });
        }
        return slots;
    }, [data, nowDate]);

    if (loading) {
        return <div className={s.card}><div className={s.status}>Загрузка погоды…</div></div>;
    }

    if (error || !data?.current) {
        return (
            <div className={s.card}>
                <div className={s.status}>Не удалось загрузить погоду ({error || 'ошибка'})</div>
            </div>
        );
    }

    const current = data.current;
    const currentInfo = WEATHER_CODES[current.weather_code] || { label: 'Облачно', icon: '⛅' };
    const currentPressureMmHg = hpaToMmHg(current.pressure_msl ?? current.surface_pressure);
    const currentPrecip =
        current.precipitation_probability ?? chartSlots[0]?.precip ?? 0;

    const dailyTimes = data.daily?.time || [];
    const dailyCodes = data.daily?.weather_code || [];
    const dailyMax = data.daily?.temperature_2m_max || [];
    const dailyMin = data.daily?.temperature_2m_min || [];

    const seriesValues = chartSlots.map((slot) => {
        if (metric === 'precip') return slot.precip;
        if (metric === 'wind') return slot.wind;
        if (metric === 'pressure') return slot.pressureMmHg;
        return slot.temp;
    });

    const formatPointValue = (val) => {
        if (metric === 'precip') return `${val}%`;
        if (metric === 'wind') return `${val} км/ч`;
        if (metric === 'pressure') return `${val} мм`;
        return `${val}`;
    };

    const { linePath, areaPath, points } = buildSmoothSvgPaths(seriesValues, 640, 108, 22, 12);

    const weekdayStr = WEEKDAYS_SHORT[nowDate.getDay()];
    const timeStr = `${String(nowDate.getHours()).padStart(2, '0')}:${String(nowDate.getMinutes()).padStart(2, '0')}`;

    return (
        <section className={s.card} aria-label="Погода">
            {/* Верхняя строка локации */}
            <div className={s.locationBar}>
                <span className={s.locationPin}>⌂</span>
                <strong className={s.locationText}>
                    {district ? `${district}, ${city}` : city}
                </strong>
            </div>

            {/* Главная сводка */}
            <div className={s.topRow}>
                <div className={s.currentLeft}>
                    <span className={s.bigIcon}>{currentInfo.icon}</span>
                    <div className={s.bigTempWrap}>
                        <span className={s.bigTemp}>{Math.round(current.temperature_2m)}</span>
                        <span className={s.tempUnit}>°C</span>
                    </div>
                    <div className={s.summaryMeta}>
                        <div>Вероятность осадков: {Math.round(currentPrecip)}%</div>
                        <div>Влажность: {Math.round(current.relative_humidity_2m)}%</div>
                        <div>Ветер: {Math.round(current.wind_speed_10m)} км/ч</div>
                        <div className={s.pressureHighlight}>
                            Давление: {currentPressureMmHg ?? '—'} мм рт.ст.
                        </div>
                    </div>
                </div>

                <div className={s.currentRight}>
                    <div className={s.widgetHeading}>Погода</div>
                    <div className={s.dateLine}>
                        {weekdayStr} {timeStr}
                    </div>
                    <div className={s.conditionText}>{currentInfo.label}</div>
                </div>
            </div>

            {/* Вкладки метрик */}
            <div className={s.tabsRow} role="tablist">
                <button
                    type="button"
                    role="tab"
                    aria-selected={metric === 'temp'}
                    className={`${s.tabBtn} ${metric === 'temp' ? s.tabActive : ''}`}
                    onClick={() => setMetric('temp')}
                >
                    Температура
                </button>
                <button
                    type="button"
                    role="tab"
                    aria-selected={metric === 'precip'}
                    className={`${s.tabBtn} ${metric === 'precip' ? s.tabActive : ''}`}
                    onClick={() => setMetric('precip')}
                >
                    Вероятность осадков
                </button>
                <button
                    type="button"
                    role="tab"
                    aria-selected={metric === 'wind'}
                    className={`${s.tabBtn} ${metric === 'wind' ? s.tabActive : ''}`}
                    onClick={() => setMetric('wind')}
                >
                    Ветер
                </button>
                <button
                    type="button"
                    role="tab"
                    aria-selected={metric === 'pressure'}
                    className={`${s.tabBtn} ${metric === 'pressure' ? s.tabActive : ''}`}
                    onClick={() => setMetric('pressure')}
                >
                    Давление
                </button>
            </div>

            {/* Область графика / значений по часам */}
            <div className={s.chartZone}>
                {metric === 'wind' ? (
                    <div className={s.windColumns}>
                        {chartSlots.map((slot) => (
                            <div key={slot.time} className={s.windCol}>
                                <span className={s.windSpeedLabel}>{slot.wind} км/ч</span>
                                <span
                                    className={s.windArrow}
                                    style={{ transform: `rotate(${slot.windDir}deg)` }}
                                    title={`Направление: ${slot.windDir}°`}
                                >
                                    ↑
                                </span>
                                <span className={s.slotHour}>{slot.label}</span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <>
                        <div className={s.chartWrap}>
                            <svg
                                viewBox="0 0 640 108"
                                className={`${s.chartSvg} ${metric === 'pressure' ? s.svgPressure : metric === 'precip' ? s.svgPrecip : s.svgTemp}`}
                                preserveAspectRatio="none"
                            >
                                <defs>
                                    <linearGradient id="weatherAreaGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="currentColor" stopOpacity="0.28" />
                                        <stop offset="100%" stopColor="currentColor" stopOpacity="0.02" />
                                    </linearGradient>
                                </defs>
                                {areaPath && <path d={areaPath} fill="url(#weatherAreaGrad)" />}
                                {linePath && (
                                    <path
                                        d={linePath}
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2.5"
                                    />
                                )}
                            </svg>

                            <div className={s.pointLabels}>
                                {points.map((pt, idx) => (
                                    <div
                                        key={chartSlots[idx]?.time || idx}
                                        className={s.pointTag}
                                        style={{
                                            left: `${(pt.x / 640) * 100}%`,
                                            top: `${Math.max(4, ((pt.y - 16) / 108) * 100)}%`,
                                        }}
                                    >
                                        {formatPointValue(pt.val)}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className={s.hoursRow}>
                            {chartSlots.map((slot) => (
                                <span key={slot.time} className={s.slotHour}>
                                    {slot.label}
                                </span>
                            ))}
                        </div>
                    </>
                )}
            </div>

            {/* Нижняя полоса по дням недели */}
            <div className={s.daysStrip}>
                {dailyTimes.slice(0, 8).map((dateStr, idx) => {
                    const d = new Date(`${dateStr}T12:00:00`);
                    const dayShort = WEEKDAYS_SHORT[d.getDay()];
                    const info = WEATHER_CODES[dailyCodes[idx]] || { icon: '⛅', label: '' };
                    const active = selectedDayIdx === idx;

                    return (
                        <button
                            key={dateStr}
                            type="button"
                            onClick={() => setSelectedDayIdx(idx)}
                            className={`${s.dayTile} ${active ? s.dayTileActive : ''}`}
                        >
                            <span className={s.dayName}>{dayShort}</span>
                            <span className={s.dayIcon}>{info.icon}</span>
                            <span className={s.dayTemps}>
                                <strong>{Math.round(dailyMax[idx])}°</strong>{' '}
                                <span>{Math.round(dailyMin[idx])}°</span>
                            </span>
                        </button>
                    );
                })}
            </div>
        </section>
    );
}