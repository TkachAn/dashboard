import React from "react";
import styles from "./ingpt.module.css";
import clsx from "clsx";

export const Toggle = ({
  id = 1,
  label = "1",
  checked = false,
  onChange = () => { },
  state = "normal", // normal, accent, blocked
  disabled = false,
}) => {
  return (
    <div className={clsx(styles.toggleWrapper, styles[state])}>
      <label className={styles.toggleLabel}>
        {label && <span className={styles.toggleText}>{label}</span>}
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className={styles.toggleInput}
        />
        <span className={styles.toggleSlider}></span>
      </label>
    </div>
  );
};


/*
import React, { useState } from "react";
import { Toggle } from "@/elements/inputs";

const PowerSwitch = () => {
  const [isOn, setIsOn] = useState(false);

  return (
    <Toggle
      id="power"
      label="Включить систему"
      checked={isOn}
      onChange={() => setIsOn(!isOn)}
      state={isOn ? "accent" : "normal"}
    />
  );
};


*/