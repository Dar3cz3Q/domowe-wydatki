import React from "react";

export default function ShowInputMessage({ errorMessage }) {
  return (
    <p className="input-field--error">
      <i className="icon-attention"></i>
      {errorMessage}
    </p>
  );
}
