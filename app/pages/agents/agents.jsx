"use client";

import { useState } from 'react';
import agentsData from '@/data/agents.json';
import s from './s.module.css';

export function Agents() {
    const [visiblePasswords, setVisiblePasswords] = useState({});

    const togglePassword = (id) => {
        setVisiblePasswords((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    return (
        <section className={s.container}>
            <header className={s.header}>
                <h2 className={s.title}>Агенты системы</h2>
                <span className={s.counter}>Всего: {agentsData.length}</span>
            </header>

            <div className={s.grid}>
                {agentsData.map((agent) => {
                    const isAdmin = agent.role === 'admin';
                    const isUnassigned = agent.device === 'unassigned';
                    const isPasswordShown = !!visiblePasswords[agent.id];

                    return (
                        <article key={agent.id} className={s.card}>
                            <div className={s.cardTop}>
                                <div className={s.avatar}>
                                    {agent.name.charAt(0).toUpperCase()}
                                </div>
                                <div className={s.nameBlock}>
                                    <h3 className={s.name}>{agent.name}</h3>
                                    <span className={s.id}>{agent.id}</span>
                                </div>
                                <span className={`${s.badge} ${isAdmin ? s.badgeAdmin : s.badgeSpeaker}`}>
                                    {agent.role}
                                </span>
                            </div>

                            <div className={s.infoList}>
                                <div className={s.infoRow}>
                                    <span className={s.label}>Устройство:</span>
                                    <span className={`${s.value} ${isUnassigned ? s.unassigned : ''}`}>
                                        {isUnassigned ? 'Не назначено' : agent.device}
                                    </span>
                                </div>

                                <div className={s.infoRow}>
                                    <span className={s.label}>Аккаунт:</span>
                                    <span className={s.value} title={agent.email}>
                                        {agent.email}
                                    </span>
                                </div>

                                <div className={s.infoRow}>
                                    <span className={s.label}>Пароль:</span>
                                    <div className={s.passwordBox}>
                                        <code className={s.passwordText}>
                                            {isPasswordShown ? agent.password : '••••••••'}
                                        </code>
                                        <button
                                            type="button"
                                            onClick={() => togglePassword(agent.id)}
                                            className={s.toggleBtn}
                                        >
                                            {isPasswordShown ? 'Скрыть' : 'Показать'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </article>
                    );
                })}
            </div>
        </section>
    );
}