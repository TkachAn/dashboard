// src/base/buttons/IconButtons.jsx
'use client';

import { useState, useEffect } from 'react';
import React, { forwardRef } from "react";
import styles from "./button.module.css";
import {
  Menu,
  X,
  Trash,
  Pencil,
  Plus,
  UserPlus,
  UserPen,
  LogIn,
  LogOut,
  Sun,
  Moon,
} from "lucide-react";




const BaseIconButton = forwardRef(
  ({ onClick, title, children, className = "", ...props }, ref) => (
    <button
      ref={ref}
      onClick={onClick}
      type="button"
      className={`${styles.iconButton} ${className}`.trim()}
      title={title}
      aria-label={title}
      {...props}
    >
      {children}
    </button>
  ),
);

BaseIconButton.displayName = "BaseIconButton";

export const LoginIconButton = forwardRef(({ size = 24, ...props }, ref) => (
  <BaseIconButton ref={ref} {...props} title={props.title || "Войти"}>
    <LogIn size={size} />
  </BaseIconButton>
));
LoginIconButton.displayName = "LoginIconButton";

export const CloseIconButton = forwardRef(({ size = 24, ...props }, ref) => (
  <BaseIconButton ref={ref} {...props} title={props.title || "Закрыть"}>
    <X size={size} />
  </BaseIconButton>
));
CloseIconButton.displayName = "CloseIconButton";

export const DeleteIconButton = forwardRef(({ size = 24, ...props }, ref) => (
  <BaseIconButton ref={ref} {...props} title={props.title || "Удалить"}>
    <Trash size={size} />
  </BaseIconButton>
));
DeleteIconButton.displayName = "DeleteIconButton";

export const EditIconButton = forwardRef(({ size = 24, ...props }, ref) => (
  <BaseIconButton ref={ref} {...props} title={props.title || "Редактировать"}>
    <Pencil size={size} />
  </BaseIconButton>
));
EditIconButton.displayName = "EditIconButton";

export const AddIconButton = forwardRef(({ size = 24, ...props }, ref) => (
  <BaseIconButton ref={ref} {...props} title={props.title || "Добавить"}>
    <Plus size={size} />
  </BaseIconButton>
));
AddIconButton.displayName = "AddIconButton";

export const UserAddIconButton = forwardRef(({ size = 24, ...props }, ref) => (
  <BaseIconButton
    ref={ref}
    {...props}
    title={props.title || "Добавить пользователя"}
  >
    <UserPlus size={size} />
  </BaseIconButton>
));
UserAddIconButton.displayName = "UserAddIconButton";

export const UserEditIconButton = forwardRef(({ size = 24, ...props }, ref) => (
  <BaseIconButton
    ref={ref}
    {...props}
    title={props.title || "Редактировать пользователя"}
  >
    <UserPen size={size} />
  </BaseIconButton>
));
UserEditIconButton.displayName = "UserEditIconButton";

export const MenuIconButton = forwardRef(({ size = 24, ...props }, ref) => (
  <BaseIconButton ref={ref} {...props} title={props.title || "Меню"}>
    <Menu size={size} />
  </BaseIconButton>
));
MenuIconButton.displayName = "MenuIconButton";

const handleSignOut = () => console.log("Выход из системы...");

export const LogOutIconButton = forwardRef(({ size = 24, ...props }, ref) => (
  <BaseIconButton
    ref={ref}
    {...props}
    onClick={props.onClick || handleSignOut}
    title={props.title || "Выход"}
  >
    <LogOut size={size} />
  </BaseIconButton>
));
LogOutIconButton.displayName = "LogOutIconButton";
/*
export function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  // Синхронизируем состояние с текущей темой при загрузке
  useEffect(() => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    setIsDark(currentTheme === 'dark');
  }, []);

  const toggle_Theme = () => {
    const newTheme = isDark ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    setIsDark(!isDark);
  };

  return (
    <BaseIconButton
      onClick={toggle_Theme}
      title={isDark ? "Включить светлую тему" : "Включить тёмную тему"}
    >
      {isDark ? <Sun size={26} color="#FFFF00" /> : <Moon size={26} color="#3B82F6" />}
    </BaseIconButton>
  );
}
*/


export function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  // Синхронизируем состояние с текущей темой или localStorage при загрузке
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem('theme');
      const currentTheme = savedTheme || document.documentElement.getAttribute('data-theme') || 'light';
      const isDarkTheme = currentTheme === 'dark';

      setIsDark(isDarkTheme);
      document.documentElement.setAttribute('data-theme', currentTheme);
    } catch (err) {
      console.warn('Не удалось прочитать тему из localStorage:', err);
    }
  }, []);

  const toggle_Theme = () => {
    const newTheme = isDark ? 'light' : 'dark';

    // 1. Сначала меняем состояние React и атрибут в DOM
    setIsDark(!isDark);
    document.documentElement.setAttribute('data-theme', newTheme);

    // 2. Безопасно сохраняем в localStorage с перехватом ошибки для мобилок
    try {
      localStorage.setItem('theme', newTheme);
    } catch (err) {
      console.warn('LocalStorage недоступен на этом устройстве:', err);
    }
  };

  return (
    <BaseIconButton
      onClick={toggle_Theme}
      title={isDark ? "Включить светлую тему" : "Включить тёмную тему"}
    >
      {isDark ? <Sun size={26} color="#FFFF00" /> : <Moon size={26} color="#3B82F6" />}
    </BaseIconButton>
  );
}