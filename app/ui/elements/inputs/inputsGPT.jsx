/* inputsGPT.jsx */
import { useState, useEffect, forwardRef, useRef } from "react";
import { Eye, EyeOff } from "lucide-react";
import styles from "./ingpt.module.css";

/* =========================
   VALIDATORS
========================= */
const validators = {
  email: (v) =>
    !v
      ? "Email обязателен"
      : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
        ? "Некорректный email"
        : "",

  password: (v) => {
    if (!v) return "Пароль обязателен";
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return passwordRegex.test(v)
      ? ""
      : "Пароль должен содержать минимум 8 символов, заглавную букву, строчную букву и цифру";
  },
  phone: (v, country = "UA") => {
    if (!v) return "Номер телефона обязателен";

    const cleanV = v.replace(/\D/g, ""); // Убираем всё кроме цифр для проверки длины

    const formats = {
      UA: { regex: /^380\d{9}$/, msg: "Формат: 380XXXXXXXXX" },
      RU: { regex: /^7\d{10}$/, msg: "Формат: 7XXXXXXXXXX" },
      USA: { regex: /^1\d{10}$/, msg: "Формат: 1XXXXXXXXXX" },
    };

    const config = formats[country] || {
      regex: /^\d{10,15}$/,
      msg: "Неверный формат",
    };

    return config.regex.test(cleanV) ? "" : config.msg;
  },
  digits: (v) => {
    if (!v) return "";
    if (!/^\d+$/.test(v)) return "Только цифры";
    if (/^0\d+/.test(v)) return "Число не может начинаться с 0";
    return "";
  },

  integer: (v) => {
    if (!v) return "";
    if (!/^\d+$/.test(v)) return "Только целые числа";
    if (v.length > 1 && v.startsWith("0"))
      return "Число не может начинаться с 0";
    return "";
  },

  float: (v) => {
    if (!v) return "";
    if (!/^\d*[.,]?\d*$/.test(v)) return "Некорректный формат";
    return "";
  },
};

/* =========================
   BASE LAYOUT
========================= */
const BaseInput = ({
  label,
  error,
  value,
  name,
  required,
  onStatusChange,
  children,
}) => {
  // Этот эффект сообщает форме, валидно ли поле, каждый раз при изменении ошибки или значения
  useEffect(() => {
    if (onStatusChange && name) {
      const isValid = required
        ? error === "" && value?.toString().trim() !== ""
        : error === "";
      onStatusChange(name, isValid);
    }
  }, [error, value, name, required, onStatusChange]);

  return (
    <div className={styles.base}>
      {label && <label className={styles.label}>{label}</label>}
      <div className={styles.control}>
        {children}
        {error && <span className={styles.error}>{error}</span>}
      </div>
    </div>
  );
};

/* =========================
   CONFIRM BLOCK
========================= */
const ConfirmBlock = ({
  value,
  confirmLabel = "Подтвердите",
  onValueChange, // Для передачи значения во внешний инпут
  errorMessage = "Значения не совпадают",
  type = "text",
  children,
}) => {
  const [confirmValue, setConfirmValue] = useState("");
  const [error, setError] = useState("");

  // Следим за изменениями первого поля (value)
  useEffect(() => {
    if (confirmValue) {
      const isMatch = confirmValue === value;
      setError(isMatch ? "" : errorMessage);
      onValueChange?.(confirmValue, isMatch);
    }
  }, [value]);

  const handleConfirm = (v) => {
    setConfirmValue(v);
    const isMatch = v === value;
    setError(isMatch ? "" : errorMessage);
    onValueChange?.(v, isMatch);
  };

  return (
    <div className={styles.confirmGroup}>
      {children}
      <input
        type={type}
        className={styles.input}
        placeholder={confirmLabel}
        value={confirmValue}
        onChange={(e) => handleConfirm(e.target.value)}
      />
      {error && <div className={styles.error}>{error}</div>}
    </div>
  );
};

