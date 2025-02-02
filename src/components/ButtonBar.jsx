import styles from "./ButtonBar.module.css";
import Button from "./Button";
import { NavLink } from "react-router";
import { useAll } from "../contexts/AllContext";

export default function ButtonBar() {
  const { logIn } = useAll();

  return (
    <div className={styles.buttonBar}>
      <NavLink to="/">
        <Button isDisabled={!logIn}>My Room</Button>
      </NavLink>
      <NavLink to="/generate">
        <Button isDisabled={!logIn}>Generate Collection</Button>
      </NavLink>
      <NavLink to="/market">
        <Button isDisabled={!logIn}>Market Place</Button>
      </NavLink>
    </div>
  );
}
