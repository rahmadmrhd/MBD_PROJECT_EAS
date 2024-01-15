import React from "react";
import "./MessageBox.css";
import { useModalContext } from "@/src/context/ModalContext";

export type MessageBoxButton = {
  label: string;
  close: boolean;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
};

export type MessageBoxProps = {
  dataKey: React.Key;
  title?: string;
  message: React.ReactNode;
  button: MessageBoxButton[];
} & typeof defaultProps;

const defaultProps = {
  button: [
    {
      label: "Close",
      close: true,
      onClick: () => {},
    },
  ],
};

function MessageBox(props: MessageBoxProps) {
  const modalContext = useModalContext();
  // const iconTheme = getIconTheme(props.iconTheme);
  return (
    <div className='msgbox'>
      {/* {iconTheme.icon} */}
      <h3>{props.title}</h3>
      <p>{props.message}</p>
      <div className='btn-group'>
        {props.button.map((item, index) => {
          return (
            <button
              className='btn'
              key={index}
              onClick={(e) => {
                item.onClick?.(e);
                if (!item.close) return;
                modalContext.close(props.dataKey);
              }}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

MessageBox.defaultProps = defaultProps;
export default MessageBox;
