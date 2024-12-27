import React from "react";
import styles from "./Navbar.module.scss";
import Image from "next/image";
import logoImg from "../../../assets/images/arka.png";
import { FaArrowRightLong } from "react-icons/fa6";
import { useSession } from "next-auth/react";
import UserBox from "../../UserBox/UserBox";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const { data: session } = useSession();
  const router = useRouter();

  return (
    <div className={styles.Navbar}>
      <div className={styles.navLogo}>
        <Image src={logoImg} alt="logo" className={styles.navLogoImg} />
      </div>

      <div className={styles.authBtn}>
        {session ? (
          <>
            <Image
              src={session.user.image}
              alt="logo"
              className={styles.navLogoImg}
              width={50}
              height={50}
            />
          </>
        ) : (
          <>
            <button onClick={() => router.push("/signIn")}>
              <span>Sign In</span>{" "}
              <FaArrowRightLong className={styles.signInArrow} />{" "}
            </button>
          </>
        )}
      </div>

      {session && (
        <>
          <div className={styles.userBoxWrapper}>
            <UserBox />
          </div>
        </>
      )}
    </div>
  );
};

export default Navbar;
