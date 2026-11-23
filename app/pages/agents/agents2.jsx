"use client";

import { useState } from 'react';
import agentsData from '@/data/agents.json';
import { Article, Section } from '@/app/ui/structure/struct';
import { TextInput, TextAreaInput, PasswordInput } from '@/app/ui/elements/inputs/inputsGPT';
import { EditButton, SubmitButton, NormButton } from '@/app/ui/elements/buttons/buttons';
import s from './s.module.css';

export function AgentsManager() {
    const [agents, setAgents] = useState(agentsData);
    const [visiblePasswords, setVisiblePasswords] = useState({});
    const [editingAgent, setEditingAgent] = useState(null);

    const togglePassword = (id) => {
        setVisiblePasswords((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    // Автоматический перевод ключей JSON в читаемые подписи для интерфейса
    const formatLabel = (key) => {
        const labels = {
            id: 'ID',
            name: 'Имя',
            email: 'Email',
            password: 'Пароль',
            role: 'Роль',
            device: 'Устройство',
            gender: 'Пол',
            voice: 'Голос',
            room: 'Помещение',
            room_description: 'Описание помещения',
            personality: 'Характер',
            sphere_of_influence: 'Сферы влияния'
        };
        return labels[key] || key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' ');
    };

    // Открыть модальное окно редактирования
    const handleEditClick = (agent) => {
        setEditingAgent({
            ...agent,
            // Превращаем массивы (например, сферы влияния) в строки с переносами для textarea
            ...Object.fromEntries(
                Object.entries(agent).map(([k, v]) => [
                    k,
                    Array.isArray(v) ? v.join('\n') : (typeof v === 'object' && v !== null ? JSON.stringify(v, null, 2) : v)
                ])
            )
        });
    };

    // Сохранить изменения
    const handleSave = (e) => {
        e.preventDefault();
        if (!editingAgent) return;

        // Восстанавливаем типы данных при сохранении (если поле было массивом, превращаем обратно в массив)
        const originalAgent = agents.find(a => a.id === editingAgent.id);
        const updatedAgent = { ...editingAgent };

        for (const key of Object.keys(updatedAgent)) {
            if (originalAgent && Array.isArray(originalAgent[key])) {
                updatedAgent[key] = typeof updatedAgent[key] === 'string'
                    ? updatedAgent[key].split('\n').map(item => item.trim()).filter(Boolean)
                    : updatedAgent[key];
            }
        }

        setAgents(agents.map(a => a.id === updatedAgent.id ? updatedAgent : a));
        setEditingAgent(null);
    };

    // Рендер значения в карточке в зависимости от типа данных в JSON
    const renderValue = (key, value, agentId) => {
        if (value === null || value === undefined) return '—';

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

        if (Array.isArray(value)) {
            return (
                <ul className={s.subList}>
                    {value.map((item, idx) => (
                        <li key={idx}>{item}</li>
                    ))}
                </ul>
            );
        }

        if (typeof value === 'object') {
            return (
                <div className={s.subObject}>
                    {Object.entries(value).map(([subKey, subVal]) => (
                        <div key={subKey} className={s.subRow}>
                            <span>{formatLabel(subKey)}: {String(subVal)}</span>
                        </div>
                    ))}
                </div>
            );
        }

        const stringVal = String(value);
        const isUnassigned = stringVal === 'unassigned' || stringVal === '—';

        return (
            <span className={`${s.value} ${isUnassigned ? s.unassigned : ''}`}>
                {isUnassigned && key === 'device' ? 'Не назначено' : stringVal}
            </span>
        );
    };

    return (
        <Section title='Агенты системы'>


            <div className={s.grid}>
                {agents.map((agent) => {
                    const isAdmin = agent.role === 'admin';

                    return (
                        <Article id={agent.id} title={agent.name} note={agent.id} key={agent.id} className={s.card}>

                            {/* Динамический обход всех полей JSON */}
                            <div className={s.infoList}>
                                {Object.entries(agent).map(([key, value]) => {
                                    if (key === 'id' || key === 'name' || key === 'role') return null;

                                    return (
                                        <div key={key} className={s.infoRow}>
                                            <span className={s.label}>{formatLabel(key)}:</span>
                                            {renderValue(key, value, agent.id)}
                                        </div>
                                    );
                                })}
                            </div>

                            <div className={s.cardActions} style={{ marginTop: '12px', pt: '10px', borderTop: '1px solid var(--border-default, #1e293b)' }}>
                                <EditButton onClick={() => handleEditClick(agent)}>
                                    Редактировать
                                </EditButton>
                            </div>
                        </Article>
                    );
                })}
            </div>

            {/* Модальное окно редактирования с твоими инпутами и кнопками */}
            {editingAgent && (
                <div className={s.modalOverlay} style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0, 0, 0, 0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '16px'
                }}>
                    <div className={s.modal} style={{
                        background: 'var(--card-bg, #0f172a)', border: '1px solid var(--card-border, #334155)',
                        borderRadius: '16px', padding: '24px', width: '100%', maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto', color: '#f8fafc'
                    }}>
                        <h3 style={{ marginTop: 0, marginBottom: '20px' }}>Редактирование: {editingAgent.name}</h3>

                        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                            {/* Динамическая генерация полей формы под ключи JSON */}
                            {Object.entries(editingAgent).map(([key, value]) => {
                                if (key === 'id') return null; // ID не трогаем

                                if (key === 'password') {
                                    return (
                                        <PasswordInput
                                            key={key}
                                            label={formatLabel(key)}
                                            value={value || ''}
                                            onChange={(e) => setEditingAgent({ ...editingAgent, [key]: e.target.value })}
                                        />
                                    );
                                }

                                if (typeof value === 'string' && value.length > 50) {
                                    return (
                                        <TextAreaInput
                                            key={key}
                                            label={formatLabel(key)}
                                            value={value}
                                            onChange={(e) => setEditingAgent({ ...editingAgent, [key]: e.target.value })}
                                            rows={3}
                                        />
                                    );
                                }

                                return (
                                    <TextInput
                                        key={key}
                                        label={formatLabel(key)}
                                        value={value !== null && value !== undefined ? String(value) : ''}
                                        onChange={(e) => setEditingAgent({ ...editingAgent, [key]: e.target.value })}
                                    />
                                );
                            })}

                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '10px' }}>
                                <SubmitButton>Сохранить</SubmitButton>
                                <NormButton type="button" onClick={() => setEditingAgent(null)}>
                                    Отмена
                                </NormButton>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </Section>
    );
}

//<h3 className={s.name}>{agent.name || 'Без имени'}</h3>
//title={<>{agent.name} <small>- {agent.id}</small></>}
/*
<div className={s.cardTop}>
                                <div className={s.avatar}>
                                    {agent.name ? agent.name.charAt(0).toUpperCase() : '?'}
                                </div>
                                <div className={s.nameBlock} id={agent.id}>

                                </div>
                                {agent.role && (
                                    <span className={`${s.badge} ${isAdmin ? s.badgeAdmin : s.badgeSpeaker}`}>
                                        {agent.role}
                                    </span>
                                )}
                            </div>

*/