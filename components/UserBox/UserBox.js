import React from "react";
import styles from "./UserBox.module.scss";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";

const UserBox = () => {
  const { data: session } = useSession();

  return (
    <div className={styles.UserBox}>
      <h4>{session?.user.name}</h4>
      <p> {session?.user.email} </p>

      <div className={styles.userBoxbtn}>
        <button onClick={() => signOut()}>Logout</button>
      </div>
    </div>
  );
};

export default UserBox;
