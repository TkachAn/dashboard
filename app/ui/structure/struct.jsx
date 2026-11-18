/* app/ui/structure/struct.jsx */
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Bot, UserPlus } from "lucide-react";
import s from "./s.module.css";

const SESSION_STORAGE_KEY = "current_user";
const USERS_STORAGE_KEY = "smarthome_users";
const AUTH_EVENT_NAME = "smarthome_auth_change";

/**
 * Проверка прав администратора текущего пользователя
 * Проверяет как активную сессию ("current_user"), так и базу пользователей ("smarthome_users").
 */
function checkAdminRole() {
  if (typeof window === "undefined" || !window.localStorage) {
    return false;
  }

  try {
    // 1. Проверяем текущую активную сессию (механизм авторизации AuthWidget)
    const rawSession =
      localStorage.getItem(SESSION_STORAGE_KEY) ||
      sessionStorage.getItem(SESSION_STORAGE_KEY);
    let sessionUser = null;
    let sessionIdentifier = null;

    if (rawSession) {
      try {
        sessionUser = JSON.parse(rawSession);
      } catch {
        sessionIdentifier = rawSession.trim();
        if (sessionIdentifier.toLowerCase() === "admin") return true;
      }
    }

    if (sessionUser && typeof sessionUser === "object") {
      if (sessionUser.role === "admin" || sessionUser.isAdmin === true) {
        return true;
      }
      sessionIdentifier = sessionUser.id || sessionUser.email;
    } else if (typeof sessionUser === "string") {
      sessionIdentifier = sessionUser;
      if (sessionIdentifier.toLowerCase() === "admin") return true;
    }

    // 2. Проверяем данные по ключу "smarthome_users"
    const rawUsers =
      localStorage.getItem(USERS_STORAGE_KEY) ||
      sessionStorage.getItem(USERS_STORAGE_KEY);

    if (rawUsers) {
      try {
        const parsed = JSON.parse(rawUsers);

        // Если smarthome_users — это объект с пользователем/сессией
        if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
          if (parsed.role === "admin" || parsed.isAdmin === true) return true;
          if (
            parsed.currentUser?.role === "admin" ||
            parsed.current_user?.role === "admin" ||
            parsed.activeUser?.role === "admin" ||
            parsed.session?.role === "admin"
          ) {
            return true;
          }

          // Если внутри объекта поле users: [...]
          if (Array.isArray(parsed.users)) {
            const activeId =
              parsed.activeUserId ||
              parsed.currentUserId ||
              sessionIdentifier;
            if (activeId) {
              const matched = parsed.users.find(
                (u) =>
                  u.id === activeId ||
                  u.email?.toLowerCase() === String(activeId).toLowerCase()
              );
              if (matched && matched.role === "admin") return true;
            }
            const activeInList = parsed.users.find(
              (u) => u.isCurrent || u.active || u.isLoggedIn
            );
            if (activeInList && activeInList.role === "admin") return true;
          }
        }

        // Если smarthome_users — это массив пользователей [...]
        if (Array.isArray(parsed)) {
          // Если есть текущий идентификатор из сессии
          if (sessionIdentifier) {
            const normalizedId = String(sessionIdentifier).toLowerCase();
            const matched = parsed.find(
              (u) =>
                (u.id && String(u.id).toLowerCase() === normalizedId) ||
                (u.email && u.email.toLowerCase() === normalizedId)
            );
            if (matched && matched.role === "admin") return true;
          }

          // Если один из пользователей помечен как активный/текущий
          const activeUser = parsed.find(
            (u) => u.isCurrent || u.active || u.isLoggedIn || u.current
          );
          if (activeUser && activeUser.role === "admin") return true;
        }
      } catch (err) {
        console.warn("Ошибка парсинга smarthome_users:", err);
      }
    }

    return false;
  } catch (err) {
    console.warn("Ошибка при проверке прав администратора:", err);
    return false;
  }
}

export function Container({ children, className }) {
  return <div className={`${s.container} ${className || ""}`}>{children}</div>;
}

export function Header({
  children,
  id,
  title,
  className,
  onAddUser,
  addUserHref = "/pages/users",
}) {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const updateAdminStatus = () => {
      setIsAdmin(checkAdminRole());
    };

    updateAdminStatus();

    window.addEventListener("storage", updateAdminStatus);
    window.addEventListener(AUTH_EVENT_NAME, updateAdminStatus);

    return () => {
      window.removeEventListener("storage", updateAdminStatus);
      window.removeEventListener(AUTH_EVENT_NAME, updateAdminStatus);
    };
  }, []);

  const handleAddUserClick = (e) => {
    e?.preventDefault();
    if (onAddUser) {
      onAddUser();
    } else {
      router.push(addUserHref);
    }
  };

  return (
    <header id={id} title={title} className={s.header_wrapper}>
      <div className={`${s.header} ${className || ""}`.trim()}>
        {children}
        {isAdmin && (
          <button
            type="button"
            onClick={handleAddUserClick}
            className={s.addUserBtn}
            title="Добавить пользователя"
            aria-label="Добавить пользователя"
          >
            <UserPlus size={24} />
          </button>
        )}
      </div>
    </header>
  );
}
export function Sidebar({ children, id, className }) {
  return (
    <aside id={id} className={`${s.sidebar} ${className || ""}`}>
      {children}
    </aside>
  );
}


export function Wrapper({ id, children, className }) {
  return (
    <div id={id} className={`${s.main_wrapper} ${className || ""}`}>
      {children}
    </div>
  );
}

export function Main({ children, id, className }) {
  return (
    <main id={id} className={`${s.main} ${className || ""}`}>
      {children}
    </main>
  );
}

export function Section({ children, title, id, className }) {
  return (
    <section
      id={id}
      className={`${s.section} ${className || ""}`}
      title={title}
    >
      {title && <h2 className={s.section_title}>{title}</h2>}
      {children}
    </section>
  );
}

export function Article({ children, title, id, className }) {
  return (
    <article
      id={id}
      className={`${s.article} ${className || ""}`}
      title={title}
    >
      {title && <h3 className={s.article_title}>{title}</h3>}
      {children}
    </article>
  );
}
export function Card({ children, id, className, title }) {
  return (
    <div id={id} className={`${s.card} ${className || ""}`}>
      {title && <h4 className={s.card_title}>{title}</h4>}
      {children}
    </div>
  );
}
export function Panel({ children, id, className, title, icon = <Bot /> }) {
  return (
    <div id={id} className={`${s.panel} ${className || ""}`}>
      <div className={s.flex}>
        {title && <h5 className={s.panel_title}>{title}</h5>}
        {icon && icon}
      </div>
      {children}
    </div>
  );
}

