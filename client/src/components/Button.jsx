import styles from "./Button.module.css";

export default function Button({ children, isDisabled, handleClick }) {
  return (
    <button
      className={styles.defaultBtn}
      disabled={isDisabled}
      onClick={handleClick}
    >
      {children}
    </button>
  );
}
