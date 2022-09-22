import React from "react";

export default function NoData({ title }) {
  return (
    <div className="stats--no-data">
      <i className="icon-database"></i>
      {title}
    </div>
  );
}
