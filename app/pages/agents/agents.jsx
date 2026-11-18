"use client";

import { useState } from "react";
import initialAgents from "@/data/agents.json";
import { Container, Header, Section, Article, Card } from "@/app/ui/structure/struct";
import { TextInput, PasswordInput, SelectInput, TextAreaInput } from "@/app/ui/elements/inputs/inputsGPT";
import { EditButton, SubmitButton, NormButton } from "@/app/ui/elements/buttons/buttons";

export function AgentsManager() {
    const [agents, setAgents] = useState(initialAgents);
    const [editingAgent, setEditingAgent] = useState(null);

    // Открыть модальное окно для редактирования агента
    const handleEditClick = (agent) => {
        setEditingAgent({
            ...agent,
            // Превращаем массив сфер влияния в строку для удобства редактирования в textarea
            sphere_of_influence: Array.isArray(agent.sphere_of_influence)
                ? agent.sphere_of_influence.join("\n")
                : agent.sphere_of_influence || ""
        });
    };

    // Сохранить изменения
    const handleSave = (e) => {
        e.preventDefault();
        if (!editingAgent) return;

        // Превращаем сферы влияния обратно в массив строк по переносам строк
        const updatedAgent = {
            ...editingAgent,
            sphere_of_influence: typeof editingAgent.sphere_of_influence === "string"
                ? editingAgent.sphere_of_influence.split("\n").filter(Boolean)
                : editingAgent.sphere_of_influence
        };

        setAgents(
            agents.map((a) => (a.id === updatedAgent.id ? updatedAgent : a))
        );
        setEditingAgent(null);
    };

    return (
        <Container>
            <Header title="Управление агентами дома" />

            <Section title="Активные узлы системы">
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "16px", marginTop: "16px" }}>
                    {agents.map((agent) => (
                        <Article key={agent.id} title={`${agent.name} (${agent.id})`}>
                            <Card>
                                <div style={{ display: "flex", flexDirection: "column", gap: "8px", width: "100%" }}>
                                    <div><strong>Роль:</strong> {agent.role}</div>
                                    <div><strong>Помещение:</strong> {agent.room || "Не указано"}</div>
                                    <div><strong>Устройство:</strong> {agent.device}</div>
                                    <div><strong>Пол / Голос:</strong> {agent.gender} ({agent.voice?.tone || "стандарт"})</div>
                                    <div><strong>Email:</strong> {agent.email}</div>

                                    <div style={{ fontSize: "0.9rem", marginTop: "4px" }}>
                                        <strong>Характер:</strong> <span style={{ opacity: 0.8 }}>{agent.personality}</span>
                                    </div>

                                    <div style={{ marginTop: "10px" }}>
                                        <EditButton onClick={() => handleEditClick(agent)}>
                                            Редактировать свойства
                                        </EditButton>
                                    </div>
                                </div>
                            </Card>
                        </Article>
                    ))}
                </div>
            </Section>

            {/* Модальное окно редактирования с твоими инпутами и кнопками */}
            {editingAgent && (
                <div style={{
                    position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
                    background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100,
                    overflowY: "auto", padding: "20px"
                }}>
                    <div style={{ background: "var(--card-bg, #0f172a)", padding: "24px", borderRadius: "12px", width: "480px", maxWidth: "100%", border: "1px solid var(--card-border, #334155)", maxHeight: "90vh", overflowY: "auto" }}>
                        <h3 style={{ marginBottom: "16px", color: "var(--text-main)" }}>Редактирование: {editingAgent.name}</h3>

                        <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                            <TextInput
                                label="Имя агента"
                                value={editingAgent.name}
                                onChange={(e) => setEditingAgent({ ...editingAgent, name: e.target.value })}
                                required
                            />

                            <TextInput
                                label="Помещение (комната)"
                                value={editingAgent.room}
                                onChange={(e) => setEditingAgent({ ...editingAgent, room: e.target.value })}
                            />

                            <TextAreaInput
                                label="Описание помещения"
                                value={editingAgent.room_description}
                                onChange={(e) => setEditingAgent({ ...editingAgent, room_description: e.target.value })}
                                rows={2}
                            />

                            <TextInput
                                label="Устройство (девайс)"
                                value={editingAgent.device}
                                onChange={(e) => setEditingAgent({ ...editingAgent, device: e.target.value })}
                                required
                            />

                            <TextInput
                                label="Роль в системе"
                                value={editingAgent.role}
                                onChange={(e) => setEditingAgent({ ...editingAgent, role: e.target.value })}
                                required
                            />

                            <TextInput
                                label="Пол (gender)"
                                value={editingAgent.gender}
                                onChange={(e) => setEditingAgent({ ...editingAgent, gender: e.target.value })}
                            />

                            <TextAreaInput
                                label="Характер (personality)"
                                value={editingAgent.personality}
                                onChange={(e) => setEditingAgent({ ...editingAgent, personality: e.target.value })}
                                rows={2}
                            />

                            <TextAreaInput
                                label="Сферы влияния (каждая с новой строки)"
                                value={editingAgent.sphere_of_influence}
                                onChange={(e) => setEditingAgent({ ...editingAgent, sphere_of_influence: e.target.value })}
                                rows={3}
                            />

                            <TextInput
                                label="Email (аккаунт)"
                                value={editingAgent.email}
                                onChange={(e) => setEditingAgent({ ...editingAgent, email: e.target.value })}
                                required
                            />

                            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "12px" }}>
                                <SubmitButton>Сохранить</SubmitButton>
                                <NormButton type="button" onClick={() => setEditingAgent(null)}>
                                    Отмена
                                </NormButton>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </Container>
    );
}