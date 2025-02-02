import styles from "./Button.module.css";

export default function Button({ children, isDisabled }) {
  return (
    <button className={styles.defaultBtn} disabled={isDisabled}>
      {children}
    </button>
  );
}
