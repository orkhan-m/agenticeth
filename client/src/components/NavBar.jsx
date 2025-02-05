import styles from "./NavBar.module.css";
import { ConnectWallet, AccountAddress } from "../hooks/ConnectWallet";
import nftIcon from "../assets/nft_icon.svg";

export default function NavBar() {
  return (
    <>
      <div className={styles.navbar}>
        <img className={styles.nftIcon} src={nftIcon} alt="NFT Icon" />
        <div>
          <ConnectWallet />
        </div>
      </div>
      <div className={styles.addressLine}>
        <AccountAddress className={styles.accountBox} />
      </div>
    </>
  );
}
