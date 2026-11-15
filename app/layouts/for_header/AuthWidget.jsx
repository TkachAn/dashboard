"use client";

import { useState, useEffect, useCallback } from "react";
import {
  LogIn,
  Shield,
  Crown,
  UserCheck,
  AlertCircle,
  KeyRound,
  User,
} from "lucide-react";

// ── UI-компоненты дизайн-системы проекта ──
import { EmailInput, PasswordInput } from "@/app/ui/elements/inputs/inputsGPT";
import { NormButton, SubmitButton } from "@/app/ui/elements/buttons/buttons";
import {
  CloseIconButton,
  LogOutIconButton,
} from "@/app/ui/elements/buttons/IconButtons";

import s from "./auth.module.css";

/* ═══════════════════════════════════════════════════════════════
   КОНСТАНТЫ И ДЕФОЛТНЫЕ ДАННЫЕ
   ═══════════════════════════════════════════════════════════════ */
const USERS_STORAGE_KEY = "smarthome_users";
const SESSION_STORAGE_KEY = "current_user";
const AUTH_EVENT_NAME = "smarthome_auth_change";

/**
 * Начальный пул пользователей для демонстрации и первого запуска,
 * если в localStorage ключ "smarthome_users" ещё пуст.
 */
const DEFAULT_SYSTEM_USERS = [
  {
    id: "usr_001",
    name: "Главный Администратор",
    email: "admin@smarthome.local",
    password: "admin",
    role: "admin",
    device: "iPhone 15 Pro",
  },
  {
    id: "usr_002",
    name: "Алексей (Владелец)",
    email: "owner@smarthome.local",
    password: "password123",
    role: "owner",
    device: "Samsung Galaxy S24",
  },
  {
    id: "usr_003",
    name: "Гость Дома",
    email: "guest@smarthome.local",
    password: "guest",
    role: "guest",
    device: "Google Pixel 8",
  },
];

const ROLE_CONFIG = {
  admin: {
    label: "Администратор",
    icon: Shield,
    className: s.roleAdmin,
  },
  owner: {
    label: "Владелец",
    icon: Crown,
    className: s.roleOwner,
  },
  guest: {
    label: "Гость",
    icon: UserCheck,
    className: s.roleGuest,
  },
};

/* ═══════════════════════════════════════════════════════════════
   КОМПОНЕНТ: МОДАЛЬНОЕ ОКНО АВТОРИЗАЦИИ
   ═══════════════════════════════════════════════════════════════ */
function LoginModal({ isOpen, onClose, onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Сброс формы при закрытии/открытии
  useEffect(() => {
    if (isOpen) {
      setEmail("");
      setPassword("");
      setError("");
      setIsLoading(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e?.preventDefault();
    setError("");

    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPassword = password.trim();

    if (!trimmedEmail) {
      setError("Пожалуйста, введите Email");
      return;
    }
    if (!trimmedPassword) {
      setError("Пожалуйста, введите пароль");
      return;
    }

    setIsLoading(true);

    try {
      // Считываем актуальный список пользователей из localStorage
      const rawUsers = localStorage.getItem(USERS_STORAGE_KEY);
      let users = [];
      if (rawUsers) {
        try {
          users = JSON.parse(rawUsers);
        } catch {
          users = [];
        }
      }

      // Если в localStorage пусто, используем дефолтных
      if (!Array.isArray(users) || users.length === 0) {
        users = DEFAULT_SYSTEM_USERS;
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(DEFAULT_SYSTEM_USERS));
      }

      // Проверка совпадения учетных данных
      const matchedUser = users.find(
        (u) =>
          u.email &&
          u.email.trim().toLowerCase() === trimmedEmail &&
          String(u.password) === trimmedPassword
      );

      if (!matchedUser) {
        setError("Неверный email или пароль. Попробуйте снова.");
        setIsLoading(false);
        return;
      }

      // Успешный вход: сохраняем сессию без пароля
      const sessionData = {
        id: matchedUser.id,
        name: matchedUser.name,
        email: matchedUser.email,
        role: matchedUser.role,
        device: matchedUser.device || "",
        loginTime: new Date().toISOString(),
      };

      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sessionData));
      window.dispatchEvent(new Event(AUTH_EVENT_NAME));

      setIsLoading(false);
      onLoginSuccess(sessionData);
      onClose();
    } catch (err) {
      console.error("Ошибка при авторизации:", err);
      setError("Произошла ошибка при попытке входа. Попробуйте позже.");
      setIsLoading(false);
    }
  };

  return (
    <div className={s.overlay} onClick={onClose} role="dialog" aria-modal="true">
      <div className={s.modal} onClick={(e) => e.stopPropagation()}>
        <div className={s.modalHeader}>
          <h3 className={s.modalTitle}>
            <KeyRound size={20} />
            Вход в систему
          </h3>
          <CloseIconButton size={18} onClick={onClose} title="Закрыть окно" />
        </div>

        <form onSubmit={handleSubmit}>
          <div className={s.modalBody}>
            {error && (
              <div className={s.errorBox}>
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            <EmailInput
              label="Email"
              name="auth_email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError("");
              }}
              placeholder="admin@smarthome.local"
              required
              autoFocus
            />

            <PasswordInput
              label="Пароль"
              name="auth_password"
              mode="login"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) setError("");
              }}
              placeholder="Введите пароль"
              required
            />

            <p className={s.hint}>
              Для теста: <strong>admin@smarthome.local</strong> / <strong>admin</strong>
            </p>
          </div>

          <div className={s.modalActions}>
            <SubmitButton
              onClick={handleSubmit}
              status={isLoading ? "blocked" : "accent"}
            >
              {isLoading ? "Проверка..." : "Войти"}
            </SubmitButton>
            <NormButton onClick={onClose}>Отмена</NormButton>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   ГЛАВНЫЙ КОМПОНЕНТ: AuthWidget
   ═══════════════════════════════════════════════════════════════ */
