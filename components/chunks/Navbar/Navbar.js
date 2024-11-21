import React from "react";
import styles from "./Navbar.module.scss";
import Image from "next/image";
import logoImg from "../../../assets/images/arka.png";
import { FaArrowRightLong } from "react-icons/fa6";

const Navbar = () => {
  return (
    <div className={styles.Navbar}>
      <div className={styles.navLogo}>
        <Image src={logoImg} alt="logo" className={styles.navLogoImg} />
      </div>

      <div className={styles.authBtn}>
        <button>
          <span>Sign In</span>{" "}
          <FaArrowRightLong className={styles.signInArrow} />{" "}
        </button>
      </div>
    </div>
  );
};

export default Navbar;
