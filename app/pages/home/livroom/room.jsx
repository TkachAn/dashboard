

import { Card, Panel } from '@/app/ui/structure/struct';
import s from './s.module.css';
import { Shildind } from '@/app/ui/widgets/unific/shild_vertical/shildic';
import { Thermometer, Droplet, Gauge, Sun } from 'lucide-react';

export const Room = () => {
    return (
        <Card title='Гостиная' className={s.card}>
            <div className={s.fl}>

                <Panel className={s.panel} title='Температура' icon={<Thermometer />}>
                    <div className={s.flex}>
                        <Shildind val={28} max={40} unit='°C' param='Снаружи' />
                        <Shildind val={25} max={40} unit='°C' param='Внутри' />
                    </div>
                </Panel>
                <Panel className={s.panel} title='Влажность' icon={<Droplet />}>
                    <div className={s.flex}>
                        <Shildind val={80} unit='%' param='Снаружи' />
                        <Shildind val={51} unit='%' param='Внутри' />
                    </div>
                </Panel>
                <Panel className={s.panel} title='Давление' icon={<Gauge />}>
                    <div className={s.flex}>
                        <Shildind val={1000} min={650} max={1200} unit='гПа' param='Снаружи' />
                        <Shildind val={900} min={650} max={1200} unit='гПа' param='Внутри' />
                    </div>
                </Panel>
                <Panel className={s.panel} title='Освещение' icon={<Sun />}>
                    <div className={s.flex}>
                        <Shildind val={800} max={1000} unit='лк' param='Снаружи' />
                        <Shildind val={200} max={1000} unit='лк' param='Внутри' />
                    </div>
                </Panel>

                <Panel className={s.panel} title='Внутри'> </Panel>
                <Panel className={s.panel} title='Шторы'> </Panel>
                <Panel className={s.panel} title='Свет'> </Panel>
            </div>
        </Card>
    );
};
/*
 iconName='thermometer' 

*/