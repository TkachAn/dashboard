'use client';

import dynamic from 'next/dynamic';

// Отключаем SSR для кругового программатора, так как он зависит от клиентской графики и времени
const CircularScheduler = dynamic(
    () => import('./sheduler'), // Укажите ваш путь к файлу sheduler.jsx
    { ssr: false }
);

export default function SchedulerWidget(props) {
    return <CircularScheduler {...props} />;
}