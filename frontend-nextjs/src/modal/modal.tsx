"use client";

import React from "react";
import "./modal.css";
interface Properties {
  children: React.ReactNode;
  // dataKey: React.Key;
}

// const Modal = React.forwardRef<HTMLElement, Properties>(function Modal(
//   props: Properties,
//   ref
// ) {
//   return (
//     <section ref={ref} className='modal-backdrop'>
//       {props.children}
//     </section>
//   );
// });

function Modal({ children }: Properties) {
  // console.log(props.dataKey);
  return <section className='modal-backdrop'>{children}</section>;
}

export default Modal;
