'use client';
import s from './s1.module.css'
import React from 'react';
import { Dashboard_Layout } from '@/app/layouts/layout';
import { Section, Article, Card, Wrap } from '@/app/ui/structure/struct';
import { AiMenu } from '@/app/ui/mehu_for_home/leftBarCopy';
import SchedulerWidget from './ui/widgets/unific/Sheduler/wrapper';
import { Widget } from '@/app/ui/widgets/unific/shild_Ai/shild';
import { WeatherCard } from './ui/widgets/unific/weather/weather';
import { WeatherDesk } from './ui/widgets/unific/weather/desktop/weather';
import { WeatherDeskGoogle } from './ui/widgets/unific/weather/deskGogle/weather';
import { WeatherDeskMeteo } from './ui/widgets/unific/weather/deskMeteo/weather';




export default function Home() {
    return (
        <Dashboard_Layout sidebar={<AiMenu />} title="Дашборд — Обзор помещений">
            <Section id='1' title="Все помещения умного дома" className={s.sec}>
                <Article id='10' title='Weather TEST'>
                    <div className={s.cont}>
                        <Card title='Desktop Meteo'><WeatherDeskMeteo /></Card>
                        <Card title='Desktop Google'><WeatherDeskGoogle /></Card>
                        <Card title='Desktop'><WeatherDesk /></Card>
                    </div>
                </Article>

                <Article id='11' title="Гостиная" className={s.art}>
                    <div className={s.cont}>
                        <Card title='Climate wigets: ' className={s.card}>
                            <div className={s.cont}>

                                <Widget colorTheme='yellow' title='Свет' unit='lx' out={500} in={350} target={800} min={100} max={1000} />
                                <Widget colorTheme='green' title='Давление' unit='гПа' out={800} in={900} target={800} min={650} max={1200} />
                            </div>

                        </Card>
                        <Card title="Sheduler" className={s.card} >
                            <div className={s.cont}>
                                <SchedulerWidget />
                            </div>
                        </Card>
                        <Card title='Climate wigets: ' className={s.card}>
                            <div className={s.cont}>

                                <Widget colorTheme='blue' title='Влажность' unit='%' out={80} in={45} target={60} />
                                <Widget colorTheme='orange' out={20} in={10} target={22} max={40} />
                            </div>

                        </Card>
                    </div>
                </Article>


                <br />
                <Article id='12' title="Спальня" className={s.art}>
                    <div className={s.cont}>
                        <Card title='Climate wigets: ' className={s.card}>
                            <div className={s.cont}>
                                <Widget colorTheme='yellow' title='Свет' unit='lx' out={500} in={350} target={800} min={100} max={1000} />
                                <Widget colorTheme='green' title='Давление' unit='гПа' out={800} in={900} target={800} min={650} max={1200} />
                                <Widget colorTheme='blue' title='Влажность' unit='%' out={80} in={45} target={60} />
                                <Widget colorTheme='orange' out={20} in={10} target={22} max={40} />
                            </div>

                        </Card>
                    </div>
                </Article>
            </Section>
        </Dashboard_Layout>
    );
}
/*
<div className={s.groop}>
                                <Widget className={s.card} colorTheme='yellow' title='Свет' unit='lx' out={500} in={350} target={800} min={100} max={1000} />
                                <Widget className={s.card} colorTheme='green' title='Давление' unit='гПа' out={800} in={900} target={800} min={650} max={1200} />
                            </div>

*/