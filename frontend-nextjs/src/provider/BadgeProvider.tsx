"use client";

import React from "react";
import { BadgeContext } from "../context/BadgeContext";
import useAccessData from "../utils/swr";

type Properties = {
  children: React.ReactNode;
};

export function BadgeProvider({ children }: Properties) {
  const { data: orderCount, error: orderError } =
    useAccessData<number>(`/order/waiting`);
  const { data: reservationCount, error: reservationError } =
    useAccessData<number>(`/reservation/waiting`);
  if (orderError) throw orderError;
  if (reservationError) throw reservationError;

  return (
    <>
      <BadgeContext.Provider
        value={{
          ["Orders"]: orderCount?.data ?? 0,
          ["Reservations"]: reservationCount?.data ?? 0,
        }}
      >
        {children}
      </BadgeContext.Provider>
    </>
  );
}
