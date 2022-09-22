import React from "react";

export default function StatHeader({ header, icon }) {
  return (
    <div className="stats--header">
      {icon ? <i className={`icon-${icon}`}></i> : ""}
      {header}
    </div>
  );
}
