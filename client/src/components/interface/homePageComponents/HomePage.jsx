import React from "react";
import ExpensesCategoriesStats from "./expenses/ExpensesCategoriesStats";
import ExpensesSum from "./expenses/ExpensesSum";
import ExpensesShopsStats from "./expenses/ExpensesShopsStats";
import ExpensesMethodsStats from "./expenses/ExpensesMethodsStats";
import LoansSum from "./loans/LoansSum";
import SavingsStats from "./savings/SavingsStats";
import SavingsSum from "./savings/SavingsSum";

export default function HomePage() {
  return (
    <div className="all-stats--container">
      <ExpensesSum />
      <ExpensesCategoriesStats />
      <ExpensesShopsStats />
      <ExpensesMethodsStats />
      <LoansSum type="in" />
      <LoansSum type="out" />
      <SavingsStats />
      <SavingsSum />
    </div>
  );
}
