"use client";
import React, { useState, useCallback, useMemo } from "react";
import s from "./f.module.css";
import { SubmitButton } from "../buttons/buttons";

export function Forma({ 
  children, 
  onSubmit, 
  submitText = "Продолжить", 
  socialButtons, 
  className = "" 
}) {
  const [loading, setLoading] = useState(false);
  // Храним статусы валидности каждого поля: { email: true, password: false }
  const [fieldsStatus, setFieldsStatus] = useState({});

  // Функция, которую вызывают инпуты (через BaseInput)
  const reportStatus = useCallback((name, isValid) => {
    setFieldsStatus((prev) => {
      // Чтобы избежать лишних ререндеров, обновляем только если статус реально изменился
      if (prev[name] === isValid) return prev;
      return { ...prev, [name]: isValid };
    });
  }, []);

  // Итоговая валидность формы: проверяем, что все зарегистрированные поля = true
  const isFormValid = useMemo(() => {
    const statuses = Object.values(fieldsStatus);
    if (statuses.length === 0) return false; // Если полей нет, кнопка заблокирована
    return statuses.every((status) => status === true);
  }, [fieldsStatus]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (loading || !isFormValid) return;

    setLoading(true);
    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      if (onSubmit) await onSubmit(data);
    } finally {
      setLoading(false);
    }
  };

  // Клонируем дочерние элементы и подмешиваем им onStatusChange
  const enhancedChildren = React.Children.map(children, (child) => {
    if (React.isValidElement(child) && child.props.name) {
      return React.cloneElement(child, {
        onStatusChange: reportStatus,
      });
    }
    return child;
  });

  return (
    <form className={`${s.form} ${className}`} onSubmit={handleSubmit} noValidate>
      <div className={s.fields}>{enhancedChildren}</div>
      
      <div className={s.actions}>
        <SubmitButton 
          // Кнопка активна только если форма валидна и не идет загрузка
          status={loading ? "blocked" : (isFormValid ? "accent" : "blocked")}
        >
          {loading ? "Загрузка..." : submitText}
        </SubmitButton>
      </div>

      {socialButtons && (
        <div className={s.socialSection}>
          <div className={s.divider}><span>или через</span></div>
          <div className={s.socialGrid}>{socialButtons}</div>
        </div>
      )}
    </form>
  );
}