/* =========================
   TEXT INPUT (Smart Modes)
========================= */
export const TextInput = forwardRef(
  (
    {
      label,
      error: externalError, // Ошибка, которая может прийти снаружи (от сервера, например)
      onChange,
      value,
      defaultValue,
      mode,
      onStatusChange, // Приходит от Forma
      name, // Важно для отчета
      required, // Важно для валидности
      ...props
    },
    ref,
  ) => {
    const isControlled = value !== undefined;
    const [localValue, setLocalValue] = useState(defaultValue || "");
    const [internalError, setInternalError] = useState(""); // Локальная ошибка (например, "Обязательное поле")
    const currentValue = isControlled ? value : localValue;
    const nextUpperRef = useRef(false);

    const handleChange = (e) => {
      let char = e.target.value.slice(-1);
      let v = e.target.value;

      if (mode === "camelCase") {
        if (char === " ") {
          nextUpperRef.current = true;
          v = v.slice(0, -1);
        } else if (nextUpperRef.current) {
          v = v.slice(0, -1) + char.toUpperCase();
          nextUpperRef.current = false;
        }
      } else if (mode === "snake_case") {
        v = v.replace(/\s/g, "_");
      } else {
        // Режим Default: 
        // 1. Убираем пробелы в начале
        v = v.replace(/^\s+/, "");
        // 2. Схлопываем двойные пробелы в один
        v = v.replace(/\s\s+/g, " ");
      }

      if (!isControlled) setLocalValue(v);
      if (required) {
        setInternalError(
          v.trim() === "" ? "Поле обязательно для заполнения" : "",
        );
      }
      if (onChange) {
        const event = Object.create(e);
        event.target = { ...e.target, value: v };
        onChange(event);
      }
    };

    const handleBlur = (e) => {
      const v = e.target.value.trim();
      if (!isControlled) setLocalValue(v);
      if (onChange) {
        const event = Object.create(e);
        event.target = { ...e.target, value: v };
        onChange(event);
      }
    };

    return (
      <BaseInput
        label={label}
        error={externalError || internalError}
        onStatusChange={onStatusChange}
        name={name}
        required={required}
      >
        <input
          ref={ref}
          name={name}
          className={styles.input}
          value={currentValue}
          onChange={handleChange}
          onBlur={handleBlur}
          {...props}
        />
      </BaseInput>
    );
  },
);

/* =========================
   TEXTAREA
========================= */
export const TextAreaInput = forwardRef(
  (
    { label, error, rows = 4, onChange, value, defaultValue, ...props },
    ref,
  ) => {
    const isControlled = value !== undefined;
    const [localValue, setLocalValue] = useState(defaultValue || "");
    const currentValue = isControlled ? value : localValue;

    const handleBlur = (e) => {
      const cleaned = e.target.value
        .trim()
        .replace(/\n+/g, "\n") // Схлопываем переносы (Enter) в один
        .replace(/[ ]+/g, " ");
      if (!isControlled) setLocalValue(cleaned);
      if (onChange) {
        const event = Object.create(e);
        event.target = { ...e.target, value: cleaned };
        onChange(event);
      }
    };

    return (
      <BaseInput label={label} error={error}>
        <textarea
          ref={ref}
          className={styles.textarea}
          rows={rows}
          value={currentValue}
          onChange={(e) => {
            if (!isControlled) setLocalValue(e.target.value);
            onChange?.(e);
          }}
          onBlur={handleBlur}
          {...props}
        />
      </BaseInput>
    );
  },
);

