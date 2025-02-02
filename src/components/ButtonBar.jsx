import styles from "./ButtonBar.module.css";
import Button from "./Button";

export default function ButtonBar() {
  return (
    <div className={styles.buttonBar}>
      <Button>My Room</Button>
      <Button>Generate Collection</Button>
      <Button>Market Place</Button>
    </div>
  );
}
