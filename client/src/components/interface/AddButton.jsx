import React from "react";

export default function AddButton({ click }) {
  return (
    <button data-type="add" onClick={click}>
      <i className="icon-plus"></i>
    </button>
  );
}
