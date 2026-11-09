'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams, notFound } from 'next/navigation';
import { Dashboard_Layout } from '@/app/layouts/layout';
import { Section, Article, Card } from '@/app/ui/structure/struct';
import { ColumnSetWidget } from '@/app/ui/widgets/unific/SetColumn/column';
import { VerticalBlindsControl } from "@/app/ui/widgets/original/galusi/gal";
import s from './s.module.css';
import {
    ArrowLeft,
    Power,
    Droplets,
    Gauge,
    ShieldCheck,
    Thermometer,
    CheckCircle2,
    Sparkles,
    Sun,
    Bot
} from 'lucide-react';

const ROOM_CONFIGS = {
    'se-balcony': {
        title: 'Лоджия Юго-Восточная',
        description: 'Внешний метеоузел: мониторинг погоды, ручное открытие заслонки и вентилятора',
        type: 'balcony',
        telemetry: { temp: 23.4, humidity: 45, pressure: 1014, light: 1200 },
    },
    'nw-balcony': {
        title: 'Лоджия Северо-Западная',
        description: 'Внешний метеоузел: мониторинг погоды, ручное открытие заслонки и вентилятора',
        type: 'balcony',
        telemetry: { temp: 21.8, humidity: 52, pressure: 1013, light: 850 },
    },
    'living-room': {
        title: 'Гостиная (Зал)',
        description: 'Управление вертикальными жалюзи (окно + балконная дверь), климат-контролем и освещением',
        type: 'living',
        telemetry: { temp: 24.0, humidity: 48, pressure: 1014 },
        defaultTargets: { temp: 22.5, humidity: 50 }
    },
    'bedroom': {
        title: 'Спальня',
        description: 'Индивидуальные вентиляторы, локальный свет и тихий режим отдыха',
        type: 'bedroom',
        telemetry: { temp: 22.2, humidity: 50, pressure: 1014 },
        defaultTargets: { temp: 21.0, humidity: 50 }
    },
    'workshop': {
        title: 'Мастерская',
        description: 'Серверный узел (ТВ-бокс, Orange Pi, роутер), рабочее место и охлаждение',
        type: 'workshop',
        telemetry: { temp: 23.8, humidity: 44, pressure: 1014 },
        defaultTargets: { temp: 22.0, humidity: 45 }
    },
    'kitchen': {
        title: 'Кухня',
        description: 'Приточно-вытяжная вентиляция, кухонная вытяжка и датчик качества воздуха',
        type: 'kitchen',
        telemetry: { temp: 24.5, humidity: 56, pressure: 1014 },
        defaultTargets: { temp: 22.0, humidity: 50 }
    },
    'bathroom': {
        title: 'Ванная комната & Бойлерная',
        description: 'Система «Вода по требованию», автоматика бойлера и вытяжная заслонка',
        type: 'bathroom',
        telemetry: { temp: 25.2, humidity: 68, pressure: 1014 },
        defaultTargets: { temp: 24.0, humidity: 60 }
    },
    'hallway': {
        title: 'Прихожая',
        description: 'Поветвевой энергомониторинг электрощитка и центральный климат',
        type: 'hallway',
        telemetry: { temp: 22.6, humidity: 46, pressure: 1014 },
        defaultTargets: { temp: 22.0, humidity: 45 }
    },
    'corridor-1': {
        title: 'Коридор 1 (Общий)',
        description: 'Центральный хаб BroadLink RM Pro+ (RF 433/315 МГц + ИК) и датчики шума',
        type: 'corridor',
        telemetry: { temp: 23.1, humidity: 47, pressure: 1014 },
        defaultTargets: { temp: 22.0, humidity: 45 }
    },
    'corridor-2': {
        title: 'Коридор 2 (Внутренний)',
        description: 'Транзитный коридор к спальне, ночная подсветка и датчики движения',
        type: 'corridor',
        telemetry: { temp: 22.9, humidity: 49, pressure: 1014 },
        defaultTargets: { temp: 22.0, humidity: 45 }
    }
};

