import styles from "./ConnectWallet.module.css";

import {
  useConnect,
  useAccount,
  useDisconnect,
  useEnsAvatar,
  useEnsName,
} from "wagmi";

export function ConnectWallet() {
  const { isConnected } = useAccount();
  if (isConnected) return <Account />;
  return (
    <>
      <WalletOptions />
    </>
  );
}

export function WalletOptions() {
  const { connectors, connect } = useConnect();

  return connectors.map((connector) => (
    <button
      className={styles.btn}
      key={connector.uid}
      onClick={() => connect({ connector })}
    >
      {connector.name}
    </button>
  ));
}

export function Account() {
  const { address } = useAccount();
  const { disconnect } = useDisconnect();
  const { data: ensName } = useEnsName({ address });
  const { data: ensAvatar } = useEnsAvatar({ name: ensName });

  return (
    <div>
      {/* {ensAvatar && <img alt="ENS Avatar" src={ensAvatar} />} */}
      {/* {address && <div>{ensName ? `${ensName} (${address})` : address}</div>} */}
      <button className={styles.btn} onClick={() => disconnect()}>
        Disconnect
      </button>
    </div>
  );
}

export function AccountAddress() {
  const { address } = useAccount();
  return <div className={styles.accountBox}>{address}</div>;
}
