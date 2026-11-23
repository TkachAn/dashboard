'use client';

import React, { useState, useEffect } from 'react';
import s from './s.module.css';

const WEATHER_CODES = {
    0: { label: 'Ясно', icon: '☀️' },
    1: { label: 'Преимущественно ясно', icon: '🌤️' },
    2: { label: 'Переменная облачность', icon: '⛅' },
    3: { label: 'Пасмурно', icon: '☁️' },
    45: { label: 'Туман', icon: '🌫️' },
    48: { label: 'Иней', icon: '🌫️' },
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

const WEEKDAYS = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];

export function WeatherCard({
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
                    `&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m` +
                    `&hourly=temperature_2m,weather_code&forecast_hours=6` +
                    `&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max` +
                    `&timezone=auto`;

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

    if (loading) {
        return <div className={s.panelCard}><div className={s.statusText}>Загрузка погоды…</div></div>;
    }

    if (error || !data?.current) {
        return (
            <div className={s.panelCard}>
                <div className={s.statusText}>Нет данных ({error || 'ошибка'})</div>
            </div>
        );
    }

    const current = data.current;
    const currentInfo = WEATHER_CODES[current.weather_code] || { label: 'Облачно', icon: '🌡️' };

    const hourlyTimes = data.hourly?.time || [];
    const hourlyTemps = data.hourly?.temperature_2m || [];
    const hourlyCodes = data.hourly?.weather_code || [];

    const dailyTimes = data.daily?.time || [];
    const dailyCodes = data.daily?.weather_code || [];
    const dailyMax = data.daily?.temperature_2m_max || [];
    const dailyMin = data.daily?.temperature_2m_min || [];
    const dailyPrecip = data.daily?.precipitation_probability_max || [];

    const tomorrowIdx = dailyTimes.length > 1 ? 1 : 0;
    const tomorrowInfo = WEATHER_CODES[dailyCodes[tomorrowIdx]] || { label: '—', icon: '🌡️' };

    return (
        <div className={s.panelCard}>
            <div className={s.header}>
                <span className={s.city}>{city}</span>
                <span className={s.conditionLabel}>{currentInfo.label}</span>
            </div>

            <div className={s.currentBlock}>
                <div className={s.mainTempContainer}>
                    <span className={s.mainIcon}>{currentInfo.icon}</span>
                    <span className={s.tempValue}>{Math.round(current.temperature_2m)}°C</span>
                </div>
                <div className={s.details}>
                    <div className={s.detailRow}>
                        <span>Влажность</span>
                        <strong>{current.relative_humidity_2m}%</strong>
                    </div>
                    <div className={s.detailRow}>
                        <span>Ветер</span>
                        <strong>{Math.round(current.wind_speed_10m)} км/ч</strong>
                    </div>
                </div>
            </div>

            <div className={s.tabs} role="tablist">
                <button
                    type="button"
                    className={`${s.tab} ${tab === 'hours' ? s.tabActive : ''}`}
                    onClick={() => setTab('hours')}
                >
                    6 часов
                </button>
                <button
                    type="button"
                    className={`${s.tab} ${tab === 'tomorrow' ? s.tabActive : ''}`}
                    onClick={() => setTab('tomorrow')}
                >
                    Завтра
                </button>
                <button
                    type="button"
                    className={`${s.tab} ${tab === 'week' ? s.tabActive : ''}`}
                    onClick={() => setTab('week')}
                >
                    7 дней
                </button>
            </div>

            {tab === 'hours' && (
                <div className={s.forecastList}>
                    {hourlyTimes.map((timeStr, idx) => {
                        const hours = new Date(timeStr).getHours().toString().padStart(2, '0') + ':00';
                        const icon = WEATHER_CODES[hourlyCodes[idx]]?.icon || '🌡️';
                        return (
                            <div key={timeStr} className={s.forecastItem}>
                                <span className={s.forecastTime}>{hours}</span>
                                <span className={s.forecastIcon}>{icon}</span>
                                <span className={s.forecastTemp}>{Math.round(hourlyTemps[idx])}°C</span>
                            </div>
                        );
                    })}
                </div>
            )}

            {tab === 'tomorrow' && (
                <div className={s.tomorrowBox}>
                    <div className={s.tomorrowTop}>
                        <span>{tomorrowInfo.icon} {tomorrowInfo.label}</span>
                        <strong>
                            {Math.round(dailyMin[tomorrowIdx])}°C … {Math.round(dailyMax[tomorrowIdx])}°C
                        </strong>
                    </div>
                    <div className={s.tomorrowMeta}>
                        <span>Осадки до {dailyPrecip[tomorrowIdx] ?? 0}%</span>
                        <span>{dailyTimes[tomorrowIdx]}</span>
                    </div>
                </div>
            )}

            {tab === 'week' && (
                <div className={s.weekList}>
                    {dailyTimes.slice(0, 7).map((dateStr, idx) => {
                        const d = new Date(`${dateStr}T12:00:00`);
                        const dayName = idx === 0 ? 'Сегодня' : idx === 1 ? 'Завтра' : WEEKDAYS[d.getDay()];
                        const icon = WEATHER_CODES[dailyCodes[idx]]?.icon || '🌡️';
                        return (
                            <div key={dateStr} className={s.weekRow}>
                                <span className={s.weekDay}>{dayName}</span>
                                <span>{icon}</span>
                                <span className={s.weekTemps}>
                                    <span className={s.minTemp}>{Math.round(dailyMin[idx])}°C</span> /{' '}
                                    <span>{Math.round(dailyMax[idx])}°C</span>
                                </span>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}