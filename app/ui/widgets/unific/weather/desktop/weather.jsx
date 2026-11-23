'use client';

import React, { useState, useEffect } from 'react';
import s from './s.module.css';

const WEATHER_CODES = {
    0: { label: 'Ясно', icon: '☀️' },
    1: { label: 'Преимущественно ясно', icon: '🌤️' },
    2: { label: 'Переменная облачность', icon: '⛅' },
    3: { label: 'Пасмурно', icon: '☁️' },
    45: { label: 'Туман', icon: '🌫️' },
    48: { label: 'Изморозь / туман', icon: '🌫️' },
    51: { label: 'Слабая морось', icon: '🌦️' },
    53: { label: 'Морось', icon: '🌦️' },
    55: { label: 'Сильная морось', icon: '🌧️' },
    56: { label: 'Ледяная морось', icon: '🌧️' },
    57: { label: 'Сильная ледяная морось', icon: '🌧️' },
    61: { label: 'Небольшой дождь', icon: '🌧️' },
    63: { label: 'Умеренный дождь', icon: '🌧️' },
    65: { label: 'Сильный дождь', icon: '🌧️' },
    66: { label: 'Ледяной дождь', icon: '🌧️' },
    67: { label: 'Сильный ледяной дождь', icon: '🌧️' },
    71: { label: 'Небольшой снег', icon: '🌨️' },
    73: { label: 'Снег', icon: '🌨️' },
    75: { label: 'Сильный снегопад', icon: '❄️' },
    77: { label: 'Снежные зёрна', icon: '🌨️' },
    80: { label: 'Ливень', icon: '🌧️' },
    81: { label: 'Сильный ливень', icon: '🌧️' },
    82: { label: 'Очень сильный ливень', icon: '⛈️' },
    85: { label: 'Снеговой заряд', icon: '🌨️' },
    86: { label: 'Сильный снеговой заряд', icon: '❄️' },
    95: { label: 'Гроза', icon: '🌩️' },
    96: { label: 'Гроза с градом', icon: '⛈️' },
    99: { label: 'Сильная гроза с градом', icon: '⛈️' },
};

const WEEKDAYS = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];

function hpaToMmHg(hpa) {
    if (typeof hpa !== 'number' || Number.isNaN(hpa)) return null;
    return Math.round(hpa * 0.750062);
}

function pressureStatus(mmHg) {
    if (mmHg == null) return '';
    if (mmHg < 748) return 'Пониженное';
    if (mmHg > 765) return 'Повышенное';
    return 'В норме';
}

