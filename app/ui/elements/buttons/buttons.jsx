// src/base/buttons/buttons.jsx
"use client";
import { forwardRef } from "react";
import styles from "./button.module.css";

const BaseButton = forwardRef(
  (
    {
      onClick,
      children,
      status = "normal",
      type = "button",
      className = "",
      ...props
    },
    ref,
  ) => {
    const buttonClasses =
      `${styles.baseButton} ${styles[status] || ""} ${className}`.trim();

    return (
      <button
        ref={ref}
        onClick={onClick}
        type={type}
        className={buttonClasses}
        disabled={status === "blocked"}
        {...props}
      >
        {children}
      </button>
    );
  },
);

BaseButton.displayName = "BaseButton";

export const NormButton = forwardRef((props, ref) => (
  <BaseButton ref={ref} {...props} />
));
NormButton.displayName = "NormButton";

export const SubmitButton = forwardRef(({ children, ...props }, ref) => (
  <BaseButton ref={ref} type="submit" status="accent" {...props}>
    {children || "Сохранить"}
  </BaseButton>
));
SubmitButton.displayName = "SubmitButton";

export const DeleteButton = forwardRef(({ children, ...props }, ref) => (
  <BaseButton ref={ref} {...props}>
    {children || "Удалить"}
  </BaseButton>
));
DeleteButton.displayName = "DeleteButton";

export const AddButton = forwardRef(({ children, ...props }, ref) => (
  <BaseButton ref={ref} {...props}>
    {children || "Добавить"}
  </BaseButton>
));
AddButton.displayName = "AddButton";

export const EditButton = forwardRef(({ children, ...props }, ref) => (
  <BaseButton ref={ref} {...props}>
    {children || "Изменить"}
  </BaseButton>
));
EditButton.displayName = "EditButton";
