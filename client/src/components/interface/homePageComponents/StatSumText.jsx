import React from "react";

const money = Intl.NumberFormat("en-US");

export default function StatSumText({ suma }) {
  return <span className="stats--sum-data">{money.format(suma)} zł</span>;
}