export function WeatherDesk({
    latitude = 46.975,
    longitude = 31.9946,
    city = 'Николаев',
}) {
    const [tab, setTab] = useState('hours'); // 'hours' | 'tomorrow' | 'week'
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
                    `&current=temperature_2m,apparent_temperature,relative_humidity_2m,pressure_msl,surface_pressure,weather_code,wind_speed_10m,wind_direction_10m` +
                    `&hourly=temperature_2m,weather_code,pressure_msl,precipitation_probability` +
                    `&forecast_hours=8` +
                    `&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,wind_speed_10m_max,pressure_msl_max,pressure_msl_min` +
                    `&timezone=auto`;

                const res = await fetch(url, {
                    signal: controller.signal,
                    cache: 'no-store',
                });

                if (!res.ok) {
                    throw new Error(`HTTP ${res.status}`);
                }

                const json = await res.json();
                setData(json);
            } catch (err) {
                if (err.name === 'AbortError') return;
                setError(err.message || 'Ошибка сети');
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        }

        fetchWeather();
        return () => controller.abort();
    }, [latitude, longitude]);

    if (loading) {
        return (
            <div className={s.panelCard}>
                <div className={s.statusBox}>Загрузка погоды для {city}…</div>
            </div>
        );
    }

    if (error || !data?.current) {
        return (
            <div className={s.panelCard}>
                <div className={s.statusBox}>
                    Не удалось получить данные о погоде ({error || 'ошибка'})
                </div>
            </div>
        );
    }

    const current = data.current;
    const currentInfo = WEATHER_CODES[current.weather_code] || {
        label: 'Переменная облачность',
        icon: '🌡️',
    };

    const pressureHpa = current.pressure_msl ?? current.surface_pressure;
    const pressureMmHg = hpaToMmHg(pressureHpa);

    const hourlyTimes = data.hourly?.time || [];
    const hourlyTemps = data.hourly?.temperature_2m || [];
    const hourlyCodes = data.hourly?.weather_code || [];
    const hourlyPrecip = data.hourly?.precipitation_probability || [];
    const hourlyPressure = data.hourly?.pressure_msl || [];

    const dailyTimes = data.daily?.time || [];
    const dailyCodes = data.daily?.weather_code || [];
    const dailyMax = data.daily?.temperature_2m_max || [];
    const dailyMin = data.daily?.temperature_2m_min || [];
    const dailyPrecip = data.daily?.precipitation_probability_max || [];
    const dailyWind = data.daily?.wind_speed_10m_max || [];
    const dailyPressMax = data.daily?.pressure_msl_max || [];
    const dailyPressMin = data.daily?.pressure_msl_min || [];

    const tomorrowIdx = dailyTimes.length > 1 ? 1 : 0;
    const tomorrowInfo = WEATHER_CODES[dailyCodes[tomorrowIdx]] || {
        label: '—',
        icon: '🌡️',
    };
    const tomorrowMmHgMin = hpaToMmHg(dailyPressMin[tomorrowIdx]);
    const tomorrowMmHgMax = hpaToMmHg(dailyPressMax[tomorrowIdx]);

    return (
        <section className={s.panelCard} aria-label={`Погода: ${city}`}>
            {/* Шапка */}
            <div className={s.header}>
                <div>
                    <h3 className={s.city}>{city}</h3>
                    <span className={s.subtitle}>
                        Ощущается как {Math.round(current.apparent_temperature)}°C
                    </span>
                </div>
                <span className={s.conditionBadge}>{currentInfo.label}</span>
            </div>

            {/* Текущая погода + ключевые параметры (включая давление) */}
            <div className={s.currentGrid}>
                <div className={s.heroTemp}>
                    <span className={s.heroIcon}>{currentInfo.icon}</span>
                    <span className={s.heroValue}>{Math.round(current.temperature_2m)}°C</span>
                </div>

                <div className={s.metricsList}>
                    <div className={`${s.metricItem} ${s.metricPressure}`}>
                        <span className={s.metricLabel}>Атм. давление</span>
                        <strong className={s.metricValue}>
                            {pressureMmHg != null ? `${pressureMmHg} мм рт.ст.` : '—'}
                        </strong>
                        <span className={s.metricSub}>
                            {pressureHpa != null ? `${Math.round(pressureHpa)} гПа` : ''}
                            {pressureMmHg != null ? ` · ${pressureStatus(pressureMmHg)}` : ''}
                        </span>
                    </div>

                    <div className={s.metricItem}>
                        <span className={s.metricLabel}>Влажность</span>
                        <strong className={s.metricValue}>{current.relative_humidity_2m}%</strong>
                    </div>

                    <div className={s.metricItem}>
                        <span className={s.metricLabel}>Ветер</span>
                        <strong className={s.metricValue}>
                            {Math.round(current.wind_speed_10m)} км/ч
                        </strong>
                    </div>
                </div>
            </div>

            {/* Переключатель горизонта прогноза */}
            <div className={s.tabs} role="tablist">
                <button
                    type="button"
                    role="tab"
                    aria-selected={tab === 'hours'}
                    className={`${s.tab} ${tab === 'hours' ? s.tabActive : ''}`}
                    onClick={() => setTab('hours')}
                >
                    Ближайшие 6 часов
                </button>
                <button
                    type="button"
                    role="tab"
                    aria-selected={tab === 'tomorrow'}
                    className={`${s.tab} ${tab === 'tomorrow' ? s.tabActive : ''}`}
                    onClick={() => setTab('tomorrow')}
                >
                    Завтра
                </button>
                <button
                    type="button"
                    role="tab"
                    aria-selected={tab === 'week'}
                    className={`${s.tab} ${tab === 'week' ? s.tabActive : ''}`}
                    onClick={() => setTab('week')}
                >
                    7 дней
                </button>
            </div>

            {/* Вкладка: Почасовой прогноз */}
            {tab === 'hours' && (
                <div className={s.hoursStrip}>
                    {hourlyTimes.map((timeStr, idx) => {
                        const hh = new Date(timeStr).getHours().toString().padStart(2, '0') + ':00';
                        const icon = WEATHER_CODES[hourlyCodes[idx]]?.icon || '🌡️';
                        const pMmHg = hpaToMmHg(hourlyPressure[idx]);
                        const precip = hourlyPrecip[idx] ?? 0;

                        return (
                            <div key={timeStr} className={s.hourCard}>
                                <span className={s.hourTime}>{hh}</span>
                                <span className={s.hourIcon}>{icon}</span>
                                <strong className={s.hourTemp}>{Math.round(hourlyTemps[idx])}°C</strong>
                                {pMmHg != null && (
                                    <span className={s.hourMeta}>{pMmHg} мм</span>
                                )}
                                {precip > 0 && (
                                    <span className={s.hourPrecip}>💧 {precip}%</span>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Вкладка: Подробно на завтра */}
            {tab === 'tomorrow' && (
                <div className={s.tomorrowPanel}>
                    <div className={s.tomorrowHeader}>
                        <div className={s.tomorrowCondition}>
                            <span className={s.tomorrowIcon}>{tomorrowInfo.icon}</span>
                            <div>
                                <div className={s.tomorrowTitle}>{tomorrowInfo.label}</div>
                                <div className={s.tomorrowDate}>{dailyTimes[tomorrowIdx]}</div>
                            </div>
                        </div>
                        <div className={s.tomorrowRange}>
                            <span className={s.minVal}>{Math.round(dailyMin[tomorrowIdx])}°C</span>
                            <span>/</span>
                            <strong>{Math.round(dailyMax[tomorrowIdx])}°C</strong>
                        </div>
                    </div>

                    <div className={s.tomorrowStats}>
                        <div className={s.statCell}>
                            <span>Давление</span>
                            <strong>
                                {tomorrowMmHgMin != null && tomorrowMmHgMax != null
                                    ? `${tomorrowMmHgMin}–${tomorrowMmHgMax} мм`
                                    : '—'}
                            </strong>
                        </div>
                        <div className={s.statCell}>
                            <span>Осадки до</span>
                            <strong>{dailyPrecip[tomorrowIdx] ?? 0}%</strong>
                        </div>
                        <div className={s.statCell}>
                            <span>Ветер до</span>
                            <strong>{Math.round(dailyWind[tomorrowIdx] ?? 0)} км/ч</strong>
                        </div>
                    </div>
                </div>
            )}

            {/* Вкладка: Прогноз на 7 дней */}
            {tab === 'week' && (
                <div className={s.weekList}>
                    {dailyTimes.slice(0, 7).map((dateStr, idx) => {
                        const d = new Date(`${dateStr}T12:00:00`);
                        const dayLabel =
                            idx === 0 ? 'Сегодня' : idx === 1 ? 'Завтра' : WEEKDAYS[d.getDay()];
                        const info = WEATHER_CODES[dailyCodes[idx]] || {
                            label: '—',
                            icon: '🌡️',
                        };
                        const dayMmHg = hpaToMmHg(
                            ((dailyPressMin[idx] ?? 0) + (dailyPressMax[idx] ?? 0)) / 2
                        );

                        return (
                            <div key={dateStr} className={s.weekRow}>
                                <span className={s.weekDay}>{dayLabel}</span>
                                <span className={s.weekCond}>
                                    <span>{info.icon}</span>
                                    <span className={s.weekCondText}>{info.label}</span>
                                </span>
                                <span className={s.weekPressure}>
                                    {dayMmHg ? `${dayMmHg} мм` : '—'}
                                </span>
                                <span className={s.weekTemp}>
                                    <span className={s.minVal}>{Math.round(dailyMin[idx])}°C</span> /{' '}
                                    <span>{Math.round(dailyMax[idx])}°C</span>
                                </span>
                            </div>
                        );
                    })}
                </div>
            )}
        </section>
    );
}