import React from "react";

export default function OperationButtons({ type, title, click, reference }) {
  return (
    <button data-type={type} onClick={click} ref={reference}>
      {title}
    </button>
  );
}
