"use client";
// import Image from "next/image";
import React from "react";
import { Icon } from "@iconify/react";
import User from "@/src/resources/user/user-model";
// import "../auth.css";

interface Properties extends User {
  allowRemove?: boolean;
  tabIndex?: number;
  selectedUser?: string | null;
  onClick?: (_event: React.MouseEvent<any, MouseEvent>, _object: User) => void;
  onRemove?: (_object: User) => void;
}

function Account(props: Properties) {
  const [hydrated, setHydrated] = React.useState(false);
  React.useEffect(() => {
    setHydrated(true);
  }, []);
  if (!hydrated) {
    return null;
  }
  return (
    <li
      className={
        "auth-account focus-visible" +
        (props.selectedUser === props.username ? " disable-click" : "")
      }
      tabIndex={props.selectedUser === props.username ? -1 : props.tabIndex}
      onKeyDown={(e) => {
        if (e.code === "Enter" || e.code === "Space")
          props.onClick?.(e as any, props);
        if (e.code === "Delete" && props.allowRemove) props.onRemove?.(props);
      }}
    >
      <section
        onClick={(e) => {
          if (props.selectedUser === props.username) return;
          props.onClick?.(e, props);
        }}
      >
        <b className='name'>{props.name}</b>
        <b className='username'>{props.username}</b>
        <Icon className='avatar' icon='mdi:account-circle' />
        {/* {!props.imageUrl ? (
          <Icon className='avatar' icon='mdi:account-circle' />
        ) : (
          <Image
            className='avatar'
            src={props.imageUrl}
            width={50}
            height={50}
            style={{
              borderRadius: "50%",
              verticalAlign: "center",
            }}
            objectFit='cover'
            objectPosition='50% 50%'
            alt='image'
          />
        )} */}
      </section>
      {props.allowRemove && (
        <Icon
          className='trash-btn'
          onClick={(e) => {
            e.preventDefault();
            props.onRemove?.(props);
          }}
          icon='mdi:delete'
        />
      )}
    </li>
  );
}
export default Account;
