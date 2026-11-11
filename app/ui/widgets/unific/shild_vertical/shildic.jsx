'use client';

import s from './s.module.css';
import { Thermometer, Droplet, Gauge, Sun } from 'lucide-react';

const iconMap = {
    thermometer: Thermometer,
    droplet: Droplet,
    gauge: Gauge,
    sun: Sun
};


export function Shildind({ id, className, param, iconName, unit, val, min = 0, max = 100 }) {
    const IconComponent = iconName ? iconMap[iconName] : null;
    const clamp = (val1, minVal, maxVal) => Math.max(minVal, Math.min(maxVal, val1));
    const percent = ((clamp(val, min, max) - min) / (max - min)) * 100;

    return (
        <div id={id} className={`${s.shild} ${className || ""}`}>
            <div className={s.damperRow}>
                {param && <span className={s.label}>{param}</span>}
                {IconComponent && <IconComponent className={s.widgetIcon} size={20} />}
            </div>

            <div className={s.verticalIndicatorContainer}>
                <div className={s.miniGaugeVertical}>
                    <div
                        className={s.gaugeFillVertical}
                        style={{ height: `${percent}%` }}
                    />
                </div>
                <div>
                    <div className={s.flex}>
                        <span className={s.shildVal}>{val}</span>
                        <span className={s.shildUnit}>{unit}</span>
                    </div>
                </div>

            </div>
        </div>
    );
}
/*
 
            <div className={s.damperRow}>
                {IconComponent && <IconComponent className={s.widgetIcon} size={20} />}
                {param && <span className={s.label}>{param}</span>}
            </div>

*/