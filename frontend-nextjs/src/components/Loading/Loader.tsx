import React from "react";
import "./Loading.css";

function Loader(props: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...props}
      className={"container-loader" + (props.hidden ? " hide" : "")}
    >
      <div className='loader'>
        <svg className='circular' viewBox='25 25 50 50'>
          <circle
            className='path'
            cx='50'
            cy='50'
            r='20'
            fill='none'
            strokeWidth='2'
            strokeMiterlimit='10'
          />
        </svg>
      </div>
    </div>
  );
}

export default Loader;