/* =========================
   SELECT
========================= */
export const SelectInput = forwardRef(
  (
    { label, error, options = [], value, defaultValue, onChange, ...props },
    ref,
  ) => {
    const isControlled = value !== undefined;
    const normalizedOptions = options.map((o) =>
      typeof o === "string" ? { label: o, value: o } : o,
    );
    const [localValue, setLocalValue] = useState(
      defaultValue || normalizedOptions[0]?.value || "",
    );
    const currentValue = isControlled ? value : localValue;

    return (
      <BaseInput label={label} error={error}>
        <select
          ref={ref}
          className={styles.select}
          value={currentValue}
          onChange={(e) => {
            if (!isControlled) setLocalValue(e.target.value);
            onChange?.(e);
          }}
          {...props}
        >
          {normalizedOptions.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </BaseInput>
    );
  },
);
/*==========================
  PHONE INPUT
==========================*/
export const PhoneInput = forwardRef(
  (
    {
      label = "Телефон",
      name,
      value,
      defaultValue,
      onChange,
      onStatusChange,
      required,
      country = "UA", // По умолчанию Украина
      ...props
    },
    ref,
  ) => {
    const isControlled = value !== undefined;
    const [localValue, setLocalValue] = useState(defaultValue || "");
    const [error, setError] = useState("");
    const currentValue = isControlled ? value : localValue;

    const handleChange = (e) => {
      // Разрешаем только цифры и плюс
      let v = e.target.value.replace(/[^\d+]/g, "");

      if (!isControlled) setLocalValue(v);
      setError(validators.phone(v, country));

      if (onChange) {
        const event = Object.create(e);
        event.target = { ...e.target, value: v };
        onChange(event);
      }
    };

    // Авто-подстановка кода страны, если поле пустое
    const handleFocus = (e) => {
      if (!currentValue) {
        const codes = { UA: "+380", RU: "+7", USA: "+1" };
        const code = codes[country] || "+";
        if (!isControlled) setLocalValue(code);
      }
    };

    return (
      <BaseInput
        label={label}
        error={error}
        value={currentValue}
        name={name}
        required={required}
        onStatusChange={onStatusChange}
      >
        <input
          ref={ref}
          type="tel"
          name={name}
          className={styles.input}
          value={currentValue}
          onChange={handleChange}
          onFocus={handleFocus}
          placeholder={country === "UA" ? "+380..." : "+..."}
          {...props}
        />
      </BaseInput>
    );
  },
);

export const EmailInput = forwardRef(
  (
    {
      label = "Email",
      confirm,
      value,
      defaultValue,
      onChange,
      onStatusChange,
      name,
      required,
      ...props
    },
    ref,
  ) => {
    const isControlled = value !== undefined;
    const [localValue, setLocalValue] = useState(defaultValue || "");
    const [confirmVal, setConfirmVal] = useState(""); // Значение из второго поля
    const [isMatch, setIsMatch] = useState(false); // Совпадают ли адреса
    const [error, setError] = useState("");
    const [showLangHint, setShowLangHint] = useState(false);

    const currentValue = isControlled ? value : localValue;

    // Ключевой момент: если нужен конфирм, BaseInput получит значение
    // только если второй инпут совпадает с первым. Иначе — пустота.
    const valueForForm = confirm ? (isMatch ? confirmVal : "") : currentValue;

    const handleChange = (e) => {
      const v = e.target.value;
      if (!isControlled) setLocalValue(v);

      // Проверка на кириллицу
      setShowLangHint(/[а-яА-ЯёЁ]/.test(v));

      setError(validators.email(v));
      onChange?.(e);
    };

    const inputEl = (
      <div className={styles.control}>
        <input
          ref={ref}
          type="email"
          inputMode="email"
          name={name}
          className={styles.input}
          value={currentValue}
          onChange={handleChange}
          {...props}
        />
        {showLangHint && (
          <div className={styles.hint}>
            Пожалуйста, переключите раскладку на английскую
          </div>
        )}
      </div>
    );

    return (
      <BaseInput
        label={label}
        error={error}
        value={valueForForm} // Форма теперь зависит от этого значения
        name={name}
        required={required}
        onStatusChange={onStatusChange}
      >
        {confirm ? (
          <ConfirmBlock
            value={currentValue}
            confirmLabel="Подтвердите Email"
            onValueChange={(val, match) => {
              setConfirmVal(val);
              setIsMatch(match);
            }}
          >
            {inputEl}
          </ConfirmBlock>
        ) : (
          inputEl
        )}
      </BaseInput>
    );
  },
);

export const PasswordInput = forwardRef(
  (
    {
      label = "Пароль",
      confirm,
      mode = "create", // 'create' или 'login'
      value,
      defaultValue,
      onChange,
      onStatusChange,
      name,
      required,
      ...props
    },
    ref,
  ) => {
    const isControlled = value !== undefined;
    const [localValue, setLocalValue] = useState(defaultValue || "");
    const [confirmVal, setConfirmVal] = useState(""); // Внутренний стейт для второго поля
    const [isMatch, setIsMatch] = useState(false);
    const [visible, setVisible] = useState(false);
    const [error, setError] = useState("");
    const [showLangHint, setShowLangHint] = useState(false);

    const currentValue = isControlled ? value : localValue;

    // Если есть конфирм, отдаем в форму значение только если оно совпало.
    // Иначе отдаем пустоту, чтобы сработал required и кнопка заблокировалась.
    const valueForForm = confirm ? (isMatch ? confirmVal : "") : currentValue;

    const handleChange = (e) => {
      const v = e.target.value;
      if (!isControlled) setLocalValue(v);

      // Проверка на кириллицу
      setShowLangHint(/[а-яА-ЯёЁ]/.test(v));

      // Если режим login — не валидируем на сложность
      setError(mode === "login" ? "" : validators.password(v));

      onChange?.(e);
    };

    const inputType = visible ? "text" : "password";
    const inputEl = (
      <div className={styles.control}>
        <div className={styles.passwordWrap}>
          <input
            ref={ref}
            type={inputType}
            name={name}
            className={styles.input}
            value={currentValue}
            onChange={handleChange}
            {...props}
          />
          <button
            type="button"
            className={styles.toggle}
            onClick={() => setVisible(!visible)}
          >
            {visible ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {showLangHint && (
          <div className={styles.hint}>
            Пожалуйста, переключите раскладку на английскую
          </div>
        )}
      </div>
    );

    return (
      <BaseInput
        label={label}
        error={error}
        value={valueForForm} // Теперь форма смотрит сюда
        name={name}
        required={required}
        onStatusChange={onStatusChange}
      >
        {confirm ? (
          <ConfirmBlock
            value={currentValue}
            type={inputType}
            confirmLabel="Подтвердите пароль"
            onValueChange={(val, match) => {
              setConfirmVal(val);
              setIsMatch(match);
            }}
          >
            {inputEl}
          </ConfirmBlock>
        ) : (
          inputEl
        )}
      </BaseInput>
    );
  },
);
/* =========================
   INTEGER INPUT (Только целые)
========================= */
export const IntegerInput = forwardRef(
  ({ label, value, defaultValue, onChange, ...props }, ref) => {
    const isControlled = value !== undefined;
    const [localValue, setLocalValue] = useState(defaultValue || "");
    const [error, setError] = useState("");
    const currentValue = isControlled ? value : localValue;

    const handleChange = (e) => {
      let v = e.target.value.replace(/\D/g, "");
      if (v.length > 1 && v.startsWith("0")) {
        v = v.replace(/^0+/, "") || "0";
      }
      if (!isControlled) setLocalValue(v);
      setError(validators.integer(v));
      if (onChange) {
        const event = Object.create(e);
        event.target = { ...e.target, value: v };
        onChange(event);
      }
    };

    return (
      <BaseInput label={label} error={error}>
        <input
          ref={ref}
          className={styles.input}
          inputMode="numeric"
          pattern="[0-9]*"
          value={currentValue}
          onChange={handleChange}
          {...props}
        />
      </BaseInput>
    );
  },
);

/* =========================
   DIGITS & FLOAT INPUT
========================= */
export const DigitsInput = forwardRef(
  ({ label, value, defaultValue, onChange, decimal, ...props }, ref) => {
    const isControlled = value !== undefined;
    const [localValue, setLocalValue] = useState(defaultValue || "");
    const [error, setError] = useState("");
    const currentValue = isControlled ? value : localValue;

    const handleChange = (e) => {
      let v = e.target.value;

      if (decimal) {
        v = v.replace(",", ".");
        // 1. Если начали с точки -> "0."
        if (v === ".") v = "0.";
        // Умная обработка: 00 -> 0.0, 01 -> 0.1
        if (/^0[0-9]/.test(v)) {
          v = "0." + v.slice(1);
        }
        v = v.replace(/[^0-9.]/g, "");
        const parts = v.split(".");
        if (parts.length > 2) v = parts[0] + "." + parts.slice(1).join("");
        setError(validators.float(v));
      } else {
        v = v.replace(/\D/g, "");
        if (v.length > 1 && v.startsWith("0")) v = v.replace(/^0+/, "") || "0";
        setError(validators.digits(v));
      }

      if (!isControlled) setLocalValue(v);
      if (onChange) {
        const event = Object.create(e);
        event.target = { ...e.target, value: v };
        onChange(event);
      }
    };

    return (
      <BaseInput label={label} error={error}>
        <input
          ref={ref}
          className={styles.input}
          inputMode={decimal ? "decimal" : "numeric"}
          value={currentValue}
          onChange={handleChange}
          {...props}
        />
      </BaseInput>
    );
  },
);

export const FloatInput = (props) => <DigitsInput {...props} decimal={true} />;

export const PriceInput = forwardRef(
  (
    {
      label = "Цена",
      onChange,
      error,
      defaultValue,
      locale = "ru-RU",
      currency = "RUB",
    },
    ref,
  ) => {
    // Инициализируем состояние из defaultValue (переводим в "копейки")
    const [digits, setDigits] = useState(
      defaultValue ? String(Math.round(defaultValue * 100)) : "",
    );

    const inputRef = useRef(null);

    // Универсальный форматировщик
    const formatter = new Intl.NumberFormat(locale, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    const formatDisplay = (d) => {
      if (!d) return formatter.format(0);
      const numericValue = Number(d) / 100;
      return formatter.format(numericValue);
    };

    const handleChange = (e) => {
      const input = e.target;
      const selectionStart = input.selectionStart;
      const oldLength = input.value.length;

      const d = input.value.replace(/\D/g, "");
      setDigits(d);

      if (onChange) {
        onChange(Number(d || 0) / 100);
      }

      // Логика сохранения позиции курсора после перерисовки
      requestAnimationFrame(() => {
        if (inputRef.current) {
          const newLength = inputRef.current.value.length;
          const newPosition = selectionStart + (newLength - oldLength);
          inputRef.current.setSelectionRange(newPosition, newPosition);
        }
      });
    };

    return (
      <BaseInput label={label} error={error}>
        <input
          ref={(node) => {
            inputRef.current = node;
            if (typeof ref === "function") ref(node);
            else if (ref) ref.current = node;
          }}
          className={styles.input}
          inputMode="numeric"
          value={formatDisplay(digits)}
          onChange={handleChange}
        />
      </BaseInput>
    );
  },
);

/* =========================
   EMAIL / PASSWORD
========================= *//*
export const EmailInput = forwardRef(
  (
    {
      label = "E-mail",
      confirm,
      value,
      defaultValue,
      onChange,
      onStatusChange, // Приходит от Forma
      name, // Важно для отчета
      required, // Важно для валидности
      ...props
    },
    ref,
  ) => {
    const isControlled = value !== undefined;
    const [localValue, setLocalValue] = useState(defaultValue || "");
    const [error, setError] = useState("");
    const currentValue = isControlled ? value : localValue;

    const handleChange = (e) => {
      const v = e.target.value.replace(/\s/g, "");
      if (!isControlled) setLocalValue(v);
      setError(validators.email(v));
      onChange?.(e);
    };

    const inputEl = (
      <input
        ref={ref}
        type="email"
        name={name} // Обязательно передаем name в сам input
        className={styles.input}
        value={currentValue}
        onChange={handleChange}
        {...props}
      />
    );
    return (
      <BaseInput
        label={label}
        error={error}
        value={currentValue}
        name={name}
        required={required}
        onStatusChange={onStatusChange}
      >
        {confirm ? (
          <ConfirmBlock value={currentValue} confirmLabel="Подтвердите e-mail">
            {inputEl}
          </ConfirmBlock>
        ) : (
          inputEl
        )}
      </BaseInput>
    );
  },
);*/
/* =========================
   PRICE INPUT
========================= *
export const PriceInput = forwardRef(
  ({ label = "Цена", onChange, error, defaultValue }, ref) => {
    const [digits, setDigits] = useState(
      defaultValue ? String(Math.round(defaultValue * 100)) : "",
    );

    const formatDisplay = (d) => {
      if (!d) return "0.00";
      const clean = d.padStart(3, "0");
      return `${Number(clean.slice(0, -2)).toLocaleString("ru-RU")}.${clean.slice(-2)}`;
    };

    const handleChange = (e) => {
      const d = e.target.value.replace(/\D/g, "");
      setDigits(d);
      onChange?.(Number(d || 0) / 100);
    };

    return (
      <BaseInput label={label} error={error}>
        <input
          ref={ref}
          className={styles.input}
          inputMode="numeric"
          value={formatDisplay(digits)}
          onChange={handleChange}
        />
      </BaseInput>
    );
  },
);*/
/*
const ConfirmBlock = ({
  value,
  confirmLabel = "Подтвердите",
  onValidChange,
  errorMessage = "Значения не совпадают",
  type = "text",
  children,
}) => {
  const [confirmValue, setConfirmValue] = useState("");
  const [error, setError] = useState("");

  const handleConfirm = (v) => {
    setConfirmValue(v);
    const isMatch = v === value;
    setError(isMatch ? "" : errorMessage);
    onValidChange?.(isMatch);
  };

  return (
    <div className={styles.confirmGroup}>
      {children}
      <input
        type={type}
        className={styles.input}
        placeholder={confirmLabel}
        value={confirmValue}
        onChange={(e) => handleConfirm(e.target.value)}
      />
      {error && <div className={styles.error}>{error}</div>}
    </div>
  );
};*
const ConfirmBlock = ({
  value,
  confirmLabel = "Подтвердите",
  onValueChange,
  errorMessage = "Значения не совпадают",
  type = "text",
  children,
}) => {
  const [confirmValue, setConfirmValue] = useState("");
  const [error, setError] = useState("");

  // Этот эффект следит за изменением ПЕРВОГО поля
  useEffect(() => {
    if (confirmValue) {
      // Проверяем только если во втором поле уже что-то есть
      const isMatch = confirmValue === value;
      setError(isMatch ? "" : errorMessage);
      onValueChange?.(confirmValue, isMatch);
    }
  }, [value]); // Следим за value из первого инпута

  const handleConfirm = (v) => {
    setConfirmValue(v);
    const isMatch = v === value;
    setError(isMatch ? "" : errorMessage);
    onValueChange?.(v, isMatch);
  };

  return (
    <div className={styles.confirmGroup}>
      {children}
      <input
        type={type}
        className={styles.input}
        placeholder={confirmLabel}
        value={confirmValue}
        onChange={(e) => handleConfirm(e.target.value)}
      />
      {error && <div className={styles.error}>{error}</div>}
    </div>
  );
};*/

/*
export const PasswordInput = forwardRef(
  (
    {
      label = "Пароль",
      confirm,
      value,
      defaultValue,
      onChange,
      onStatusChange,
      name,
      required,
      ...props
    },
    ref,
  ) => {
    const isControlled = value !== undefined;
    const [localValue, setLocalValue] = useState(defaultValue || "");
    const [visible, setVisible] = useState(false);
    const [error, setError] = useState("");
    const currentValue = isControlled ? value : localValue;

    const handleChange = (e) => {
      const v = e.target.value;
      if (!isControlled) setLocalValue(v);
      setError(validators.password(v));
      onChange?.(e);
    };

    const inputType = visible ? "text" : "password";
    const inputEl = (
      <div className={styles.passwordWrap}>
        <input
          ref={ref}
          type={inputType}
          name={name}
          className={styles.input}
          value={currentValue}
          onChange={handleChange}
          {...props}
        />
        <button
          type="button"
          className={styles.toggle}
          onClick={() => setVisible(!visible)}
        >
          {visible ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    );

    return (
      <BaseInput
        label={label}
        error={error}
        value={currentValue}
        name={name}
        required={required}
        onStatusChange={onStatusChange}
      >
        {confirm ? (
          <ConfirmBlock
            value={currentValue}
            type={inputType}
            confirmLabel="Подтвердите пароль"
          >
            {inputEl}
          </ConfirmBlock>
        ) : (
          inputEl
        )}
      </BaseInput>
    );
  },
);
*/