import styles from "./NftCard.module.css";

export default function NftCard({ imageUrl }) {
  return (
    <div className={styles.cardBody}>
      <img src={imageUrl} alt="image 1" />
      <label>Collection:</label>
      <label>#Order</label>
      <label>Owner:</label>
    </div>
  );
}
