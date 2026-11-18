import EnergyCompareChart from './chart';
import styles from './s.module.css';

const mockKitchenLineData = [
    {
        label: 'Понедельник',
        points: [
            { time: '00:00:00', value: 15 },
            { time: '07:30:00', value: 15 },
            { time: '07:30:01', value: 2100 },
            { time: '07:43:40', value: 2100 },
            { time: '07:43:41', value: 15 },
            { time: '23:59:59', value: 15 },
        ],
    },
    {
        label: 'Вторник',
        isCurrent: true,
        points: [
            { time: '00:00:00', value: 15 },
            { time: '07:35:00', value: 15 },
            { time: '07:35:01', value: 210 },
            { time: '07:53:40', value: 210 },
            { time: '07:53:41', value: 15 },
            { time: '08:05:10', value: 15 },
            { time: '08:05:11', value: 2120 },
            { time: '08:08:50', value: 2120 },
            { time: '08:08:51', value: 15 },
            { time: '23:59:59', value: 15 },
        ],
    },
    {
        label: 'Среда',
        isCurrent: true,
        points: [
            { time: '00:00:00', value: 15 },
            { time: '08:00:10', value: 15 },
            { time: '08:00:11', value: 2120 },
            { time: '08:18:50', value: 2120 },
            { time: '08:18:51', value: 15 },
            { time: '23:59:59', value: 15 },
        ],
    },
];

export default function DashboardPage() {
    return (
        <main className={styles.container}>
            <div className={styles.grid}>
                <EnergyCompareChart
                    lineTitle="Линия 2: Кухня (сравнение по дням)"
                    daysData={mockKitchenLineData}
                />
            </div>
        </main>
    );
}