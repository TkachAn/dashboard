//app/ui/elements/widgets/indicators/LED.jsx
import { Cpu } from "lucide-react";
import s from './led.module.css';

const STATE_MAPPING = {
    unknown: 'Не определено',
    ready: 'Готово к работе',
    error: 'Авария',
    warning: 'Предупреждение',
    loading: 'Загрузка...'
};

export const LED = ({ id, title, state = 'unknown', icon = <Cpu /> }) => {
    const statusText = STATE_MAPPING[state] || STATE_MAPPING.unknown;
    const stateClass = s[state] || s.unknown;

    return (
        <div className={s.wrapper}>
            <div className={s.visualWrapper}>
                {icon && <div className={s.icon}>{icon}</div>}
                <div
                    className={`${s.led} ${stateClass}`}
                    aria-label={statusText}
                    title={statusText}
                />

            </div>
            <div className={s.info}>
                {title && <h3 className={s.title}>{title}</h3>}
                <span className={s.comment}>{statusText}</span>
            </div>
        </div>
    );
};

/*
{id && <span className={s.id}>#{id}</span>}
*/
