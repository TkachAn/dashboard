import s from './s.module.css';

export default function Widget({
    title = 'Температура',
    unit = '°C',
    out: outVal,
    in: inVal,
    target,
    min = 0,
    max = 100,
}) {
    const currentVal = inVal ?? outVal ?? min;
    const clamp = (val, minVal, maxVal) => Math.max(minVal, Math.min(maxVal, val));
    const percent = ((clamp(currentVal, min, max) - min) / (max - min)) * 100;

    return (
        <div className={s.box}>
            <div className={s.bar}>
                <div className={s.fill} style={{ height: `${percent}%` }} />
            </div>

            <div className={s.info}>
                <h3 className={s.ttl}>{title}</h3>

                <div className={s.list}>
                    <div className={s.row}>
                        <span className={s.lbl}>снаружи:</span>
                        <span className={s.val}>{outVal ?? '--'} {unit}</span>
                    </div>

                    <div className={`${s.row} ${s.main}`}>
                        <span className={s.lbl}>внутри:</span>
                        <span className={s.val}>{inVal ?? '--'} {unit}</span>
                    </div>

                    <div className={s.row}>
                        <span className={s.lbl}>задано:</span>
                        <span className={s.val}>{target ?? '--'} {unit}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}