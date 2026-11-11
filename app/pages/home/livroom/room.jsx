

import { Card, Panel } from '@/app/ui/structure/struct';
import s from './s.module.css';
import { Shildind } from '@/app/ui/widgets/unific/shild_vertical/shildic';

export const Room = () => {
    return (
        <Card title='Гостиная' className={s.card}>
            <div className={s.flex}>
                <Panel className={s.panel} title='Снаружи'> <Shildind val={28} iconName='thermometer' /> </Panel>
                <Panel className={s.panel} title='Внутри'><Shildind val={25} param='Температура' iconName='thermometer' />  </Panel>
                <Panel className={s.panel} title='Шторы'> </Panel>
                <Panel className={s.panel} title='Свет'> </Panel>
            </div>
        </Card>
    );
};
