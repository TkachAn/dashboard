"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Shield,
  Crown,
  UserCheck,
  Smartphone,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";

// ── Компоненты дизайн-системы ──
import { TextInput, EmailInput, SelectInput, PasswordInput } from "@/app/ui/elements/inputs/inputsGPT";
import {
  NormButton,
  SubmitButton,
  DeleteButton,
  AddButton,
} from "@/app/ui/elements/buttons/buttons";
import {
  DeleteIconButton,
  EditIconButton,
  CloseIconButton,
} from "@/app/ui/elements/buttons/IconButtons";

import s from "./s.module.css";

/* ═══════════════════════════════════════════
   КОНСТАНТЫ И ХЕЛПЕРЫ
   ═══════════════════════════════════════════ */
const ROLE_OPTIONS = [
  { label: "Владелец (owner)", value: "owner" },
  { label: "Гость (guest)", value: "guest" },
];

const ROLE_OPTIONS_WITH_ADMIN = [
  { label: "Администратор (admin)", value: "admin" },
  ...ROLE_OPTIONS,
];

const ROLE_LABELS = {
  admin: "Администратор",
  owner: "Владелец",
  guest: "Гость",
};

const BADGE_CLASS = {
  admin: s.badgeAdmin,
  owner: s.badgeOwner,
  guest: s.badgeGuest,
};

const USERS_STORAGE_KEY = "smarthome_users";

/** Начальные данные — единственный администратор */
const INITIAL_USERS = [
  {
    id: "usr_001",
    name: "Главный Администратор",
    email: "admin@smarthome.local",
    password: "admin",
    role: "admin",
    device: "iPhone 15 Pro",
  },
];

let nextId = 2;
const generateId = () => `usr_${String(nextId++).padStart(3, "0")}`;

/* ═══════════════════════════════════════════
   КОМПОНЕНТ: УВЕДОМЛЕНИЕ
   ═══════════════════════════════════════════ */
function Alert({ type, children, onClose }) {
  if (!children) return null;
  const cls = type === "error" ? s.alertError : s.alertSuccess;
  const Icon = type === "error" ? AlertTriangle : CheckCircle;
  return (
    <div className={`${s.alert} ${cls}`}>
      <Icon size={16} />
      <span style={{ flex: 1 }}>{children}</span>
      {onClose && <CloseIconButton size={14} onClick={onClose} />}
    </div>
  );
}

/* ═══════════════════════════════════════════
   КОМПОНЕНТ: МОДАЛЬНОЕ ОКНО РЕДАКТИРОВАНИЯ
   ═══════════════════════════════════════════ */
