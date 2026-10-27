import React from "react";
import styles from "./Checkbox.module.css";

export const Checkbox = ({
  id,
  label,
  checked,
  onChange,
  disabled = false,
}) => {
  return (
    <label className={styles.wrapper}>
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className={styles.checkbox}
      />
      <span className={styles.custom}></span>
      <span className={styles.labelText}>{label}</span>
    </label>
  );
};


/*

import React, { useState } from "react";
import { Checkbox } from "@/elements/inputs";

const Example = () => {
  const [isChecked, setIsChecked] = useState(false);

  return (
    <Checkbox
      id="agree"
      label="Я согласен с условиями"
      checked={isChecked}
      onChange={(e) => setIsChecked(e.target.checked)}
    />
  );
};


*/