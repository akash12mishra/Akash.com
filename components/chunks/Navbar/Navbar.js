import React, { useState, useEffect } from "react";
import styles from "./Navbar.module.scss";
import Image from "next/image";
import logoImg from "../../../assets/images/arka.png";
import { FaArrowRightLong } from "react-icons/fa6";
import { useSession } from "next-auth/react";
import UserBox from "../../UserBox/UserBox";
import { useRouter } from "next/navigation";
import { FaGithub } from "react-icons/fa";

const Navbar = () => {
  // const { data: session } = useSession();
  // const router = useRouter();

  const [showUserBox, setShowUserBox] = useState(false);

  const handleImageClick = (e) => {
    e.stopPropagation();
    setShowUserBox(!showUserBox);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showUserBox) {
        setShowUserBox(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [showUserBox]);

  return (
    <div className={styles.Navbar}>
      <div className={styles.navLogo}>
        <Image src={logoImg} alt="logo" className={styles.navLogoImg} />
      </div>

      <div className={styles.authBtn}>
        <button
          onClick={() =>
            window.open(
              "https://github.com/arkalal",
              "_blank",
              "noopener,noreferrer"
            )
          }
        >
          <span>Follow</span> <FaGithub className={styles.signInArrow} />{" "}
        </button>
      </div>

      {/* {session && showUserBox && (
        <>
          <div className={styles.userBoxWrapper}>
            <UserBox />
          </div>
        </>
      )} */}
    </div>
  );
};

export default Navbar;
