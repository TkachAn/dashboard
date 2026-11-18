"use client";

import { useState } from 'react';
import agentsData from '@/data/agents.json';
import s from './s.module.css';

export function AgentsManager() {
    const [visiblePasswords, setVisiblePasswords] = useState({});

    const togglePassword = (id) => {
        setVisiblePasswords((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    // Функция для красивого форматирования названий ключей из JSON
    const formatLabel = (key) => {
        const labels = {
            id: 'ID',
            name: 'Имя',
            email: 'Email',
            password: 'Пароль',
            role: 'Роль',
            device: 'Устройство',
            gender: 'Пол',
            room: 'Помещение',
            room_description: 'Описание помещения',
            personality: 'Характер / Стиль',
            voice: 'Голос',
            sphere_of_influence: 'Сферы влияния'
        };
        return labels[key] || key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' ');
    };

    // Рендерим значение в зависимости от его типа (строка, объект, массив)
    const renderValue = (key, value, agentId) => {
        if (value === null || value === undefined) return '—';

        // Если это поле пароля — добавляем логику скрытия/показа
        if (key === 'password') {
            const isPasswordShown = !!visiblePasswords[agentId];
            return (
                <div className={s.passwordBox}>
                    <code className={s.passwordText}>
                        {isPasswordShown ? value : '••••••••'}
                    </code>
                    <button
                        type="button"
                        onClick={() => togglePassword(agentId)}
                        className={s.toggleBtn}
                    >
                        {isPasswordShown ? 'Скрыть' : 'Показать'}
                    </button>
                </div>
            );
        }

        // Если это массив (например, сферы влияния)
        if (Array.isArray(value)) {
            return (
                <ul className={s.subList}>
                    {value.map((item, idx) => (
                        <li key={idx}>{item}</li>
                    ))}
                </ul>
            );
        }

        // Если это вложенный объект (например, voice)
        if (typeof value === 'object') {
            return (
                <div className={s.subObject}>
                    {Object.entries(value).map(([subKey, subVal]) => (
                        <div key={subKey} className={s.subRow}>
                            <span className={s.subLabel}>{formatLabel(subKey)}:</span> {String(subVal)}
                        </div>
                    ))}
                </div>
            );
        }

        // Обычная строка или число
        const stringVal = String(value);
        const isUnassigned = stringVal === 'unassigned' || stringVal === '—';

        return (
            <span className={`${s.value} ${isUnassigned ? s.unassigned : ''}`}>
                {isUnassigned && key === 'device' ? 'Не назначено' : stringVal}
            </span>
        );
    };

    return (
        <>
            <header className={s.header}>
                <h2 className={s.title}>Агенты ХАОСА (Агенты системы)</h2>
                <span className={s.counter}>Всего: {agentsData.length}</span>
            </header>

            <div className={s.grid}>
                {agentsData.map((agent) => {
                    const isAdmin = agent.role === 'admin';

                    return (
                        <article key={agent.id} className={s.card}>
                            <div className={s.cardTop}>
                                <div className={s.avatar}>
                                    {agent.name ? agent.name.charAt(0).toUpperCase() : '?'}
                                </div>
                                <div className={s.nameBlock}>
                                    <h3 className={s.name}>{agent.name || 'Без имени'}</h3>
                                    <span className={s.id}>{agent.id}</span>
                                </div>
                                {agent.role && (
                                    <span className={`${s.badge} ${isAdmin ? s.badgeAdmin : s.badgeSpeaker}`}>
                                        {agent.role}
                                    </span>
                                )}
                            </div>

                            {/* Динамический обход всех ключей JSON */}
                            <div className={s.infoList}>
                                {Object.entries(agent).map(([key, value]) => {
                                    // Пропускаем те поля, которые уже выведены в шапке карточки для красоты
                                    if (key === 'id' || key === 'name' || key === 'role') return null;

                                    return (
                                        <div key={key} className={s.infoRow}>
                                            <span className={s.label}>{formatLabel(key)}:</span>
                                            {renderValue(key, value, agent.id)}
                                        </div>
                                    );
                                })}
                            </div>
                        </article>
                    );
                })}
            </div>
        </>
    );
}