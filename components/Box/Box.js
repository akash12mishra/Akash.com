import React from "react";
import styles from "./Box.module.scss";
import MeetingScheduler from "../MeetingScheduler/MeetingScheduler";
import { useSession } from "next-auth/react";

const Box = ({ data }) => {
  const { data: session } = useSession();

  if (data === "AI Box Rendered") {
    return <div>AI Box Component</div>;
  }

  if (data.type === "meeting") {
    return (
      <MeetingScheduler onSave={data.onSave} userEmail={session.user.email} />
    );
  }

  return null;
};

export default Box;
