'use client';

import s from './s.module.css';
import { Thermometer, Droplet, Gauge, Sun } from 'lucide-react';
// Карта иконок для быстрого поиска по строковому имени
const iconMap = {
    thermometer: Thermometer,
    droplet: Droplet,
    gauge: Gauge,
    sun: Sun
};

export function Shildic({ id, className, param, iconName, unit, val, colorTheme = 'blue', }) {
    const IconComponent = iconName ? iconMap[iconName] : null;
    return (
        <div id={id} className={`${s.shild} ${className || ""} ${s[colorTheme]}`}>
            {param && <span className={s.label}> {param} </span>}
            <div className={s.damperRow}>

                {IconComponent && <IconComponent className={s.widgetIcon} size={20} />}
                <span className={s.shild_val}> {val} {unit} </span>
            </div>

        </div>
    );
}


export function Shildind({ id, className, param, iconName, unit, val, min = 0, max = 100 }) {
    const IconComponent = iconName ? iconMap[iconName] : null;
    const clamp = (val1, minVal, maxVal) => Math.max(minVal, Math.min(maxVal, val1));
    const percent = ((clamp(val, min, max) - min) / (max - min)) * 100;
    return (

        <div id={id} className={`${s.shild} ${className || ""}`}>
            <div className={s.damperRow}>{IconComponent && <IconComponent className={s.widgetIcon} size={20} />}
                {param && <span className={s.label}> {param} </span>}

            </div>


            <div className={s.damperRow}>
                <div className={s.miniGauge}>
                    <div
                        className={s.gaugeFill}
                        style={{ width: `${percent}%` }}
                    />
                </div>
                <span className={s.shild_val}> {val} {unit} </span>

            </div>
        </div>
    )
}

/*
 {icon && <span className={s.shild_icon}> {icon} </span>}
<span className={s.value}>{val}{unit}</span>
 <span className={s.shild_val}> {val} {unit} </span>
*/