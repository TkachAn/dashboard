'use client';
import s from './s.module.css'
import React from 'react';
import { Dashboard_Layout } from '@/app/layouts/layout';
import { Section, Article, Card } from '@/app/ui/structure/struct';
import { RoomIndicatorCard } from '@/app/ui/widgets/RoomIndicatorCard/RoomIndicatorCard';
import { AiMenu } from '@/app/ui/mehu_for_home/leftBarCopy';
import {
    Compass,
    Wind,
    Tv,
    Bed,
    Wrench,
    Utensils,
    Bath,
    DoorOpen,
    Route
} from 'lucide-react';
import { Room } from './pages/home/livroom/room';
import CircularScheduler from './ui/widgets/unific/Sheduler/sheduler';
import SchedulerWidget from './ui/widgets/unific/Sheduler/wrapper';
import { Widget } from '@/app/ui/widgets/unific/shild_Ai/shild';

const ROOMS_DATA = [
    {
        id: 'se-balcony',
        href: '/rooms/se-balcony',
        title: 'Лоджия Юго-Восточная',
        subtitle: 'Внешний метеоузел & Приток',
        icon: Compass,
        metrics: [
            { label: 'Температура', value: '23.4', unit: '°C', color: 'orange' },
            { label: 'Влажность', value: '45', unit: '%', color: 'green' },
            { label: 'Давление', value: '1014', unit: 'гПа', color: 'blue' },
            { label: 'Яркость (люкс)', value: '1200', unit: 'лк', color: 'amber' },
        ],
        statusText: 'Заслонка 35%, вентилятор выкл (ручной режим)',
        badge: 'Метео'
    },
    {
        id: 'nw-balcony',
        href: '/rooms/nw-balcony',
        title: 'Лоджия Северо-Западная',
        subtitle: 'Внешний метеоузел & Приток',
        icon: Wind,
        metrics: [
            { label: 'Температура', value: '21.8', unit: '°C', color: 'orange' },
            { label: 'Влажность', value: '52', unit: '%', color: 'green' },
            { label: 'Давление', value: '1013', unit: 'гПа', color: 'blue' },
            { label: 'Яркость (люкс)', value: '850', unit: 'лк', color: 'amber' },
        ],
        statusText: 'Заслонка 15%, вентилятор выкл (ручной режим)',
        badge: 'Метео'
    },
    {
        id: 'living-room',
        href: '/rooms/living-room',
        title: 'Гостиная (Зал)',
        subtitle: 'Модульный обзор: Свет, Жалюзи, Климат',
        icon: Tv,
        metrics: [
            { label: 'Свет (5 зон)', value: '2 из 5', unit: 'горит', color: 'amber' },
            { label: 'Жалюзи', value: 'Только дверь', unit: '', color: 'blue' },
            { label: 'Температура', value: '24.0', unit: '°C', color: 'orange' },
            { label: 'Влажность', value: '48', unit: '%', color: 'green' },
        ],
        statusText: 'Компактные блоки: Свет (5 ламп), Жалюзи, Климат',
        badge: '3 блока'
    },
    {
        id: 'bedroom',
        href: '/rooms/bedroom',
        title: 'Спальня',
        subtitle: 'Зона сна & Мультисенсор',
        icon: Bed,
        metrics: [
            { label: 'Температура (цель 21°)', value: '22.2', unit: '°C', color: 'orange' },
            { label: 'Влажность (цель 50%)', value: '50', unit: '%', color: 'green' },
            { label: 'Шум в покое', value: '28', unit: 'дБ', color: 'blue' },
            { label: 'Вентиляторы', value: 'Авто (Тихий)', unit: '', color: 'green' },
        ],
        statusText: 'Тихий ночной климат поддерживается автоматически',
        badge: 'Авто'
    },
    {
        id: 'workshop',
        href: '/rooms/workshop',
        title: 'Мастерская',
        subtitle: 'Серверный узел & Рабочее место',
        icon: Wrench,
        metrics: [
            { label: 'Температура (цель 22°)', value: '23.8', unit: '°C', color: 'orange' },
            { label: 'Влажность', value: '44', unit: '%', color: 'green' },
            { label: 'Сеть (LAN)', value: '1.0', unit: 'Гбит/с', color: 'blue' },
            { label: 'Серверы', value: '3 / 3', unit: 'онлайн', color: 'green' },
        ],
        statusText: 'ТВ-бокс, Orange Pi, роутер работают штатно',
        badge: 'Online'
    },
    {
        id: 'kitchen',
        href: '/rooms/kitchen',
        title: 'Кухня',
        subtitle: 'Приточно-вытяжная вентиляция',
        icon: Utensils,
        metrics: [
            { label: 'Температура (цель 22°)', value: '24.5', unit: '°C', color: 'orange' },
            { label: 'Влажность', value: '56', unit: '%', color: 'green' },
            { label: 'Качество возд.', value: '98', unit: '%', color: 'green' },
            { label: 'Вытяжка', value: 'Авто', unit: '', color: 'blue' },
        ],
        statusText: 'Воздух чистый, вытяжка ждёт готовки',
        badge: 'Авто'
    },
    {
        id: 'bathroom',
        href: '/rooms/bathroom',
        title: 'Ванная & Бойлерная',
        subtitle: 'Защита от протечек & Водоснабжение',
        icon: Bath,
        metrics: [
            { label: 'Температура', value: '25.2', unit: '°C', color: 'orange' },
            { label: 'Влажность (порог 60%)', value: '68', unit: '%', color: 'red' },
            { label: 'Давление воды', value: '2.8', unit: 'бар', color: 'blue' },
            { label: 'Бойлер (цель 55°)', value: '55', unit: '°C', color: 'orange' },
        ],
        statusText: 'Влажность выше уставки: вытяжка открыта на 70%',
        badge: 'Авто'
    },
    {
        id: 'hallway',
        href: '/rooms/hallway',
        title: 'Прихожая',
        subtitle: 'Электрощит & Энергомониторинг',
        icon: DoorOpen,
        metrics: [
            { label: 'Мощность сети', value: '0.68', unit: 'кВт', color: 'orange' },
            { label: 'Напряжение', value: '228', unit: 'В', color: 'blue' },
            { label: 'Температура', value: '22.6', unit: '°C', color: 'orange' },
            { label: 'Датчик движ.', value: 'Свет авто', unit: '', color: 'green' },
        ],
        statusText: 'Стояк открыт (наличие людей в доме)',
        badge: 'Авто'
    },
    {
        id: 'corridor-1',
        href: '/rooms/corridor-1',
        title: 'Коридор 1 (Общий)',
        subtitle: 'Центральный хаб BroadLink RM Pro+',
        icon: Route,
        metrics: [
            { label: 'Температура', value: '23.1', unit: '°C', color: 'orange' },
            { label: 'Влажность', value: '47', unit: '%', color: 'green' },
            { label: 'Давление', value: '1014', unit: 'гПа', color: 'blue' },
            { label: 'Шум', value: '32', unit: 'дБ', color: 'blue' },
        ],
        statusText: 'Автоматика координирует RF и ИК команды',
        badge: 'ОК'
    },
    {
        id: 'corridor-2',
        href: '/rooms/corridor-2',
        title: 'Коридор 2 (Внутренний)',
        subtitle: 'Транзитная зона & Ночной свет',
        icon: Route,
        metrics: [
            { label: 'Температура', value: '22.9', unit: '°C', color: 'orange' },
            { label: 'Влажность', value: '49', unit: '%', color: 'green' },
            { label: 'Датчик движ.', value: 'Готов', unit: '', color: 'green' },
            { label: 'Подсветка', value: 'Дежурная', unit: '', color: 'purple' },
        ],
        statusText: 'Автоматическое включение дежурного света ночью',
        badge: 'Авто'
    }
];

