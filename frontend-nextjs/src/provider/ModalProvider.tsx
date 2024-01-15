"use client";

import React, { useState } from "react";
import { ModalContext, Modals } from "@src/context/ModalContext";
import Modal from "../modal/modal";
import FocusTrap from "focus-trap-react";

type Properties = {
  children: React.ReactNode;
};

export function ModalProviders({ children }: Properties) {
  const [modals, setModals] = useState<{ [key: string]: React.ReactNode }>({});

  const open = (key: React.Key, child: React.ReactNode) => {
    setModals((curr) => {
      return {
        ...curr,
        [key.toString()]: child,
      };
    });
  };
  const close = (key: React.Key) => {
    setModals((current) => {
      const newModals = { ...current };
      delete newModals[key.toString()];
      return newModals;
    });
  };
  const value: Modals = { modals, open, close };
  return (
    <ModalContext.Provider value={value}>
      {Object.keys(modals).map((key, index) => {
        return (
          <Modal key={index}>
            <FocusTrap>{modals[key]}</FocusTrap>
          </Modal>
        );
      })}
      <main
        style={
          Object.keys(modals).length > 0
            ? {
                position: "fixed",
                top: "0",
                right: "0",
                left: "0",
                bottom: "0",
                pointerEvents: "none",
              }
            : {}
        }
      >
        {children}
      </main>
    </ModalContext.Provider>
  );
}
