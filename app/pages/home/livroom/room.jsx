

import { Card, Panel } from '@/app/ui/structure/struct';
import s from './s.module.css';
import { Shildind } from '@/app/ui/widgets/unific/shild_vertical/shildic';
import { Thermometer, Droplet, Gauge, Sun } from 'lucide-react';
import Widget from '@/app/ui/widgets/unific/shild_Ai/shild';

export const Room = () => {
    return (
        <Card title='Гостиная' className={s.card}>

            <div>
                <Widget colorTheme='yellow' title='Свет' unit='lx' out={500} in={900} target={800} min={100} max={1000} />
            </div>
            <div>
                <Widget colorTheme='green' title='Давление' unit='гПа' out={800} in={900} target={800} min={650} max={1200} />
            </div>
            <div>
                <Widget colorTheme='blue' title='Влажность' unit='%' out={80} in={45} target={60} />
            </div>
            <br />
            <div>
                <Widget out={20} in={10} target={22} max={40} />
            </div>
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