export default function Home() {
    return (
        <Dashboard_Layout sidebar={<AiMenu />} title="Дашборд — Обзор помещений">
            <Section id='1' title="Все помещения умного дома">

                <Article id='11' title="Climate wigets: ">
                    <Card title='Гостиная' className={s.card}>

                        <div>
                            <Widget colorTheme='yellow' title='Свет' unit='lx' out={500} in={350} target={800} min={100} max={1000} />
                        </div>
                        <br />
                        <div>
                            <Widget colorTheme='green' title='Давление' unit='гПа' out={800} in={900} target={800} min={650} max={1200} />
                        </div>



                    </Card>
                    <Card title="Sheduler" className={s.card} >
                        <SchedulerWidget />
                    </Card>
                </Article>

                <Article id='12' title="Sheduler test: ">
                    <Card title="Sheduler" className={s.card} >
                        <SchedulerWidget />
                    </Card>
                </Article>
                <Article id='13' title="ROOM test: ">


                    <Room />

                </Article>

            </Section>
        </Dashboard_Layout>
    );
}



/*

<div>
                            <Widget colorTheme='blue' title='Влажность' unit='%' out={80} in={45} target={60} />
                        </div>
                        <br />
                        <div>
                            <Widget colorTheme='orange' out={20} in={10} target={22} max={40} />
                        </div>
                        <br />


<CircularScheduler />

<div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '16px',
                        width: '100%'
                    }}>
                        {ROOMS_DATA.map((room) => (
                            <RoomIndicatorCard
                                id={room.id}
                                key={room.id}
                                href={room.href}
                                title={room.title}
                                subtitle={room.subtitle}
                                icon={room.icon}
                                metrics={room.metrics}
                                statusText={room.statusText}
                                badge={room.badge}
                            />
                        ))}
                    </div>

*/