export default function RoomDetailPage() {
    const params = useParams();
    const roomId = params?.id;
    const config = ROOM_CONFIGS[roomId];

    if (!config) {
        return notFound();
    }

    const isBalcony = config.type === 'balcony';

    // Уставки климата для жилых помещений
    const [isAutoMode, setIsAutoMode] = useState(true);
    const [targetTemp, setTargetTemp] = useState(config.defaultTargets?.temp ?? 22);
    const [targetHumidity, setTargetHumidity] = useState(config.defaultTargets?.humidity ?? 50);

    // Локальные состояния приводов и устройств
    const [devices, setDevices] = useState({
        damper: 35,
        fanState: 'off',
        fanSpeed: 66,
        mainValve: true,
        boilerPower: true,
        boilerTemp: 55,
        exhaustDamper: 70,
        hoodSpeed: 'auto',
        inletDamper: 40,
        outletDamper: 50,
        benchFan: false,
        acPower: false,
        lightCeiling: true,
        lightDining: false,
        lightPassage: true,
        lightTv: false,
        fanLeft: true,
        fanRight: false,
        autoLightMotion: true
    });

    const toggleDevice = (key) => {
        setDevices((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    const setDeviceVal = (key, val) => {
        setDevices((prev) => ({ ...prev, [key]: val }));
    };

    const currentTemp = config.telemetry.temp;
    const outdoorTemp = 18.5;
    const tempDiff = Number((currentTemp - targetTemp).toFixed(1));

    let autoActionExplanation = '';
    if (tempDiff > 0.5) {
        if (outdoorTemp < currentTemp) {
            autoActionExplanation = `В помещении ${currentTemp}°C при уставке ${targetTemp}°C (+${tempDiff}°C выше цели). На улице ${outdoorTemp}°C. Автоматика открывает приток и вытяжку для охлаждения уличным воздухом без кондиционера.`;
        } else {
            autoActionExplanation = `В помещении ${currentTemp}°C, на улице жарко (${outdoorTemp}°C). Заслонки прикрыты, подан ИК-сигнал на кондиционер для охлаждения до ${targetTemp}°C.`;
        }
    } else if (tempDiff < -0.5) {
        autoActionExplanation = `В помещении ${currentTemp}°C при уставке ${targetTemp}°C (прохладнее на ${Math.abs(tempDiff)}°C). Автоматика прикрывает заслонки для сохранения тепла.`;
    } else {
        autoActionExplanation = `Температура ${currentTemp}°C соответствует уставке ${targetTemp}°C (норма ±0.5°C). Приток в дежурном режиме.`;
    }

    return (
        <Dashboard_Layout title={`Управление — ${config.title}`}>
            {/* Навигация назад */}
            <div style={{ marginBottom: 16 }}>
                <Link href="/" className={s.backBtn}>
                    <ArrowLeft size={16} />
                    <span>Вернуться на общий дашборд</span>
                </Link>
            </div>

            <Section title={config.title}>
                <Article title={config.description}>

                    {/* ============================================================ */}
                    {/* 1. ЕСЛИ ЭТО ЛОДЖИЯ: ТОЛЬКО ПОКАЗАНИЯ МЕТЕО И РУЧНОЕ УПРАВЛЕНИЕ */}
                    {/* ============================================================ */}
                    {isBalcony ? (
                        <div>
                            {/* Блок 1: Метеопоказания лоджии */}
                            <h4 style={{ margin: '0 0 12px 0', fontSize: '1rem', color: 'var(--text-main)' }}>
                                Метеопараметры окружающей среды (только просмотр):
                            </h4>
                            <div className={s.balconyMetricsGrid}>
                                <div className={s.balconyMetricCard}>
                                    <div className={s.balconyMetricHeader}>
                                        <span className={s.balconyMetricLabel}>Температура</span>
                                        <Thermometer size={18} color="var(--color-amber-d, #d97706)" />
                                    </div>
                                    <div className={s.balconyMetricValueRow}>
                                        <span className={s.balconyMetricVal} style={{ color: 'var(--color-amber-d, #d97706)' }}>
                                            {config.telemetry.temp}
                                        </span>
                                        <span className={s.balconyMetricUnit}>°C</span>
                                    </div>
                                    <span className={s.balconyMetricSub}>Датчик BME280</span>
                                </div>

                                <div className={s.balconyMetricCard}>
                                    <div className={s.balconyMetricHeader}>
                                        <span className={s.balconyMetricLabel}>Влажность</span>
                                        <Droplets size={18} color="var(--color-green, #10b981)" />
                                    </div>
                                    <div className={s.balconyMetricValueRow}>
                                        <span className={s.balconyMetricVal} style={{ color: 'var(--color-green, #10b981)' }}>
                                            {config.telemetry.humidity}
                                        </span>
                                        <span className={s.balconyMetricUnit}>%</span>
                                    </div>
                                    <span className={s.balconyMetricSub}>Относительная</span>
                                </div>

                                <div className={s.balconyMetricCard}>
                                    <div className={s.balconyMetricHeader}>
                                        <span className={s.balconyMetricLabel}>Атмосферное давление</span>
                                        <Gauge size={18} color="var(--accent-primary, #3b82f6)" />
                                    </div>
                                    <div className={s.balconyMetricValueRow}>
                                        <span className={s.balconyMetricVal} style={{ color: 'var(--accent-primary, #3b82f6)' }}>
                                            {config.telemetry.pressure}
                                        </span>
                                        <span className={s.balconyMetricUnit}>гПа</span>
                                    </div>
                                    <span className={s.balconyMetricSub}>Абсолютное</span>
                                </div>

                                <div className={s.balconyMetricCard}>
                                    <div className={s.balconyMetricHeader}>
                                        <span className={s.balconyMetricLabel}>Яркость освещения</span>
                                        <Sun size={18} color="#eab308" />
                                    </div>
                                    <div className={s.balconyMetricValueRow}>
                                        <span className={s.balconyMetricVal} style={{ color: '#eab308' }}>
                                            {config.telemetry.light}
                                        </span>
                                        <span className={s.balconyMetricUnit}>лк</span>
                                    </div>
                                    <span className={s.balconyMetricSub}>Уличный люксметр</span>
                                </div>
                            </div>

                            {/* Блок 2: Исключительно ручное управление приводами лоджии */}
                            <h4 style={{ margin: '24px 0 12px 0', fontSize: '1rem', color: 'var(--text-main)' }}>
                                Ручное управление исполнительными узлами (без автоматики):
                            </h4>
                            <div className={s.gridContainer}>
                                <Card title="Ручное открытие заслонки" className={s.card}>
                                    <p className={s.controlHint}>
                                        Угол открытия воздушного канала: <strong>{devices.damper}%</strong>
                                    </p>
                                    <input
                                        type="range"
                                        min="0"
                                        max="100"
                                        value={devices.damper}
                                        onChange={(e) => setDeviceVal('damper', Number(e.target.value))}
                                        className={s.slider}
                                    />
                                    <div className={s.btnGroup}>
                                        {[0, 25, 50, 75, 100].map((v) => (
                                            <button
                                                key={v}
                                                type="button"
                                                onClick={() => setDeviceVal('damper', v)}
                                                className={`${s.presetBtn} ${devices.damper === v ? s.presetActive : ''}`}
                                            >
                                                {v}%
                                            </button>
                                        ))}
                                    </div>
                                </Card>

                                <Card title="Ручное включение вентилятора" className={s.card}>
                                    <div className={s.toggleRow}>
                                        <span>Питание вентилятора:</span>
                                        <button
                                            type="button"
                                            onClick={() => setDeviceVal('fanState', devices.fanState === 'on' ? 'off' : 'on')}
                                            className={`${s.powerBtn} ${devices.fanState === 'on' ? s.powerActive : ''}`}
                                        >
                                            <Power size={16} />
                                            <span>{devices.fanState === 'on' ? 'ВКЛЮЧЕН' : 'ВЫКЛЮЧЕН'}</span>
                                        </button>
                                    </div>
                                    <div style={{ marginTop: 14 }}>
                                        <span className={s.controlLabel}>Скорость вращения:</span>
                                        <div className={s.btnGroup}>
                                            {[33, 66, 99].map((spd) => (
                                                <button
                                                    key={spd}
                                                    type="button"
                                                    onClick={() => setDeviceVal('fanSpeed', spd)}
                                                    className={`${s.presetBtn} ${devices.fanSpeed === spd ? s.presetActive : ''}`}
                                                >
                                                    {spd}%
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </Card>
                            </div>
                        </div>
                    ) : (
                        /* ============================================================ */
                        /* 2. ЖИЛЫЕ ПОМЕЩЕНИЯ: УСТАВКИ, АВТОМАТИКА И ИСПОЛНИТЕЛЬНЫЕ УЗЛЫ */
                        /* ============================================================ */
                        <>
                            {/* Блок автоматики */}
                            <div className={s.automationHero}>
                                <div className={s.autoHeaderRow}>
                                    <div className={s.autoTitleBlock}>
                                        <div className={s.autoBadge}>
                                            <Bot size={18} />
                                            <span>Интеллект умного дома</span>
                                        </div>
                                        <h3 className={s.autoHeading}>Автоматическое поддержание климата по уставкам</h3>
                                    </div>
                                    <div className={s.modeSelector}>
                                        <button
                                            type="button"
                                            onClick={() => setIsAutoMode(true)}
                                            className={`${s.modeBtn} ${isAutoMode ? s.modeActive : ''}`}
                                        >
                                            <Sparkles size={14} /> Полный автомат
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setIsAutoMode(false)}
                                            className={`${s.modeBtn} ${!isAutoMode ? s.modeActive : ''}`}
                                        >
                                            Ручной режим
                                        </button>
                                    </div>
                                </div>

                                <p className={s.autoExplanation}>
                                    <strong>Решение системы прямо сейчас:</strong> {autoActionExplanation}
                                </p>
                            </div>

                            {/* Задатчики (уставки температуры и влажности) */}
                            <div style={{ margin: '20px 0' }}>
                                <h4 style={{ margin: '0 0 12px 0', fontSize: '1rem', color: 'var(--text-main)' }}>
                                    Целевые уставки помещения (перетаскивайте стрелку цели на шкале):
                                </h4>
                                <div className={s.setpointsRow}>
                                    <ColumnSetWidget
                                        title="Температура"
                                        iconName="thermometer"
                                        current={currentTemp}
                                        initial={targetTemp}
                                        min={16}
                                        max={30}
                                        unit="°C"
                                        colorTheme="orange"
                                        onTargetChange={(val) => setTargetTemp(val)}
                                    />

                                    <ColumnSetWidget
                                        title="Влажность"
                                        iconName="droplet"
                                        current={config.telemetry.humidity}
                                        initial={targetHumidity}
                                        min={20}
                                        max={80}
                                        unit="%"
                                        colorTheme="blue"
                                        onTargetChange={(val) => setTargetHumidity(val)}
                                    />

                                    <div className={s.sensorsSummaryCard}>
                                        <div className={s.sensorsHeader}>
                                            <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Ориентиры автоматики:</span>
                                            <span className={s.liveDot}>● Онлайн</span>
                                        </div>
                                        <div className={s.sensorList}>
                                            <div className={s.sensorItem}>
                                                <span>Датчик комнаты (BME280):</span>
                                                <strong>{currentTemp}°C / {config.telemetry.humidity}% / {config.telemetry.pressure} гПа</strong>
                                            </div>
                                            <div className={s.sensorItem}>
                                                <span>Улица ЮВ (метеоузел лоджии):</span>
                                                <strong>18.5°C / 45% (Люксметр 1200 lx)</strong>
                                            </div>
                                            <div className={s.sensorItem}>
                                                <span>Улица СЗ (метеоузел лоджии):</span>
                                                <strong>17.8°C / 50%</strong>
                                            </div>
                                            <div className={s.sensorItem}>
                                                <span>Градиент улица/комната:</span>
                                                <strong style={{ color: 'var(--accent-primary)' }}>-{(currentTemp - outdoorTemp).toFixed(1)}°C (Охлаждение доступно)</strong>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Исполнительные устройства */}
                            <h4 style={{ margin: '24px 0 12px 0', fontSize: '1rem', color: 'var(--text-main)' }}>
                                Исполнительные устройства комнаты:
                            </h4>

                            <div className={s.gridContainer}>
                                {(config.type === 'living') && (
                                    <>
                                        <VerticalBlindsControl />

                                        <Card title="Зонированное радио-освещение (BroadLink RF)" className={s.card}>
                                            <p className={s.controlHint}>Радиоуправление 433 МГц по подзонам гостиной</p>
                                            <div className={s.toggleList}>
                                                {[
                                                    { key: 'lightCeiling', label: 'Потолочные светильники' },
                                                    { key: 'lightDining', label: 'Столовая зона' },
                                                    { key: 'lightPassage', label: 'Проходная зона' },
                                                    { key: 'lightTv', label: 'Подсветка зоны ТВ' },
                                                ].map((l) => (
                                                    <div key={l.key} className={s.toggleRow}>
                                                        <span>{l.label}</span>
                                                        <button
                                                            type="button"
                                                            onClick={() => toggleDevice(l.key)}
                                                            className={`${s.switchBtn} ${devices[l.key] ? s.switchActive : ''}`}
                                                        >
                                                            {devices[l.key] ? 'ВКЛ' : 'ВЫКЛ'}
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </Card>

                                        <Card title="Кондиционер (BroadLink ИК)" className={s.card}>
                                            <div className={s.toggleRow}>
                                                <span>Питание:</span>
                                                <button
                                                    type="button"
                                                    onClick={() => toggleDevice('acPower')}
                                                    className={`${s.powerBtn} ${devices.acPower ? s.powerActive : ''}`}
                                                >
                                                    <Power size={16} />
                                                    <span>{devices.acPower ? 'ВКЛЮЧЕН' : 'ВЫКЛЮЧЕН'}</span>
                                                </button>
                                            </div>
                                            <div style={{ marginTop: 12 }}>
                                                <span className={s.controlLabel}>Уставка кондиционера: {targetTemp} °C</span>
                                                <p className={s.controlHint} style={{ fontSize: '0.78rem', marginTop: 4 }}>
                                                    * Запускается автоматически по ИК только тогда, когда наружный воздух лоджии не справляется с целевой уставкой.
                                                </p>
                                            </div>
                                        </Card>
                                    </>
                                )}

                                {(config.type === 'bathroom') && (
                                    <>
                                        <Card title="Защита от протечек («Вода по требованию»)" className={s.card}>
                                            <p className={s.controlHint}>
                                                Главный запорный кран стояка. Закрыт по умолчанию, открывается автоматически по датчикам движения или току стиральной машины.
                                            </p>
                                            <div className={s.toggleRow} style={{ marginTop: 10 }}>
                                                <span>Главный кран стояка:</span>
                                                <button
                                                    type="button"
                                                    onClick={() => toggleDevice('mainValve')}
                                                    className={`${s.powerBtn} ${devices.mainValve ? s.powerActive : s.powerDanger}`}
                                                >
                                                    <ShieldCheck size={16} />
                                                    <span>{devices.mainValve ? 'ОТКРЫТ' : 'ПЕРЕКРЫТ'}</span>
                                                </button>
                                            </div>
                                        </Card>

                                        <Card title="Бойлер & Контроль давления" className={s.card}>
                                            <div className={s.toggleRow}>
                                                <span>Питание бойлера (Wi-Fi реле):</span>
                                                <button
                                                    type="button"
                                                    onClick={() => toggleDevice('boilerPower')}
                                                    className={`${s.switchBtn} ${devices.boilerPower ? s.switchActive : ''}`}
                                                >
                                                    {devices.boilerPower ? 'ВКЛ' : 'ВЫКЛ'}
                                                </button>
                                            </div>
                                            <div style={{ marginTop: 12 }}>
                                                <span className={s.controlLabel}>Целевой нагрев бойлера: {devices.boilerTemp} °C</span>
                                                <input
                                                    type="range"
                                                    min="40"
                                                    max="75"
                                                    value={devices.boilerTemp}
                                                    onChange={(e) => setDeviceVal('boilerTemp', Number(e.target.value))}
                                                    className={s.slider}
                                                />
                                            </div>
                                            <div style={{ marginTop: 8, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                                Давление воды на входе: <strong>2.8 бар</strong> (в пределах безопасной нормы).
                                            </div>
                                        </Card>
                                    </>
                                )}

                                {(config.type === 'kitchen') && (
                                    <Card title="Кухонная вытяжка" className={s.card}>
                                        <p className={s.controlHint}>Прямой канал в стену. Автоматика запускает вытяжку при росте температуры или ухудшении качества воздуха.</p>
                                        <div className={s.btnGroup} style={{ marginTop: 10 }}>
                                            {['выкл', 'авто', '1', '2', '3'].map((mode) => (
                                                <button
                                                    key={mode}
                                                    type="button"
                                                    onClick={() => setDeviceVal('hoodSpeed', mode)}
                                                    className={`${s.presetBtn} ${devices.hoodSpeed === mode ? s.presetActive : ''}`}
                                                >
                                                    {mode.toUpperCase()}
                                                </button>
                                            ))}
                                        </div>
                                    </Card>
                                )}

                                {(config.type === 'bedroom') && (
                                    <Card title="Индивидуальный обдув" className={s.card}>
                                        <p className={s.controlHint}>Вентиляторы направленного обдува</p>
                                        <div className={s.toggleRow}>
                                            <span>Левый вентилятор:</span>
                                            <button
                                                type="button"
                                                onClick={() => toggleDevice('fanLeft')}
                                                className={`${s.switchBtn} ${devices.fanLeft ? s.switchActive : ''}`}
                                            >
                                                {devices.fanLeft ? 'ВКЛ' : 'ВЫКЛ'}
                                            </button>
                                        </div>
                                        <div className={s.toggleRow} style={{ marginTop: 8 }}>
                                            <span>Правый вентилятор:</span>
                                            <button
                                                type="button"
                                                onClick={() => toggleDevice('fanRight')}
                                                className={`${s.switchBtn} ${devices.fanRight ? s.switchActive : ''}`}
                                            >
                                                {devices.fanRight ? 'ВКЛ' : 'ВЫКЛ'}
                                            </button>
                                        </div>
                                    </Card>
                                )}

                                {(config.type === 'workshop') && (
                                    <Card title="Серверный узел" className={s.card}>
                                        <div className={s.telemetryList}>
                                            <div className={s.telemItem}>
                                                <span className={s.telemLabel}>ТВ-бокс Linux (Next.js / MQTT)</span>
                                                <span className={s.telemVal} style={{ color: 'var(--color-green)' }}>192.168.2.20</span>
                                            </div>
                                            <div className={s.telemItem}>
                                                <span className={s.telemLabel}>Orange Pi (Энергомониторинг / SCT-013)</span>
                                                <span className={s.telemVal} style={{ color: 'var(--color-green)' }}>192.168.2.21</span>
                                            </div>
                                            <div className={s.telemItem}>
                                                <span className={s.telemLabel}>Роутер D-Link DIR-2150 (Samba / NAS)</span>
                                                <span className={s.telemVal} style={{ color: 'var(--color-green)' }}>192.168.2.1</span>
                                            </div>
                                        </div>
                                    </Card>
                                )}

                                {(config.type === 'hallway') && (
                                    <Card title="Поветвевой энергомониторинг (Щиток)" className={s.card}>
                                        <div className={s.telemetryList}>
                                            <div className={s.telemItem}>
                                                <span className={s.telemLabel}>Вводная магистраль (Всего)</span>
                                                <span className={s.telemVal} style={{ color: 'var(--color-amber)' }}>0.68 кВт</span>
                                            </div>
                                            <div className={s.telemItem}>
                                                <span className={s.telemLabel}>Бойлер (Ванная)</span>
                                                <span className={s.telemVal}>0.00 кВт</span>
                                            </div>
                                            <div className={s.telemItem}>
                                                <span className={s.telemLabel}>Стиральная машина</span>
                                                <span className={s.telemVal}>0.00 кВт</span>
                                            </div>
                                            <div className={s.telemItem}>
                                                <span className={s.telemLabel}>Кухня</span>
                                                <span className={s.telemVal}>0.28 кВт</span>
                                            </div>
                                        </div>
                                    </Card>
                                )}
                            </div>
                        </>
                    )}
                </Article>
            </Section>
        </Dashboard_Layout>
    );
}
