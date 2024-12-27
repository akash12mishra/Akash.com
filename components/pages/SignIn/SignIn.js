"use client";

import React, { useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import styles from "./SignIn.module.scss";
import codeImg from "../../../assets/images/codeService.png";
import arkaImg from "../../../assets/images/arka.png";
import { FaGoogle } from "react-icons/fa";
import { useRouter } from "next/navigation";

const SignIn = () => {
  const { data: session } = useSession();
  const router = useRouter();

  console.log("session", session);

  useEffect(() => {
    if (session) {
      router.push("/"); // Redirect to home page if user is logged in
    }
  }, [router, session]);

  return (
    <div className={styles.SignIn}>
      <div className={styles.signInLeft}>
        <div className={styles.signInLeftLogo}>
          <Image className={styles.signInLog} src={arkaImg} alt="CodeService" />
        </div>

        <div className={styles.signInLeftContent}>
          <Image className={styles.signInImg} src={codeImg} alt="" />
          <p>arkalalchakravarty.</p>
        </div>
      </div>

      <div className={styles.signInRight}>
        <div className={styles.signInRightTitle}>
          <h3>Sign in to your account</h3>
        </div>

        <div className={styles.signInRightbtn}>
          <button onClick={() => signIn("google")}>
            {" "}
            <FaGoogle /> Google
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