export function AuthWidget() {
  const [currentUser, setCurrentUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Инициализация пользователей в localStorage и загрузка текущей сессии
  const syncAuthState = useCallback(() => {
    try {
      // Инициализируем хранилище пользователей, если его ещё нет
      const storedUsers = localStorage.getItem(USERS_STORAGE_KEY);
      if (!storedUsers) {
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(DEFAULT_SYSTEM_USERS));
      }

      // Считываем активную сессию
      const rawSession = localStorage.getItem(SESSION_STORAGE_KEY);
      if (rawSession) {
        const parsed = JSON.parse(rawSession);
        setCurrentUser(parsed);
      } else {
        setCurrentUser(null);
      }
    } catch (e) {
      console.warn("Не удалось прочитать состояние авторизации из localStorage:", e);
      setCurrentUser(null);
    }
  }, []);

  useEffect(() => {
    setIsMounted(true);
    syncAuthState();

    // Слушаем изменения localStorage (в других вкладках и через кастомные события)
    const handleStorageChange = (e) => {
      if (!e.key || e.key === SESSION_STORAGE_KEY || e.key === USERS_STORAGE_KEY) {
        syncAuthState();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener(AUTH_EVENT_NAME, syncAuthState);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener(AUTH_EVENT_NAME, syncAuthState);
    };
  }, [syncAuthState]);

  // Выход из системы
  const handleLogout = () => {
    try {
      localStorage.removeItem(SESSION_STORAGE_KEY);
      window.dispatchEvent(new Event(AUTH_EVENT_NAME));
      setCurrentUser(null);
    } catch (e) {
      console.error("Ошибка при выходе из системы:", e);
    }
  };

  // Предотвращение расхождения при гидратации SSR
  if (!isMounted) {
    return (
      <div className={s.authWidget}>
        <div style={{ width: 80, height: 32 }} />
      </div>
    );
  }

  // 1. Состояние: пользователь авторизован
  if (currentUser) {
    const roleMeta = ROLE_CONFIG[currentUser.role] || ROLE_CONFIG.guest;
    const RoleIcon = roleMeta.icon;
    const firstLetter = (currentUser.name || "U").trim().charAt(0).toUpperCase();

    return (
      <div className={s.authWidget}>
        <div className={s.profile} title={`${currentUser.name} (${currentUser.email})`}>
          <div className={s.avatar}>
            {firstLetter || <User size={16} />}
          </div>
          <div className={s.userInfo}>
            <span className={s.userName}>{currentUser.name}</span>
            <span className={`${s.userRole} ${roleMeta.className}`}>
              <RoleIcon size={12} />
              {roleMeta.label}
            </span>
          </div>
        </div>

        {/* Кнопка выхода из системы */}
        <LogOutIconButton
          onClick={handleLogout}
          title="Выйти из аккаунта"
          size={20}
        />
      </div>
    );
  }

  // 2. Состояние: пользователь НЕ авторизован
  return (
    <div className={s.authWidget}>
      <button
        type="button"
        className={s.loginBtn}
        onClick={() => setIsModalOpen(true)}
        title="Войти в систему"
      >
        <LogIn size={16} />
        <span>Войти</span>
      </button>

      {/* Модальное окно входа */}
      <LoginModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onLoginSuccess={(user) => setCurrentUser(user)}
      />
    </div>
  );
}

export default AuthWidget;
