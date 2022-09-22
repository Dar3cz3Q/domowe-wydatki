import React from "react";

export default function NoLoansInfo({ information }) {
  return (
    <div className="loans-no-data--container">
      <h3>{information}</h3>
    </div>
  );
}
