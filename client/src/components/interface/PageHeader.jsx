import React from "react";

export default function PageHeader({ name }) {
  return (
    <div className="section--header">
      <span>{name}</span>
    </div>
  );
}