function EditModal({ user, users, onSave, onClose }) {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [role, setRole] = useState(user.role);
  const [device, setDevice] = useState(user.device);
  const [error, setError] = useState("");

  const isAdmin = user.role === "admin";
  const hasAdmin = users.some((u) => u.role === "admin" && u.id !== user.id);

  // Определяем доступные роли для редактирования
  const editRoleOptions = isAdmin
    ? ROLE_OPTIONS_WITH_ADMIN // Админ может остаться админом
    : hasAdmin
      ? ROLE_OPTIONS // Если админ уже есть — нельзя стать вторым
      : ROLE_OPTIONS_WITH_ADMIN;

  const handleSave = () => {
    if (!name.trim() || !email.trim()) {
      setError("Имя и Email обязательны");
      return;
    }

    // Нельзя назначить второго админа
    if (role === "admin" && !isAdmin && hasAdmin) {
      setError("В системе уже есть администратор. Может быть только один.");
      return;
    }

    // Нельзя снять роль admin с единственного администратора
    if (isAdmin && role !== "admin") {
      setError("Невозможно сменить роль единственного администратора системы.");
      return;
    }

    onSave({
      ...user,
      name: name.trim(),
      email: email.trim(),
      role,
      device: device.trim(),
    });
  };

  return (
    <div className={s.overlay} onClick={onClose}>
      <div className={s.modal} onClick={(e) => e.stopPropagation()}>
        <div className={s.modalHeader}>
          <h3 className={s.modalTitle}>Редактировать пользователя</h3>
          <CloseIconButton size={18} onClick={onClose} />
        </div>

        <div className={s.modalBody}>
          {error && <Alert type="error">{error}</Alert>}

          <TextInput
            label="Имя"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Введите имя"
          />

          <EmailInput
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="user@example.com"
          />

          <SelectInput
            label="Роль"
            value={role}
            options={editRoleOptions}
            onChange={(e) => setRole(e.target.value)}
            disabled={isAdmin}
          />

          {isAdmin && (
            <p className={s.info}>
              <Shield size={14} style={{ verticalAlign: "middle" }} />{" "}
              Роль администратора нельзя изменить — он единственный в системе.
            </p>
          )}

          <TextInput
            label="Устройство (геофенсинг)"
            value={device}
            onChange={(e) => setDevice(e.target.value)}
            placeholder="Название смартфона"
          />
        </div>

        <div className={s.modalActions}>
          <NormButton onClick={onClose}>Отмена</NormButton>
          <SubmitButton onClick={handleSave}>Сохранить</SubmitButton>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   КОМПОНЕНТ: МОДАЛЬНОЕ ПОДТВЕРЖДЕНИЕ УДАЛЕНИЯ
   ═══════════════════════════════════════════ */
function ConfirmDeleteModal({ user, onConfirm, onClose }) {
  return (
    <div className={s.overlay} onClick={onClose}>
      <div className={s.modal} onClick={(e) => e.stopPropagation()}>
        <div className={s.modalHeader}>
          <h3 className={s.modalTitle}>Подтверждение удаления</h3>
          <CloseIconButton size={18} onClick={onClose} />
        </div>

        <div className={s.modalBody}>
          <p className={s.info}>
            Вы действительно хотите удалить пользователя{" "}
            <strong>{user.name}</strong> ({user.email})?
          </p>
          <p className={s.info}>Это действие нельзя отменить.</p>
        </div>

        <div className={s.modalActions}>
          <NormButton onClick={onClose}>Отмена</NormButton>
          <DeleteButton status="accent" onClick={() => onConfirm(user.id)}>
            Удалить
          </DeleteButton>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   ГЛАВНЫЙ КОМПОНЕНТ: UserManagement
   ═══════════════════════════════════════════ */
export default function UserManagement() {
  // ── Состояние ──
  const [users, setUsers] = useState(INITIAL_USERS);
  const [alert, setAlert] = useState({ type: "", message: "" });

  // Форма добавления
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newRole, setNewRole] = useState("guest");
  const [newDevice, setNewDevice] = useState("");

  // Модалки
  const [editingUser, setEditingUser] = useState(null);
  const [deletingUser, setDeletingUser] = useState(null);

  // Синхронизация с localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(USERS_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setUsers(parsed);
          return;
        }
      }
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(INITIAL_USERS));
    } catch (e) {
      console.warn("Ошибка чтения smarthome_users:", e);
    }
  }, []);

  const saveUsersToStorage = (updatedUsers) => {
    setUsers(updatedUsers);
    try {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updatedUsers));
      window.dispatchEvent(new Event("smarthome_auth_change"));
    } catch (e) {
      console.warn("Ошибка сохранения smarthome_users:", e);
    }
  };

  // ── Проверка: есть ли уже admin ──
  const hasAdmin = users.some((u) => u.role === "admin");

  // ── Показать уведомление ──
  const showAlert = useCallback((type, message) => {
    setAlert({ type, message });
    setTimeout(() => setAlert({ type: "", message: "" }), 4000);
  }, []);

  // ── Сброс формы ──
  const resetForm = () => {
    setNewName("");
    setNewEmail("");
    setNewPassword("");
    setNewRole("guest");
    setNewDevice("");
  };

  /* ── ДОБАВЛЕНИЕ пользователя ── */
  const handleAdd = () => {
    // Валидация
    if (!newName.trim() || !newEmail.trim()) {
      showAlert("error", "Заполните обязательные поля: Имя и Email.");
      return;
    }

    // Проверка уникальности email
    if (users.some((u) => u.email.toLowerCase() === newEmail.trim().toLowerCase())) {
      showAlert("error", `Пользователь с email «${newEmail.trim()}» уже зарегистрирован.`);
      return;
    }

    // Блокировка второго админа
    if (newRole === "admin" && hasAdmin) {
      showAlert(
        "error",
        "В системе уже есть администратор. Может быть только один администратор (владелец сервера)."
      );
      return;
    }

    const newUser = {
      id: generateId(),
      name: newName.trim(),
      email: newEmail.trim(),
      password: newPassword.trim() || "123456",
      role: newRole,
      device: newDevice.trim() || "—",
    };

    saveUsersToStorage([...users, newUser]);
    resetForm();
    showAlert("success", `Пользователь «${newUser.name}» успешно добавлен.`);
  };

  /* ── РЕДАКТИРОВАНИЕ пользователя ── */
  const handleSaveEdit = (updatedUser) => {
    const updated = users.map((u) => (u.id === updatedUser.id ? updatedUser : u));
    saveUsersToStorage(updated);
    setEditingUser(null);
    showAlert("success", `Данные «${updatedUser.name}» обновлены.`);
  };

  /* ── УДАЛЕНИЕ пользователя ── */
  const handleDelete = (userId) => {
    const target = users.find((u) => u.id === userId);

    // Защита от удаления администратора
    if (target?.role === "admin") {
      showAlert("error", "Невозможно удалить администратора системы.");
      setDeletingUser(null);
      return;
    }

    const updated = users.filter((u) => u.id !== userId);
    saveUsersToStorage(updated);
    setDeletingUser(null);
    showAlert("success", `Пользователь «${target.name}» удалён.`);
  };

  /* ── Иконка роли для таблицы ── */
  const RoleIcon = ({ role }) => {
    switch (role) {
      case "admin":
        return <Shield size={14} />;
      case "owner":
        return <Crown size={14} />;
      default:
        return <UserCheck size={14} />;
    }
  };

  // ── Опции роли для формы добавления (без admin, если уже есть) ──
  const addRoleOptions = hasAdmin ? ROLE_OPTIONS : ROLE_OPTIONS_WITH_ADMIN;

  return (
    <div className={s.page}>
      <h1 className={s.pageTitle}>Управление пользователями</h1>

      {/* ── Уведомление ── */}
      {alert.message && (
        <Alert
          type={alert.type}
          onClose={() => setAlert({ type: "", message: "" })}
        >
          {alert.message}
        </Alert>
      )}

      {/* ══════════════════════════════════════
           ФОРМА ДОБАВЛЕНИЯ ПОЛЬЗОВАТЕЛЯ
         ══════════════════════════════════════ */}
      <div className={s.formCard}>
        <h2 className={s.formTitle}>Добавить пользователя</h2>

        <div className={s.formGrid}>
          <TextInput
            label="Имя *"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Иван Петров"
          />

          <EmailInput
            label="Email *"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            placeholder="user@example.com"
          />

          <PasswordInput
            label="Пароль"
            mode="login"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="По умолчанию: 123456"
          />

          <SelectInput
            label="Роль"
            value={newRole}
            options={addRoleOptions}
            onChange={(e) => setNewRole(e.target.value)}
          />

          <TextInput
            label="Устройство (геофенсинг)"
            value={newDevice}
            onChange={(e) => setNewDevice(e.target.value)}
            placeholder="iPhone 15, Samsung S24..."
          />
        </div>

        {hasAdmin && newRole !== "admin" ? null : !hasAdmin ? null : (
          <p className={s.info} style={{ marginTop: 8 }}>
            <AlertTriangle size={14} style={{ verticalAlign: "middle" }} />{" "}
            Администратор уже существует в системе.
          </p>
        )}

        <div className={s.formActions}>
          <NormButton onClick={resetForm}>Очистить</NormButton>
          <AddButton status="accent" onClick={handleAdd}>
            Добавить пользователя
          </AddButton>
        </div>
      </div>

      {/* ══════════════════════════════════════
           ТАБЛИЦА ПОЛЬЗОВАТЕЛЕЙ
         ══════════════════════════════════════ */}
      <div className={s.tableCard}>
        <h2 className={s.tableTitle}>
          Зарегистрированные пользователи ({users.length})
        </h2>

        {users.length === 0 ? (
          <div className={s.empty}>Нет зарегистрированных пользователей.</div>
        ) : (
          <table className={s.table}>
            <thead>
              <tr>
                <th>Имя</th>
                <th>Email</th>
                <th>Роль</th>
                <th>Устройство</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <span className={`${s.badge} ${BADGE_CLASS[user.role]}`}>
                      <RoleIcon role={user.role} />{" "}
                      {ROLE_LABELS[user.role]}
                    </span>
                  </td>
                  <td>
                    <span className={s.deviceName}>
                      <Smartphone
                        size={13}
                        style={{ verticalAlign: "middle", marginRight: 4 }}
                      />
                      {user.device || "—"}
                    </span>
                  </td>
                  <td>
                    <div className={s.rowActions}>
                      <EditIconButton
                        size={16}
                        title="Редактировать"
                        onClick={() => setEditingUser(user)}
                      />
                      {user.role !== "admin" && (
                        <DeleteIconButton
                          size={16}
                          title="Удалить"
                          onClick={() => setDeletingUser(user)}
                        />
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ── Модалка редактирования ── */}
      {editingUser && (
        <EditModal
          user={editingUser}
          users={users}
          onSave={handleSaveEdit}
          onClose={() => setEditingUser(null)}
        />
      )}

      {/* ── Модалка удаления ── */}
      {deletingUser && (
        <ConfirmDeleteModal
          user={deletingUser}
          onConfirm={handleDelete}
          onClose={() => setDeletingUser(null)}
        />
      )}
    </div>
  );
}
