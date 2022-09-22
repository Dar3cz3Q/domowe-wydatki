import React, { useContext } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import InterfaceMenu from "./InterfaceMenu";
import HomePage from "./homePageComponents/HomePage";
import AccountSettings from "./settings/AccountSettings";
import ProfileSettings from "./settings/ProfileSettings";
import Expenses from "./expenses/ShowExpenses";
import EditExpense from "./expenses/EditExpense";
import { UserContext } from "../UserContext";
import ShowLoans from "./loans/ShowLoans";
import EditLoan from "./loans/EditLoan";
import ShowSavings from "./savings/ShowSavings";
import EditSaving from "./savings/EditSaving";
import PasswordChange from "./settings/PasswordChange";

export default function AppInterface() {
  const { loggedInStatus } = useContext(UserContext);

  return (
    <>
      <Router>
        <div
          className={`interface-menu--container ${
            loggedInStatus.profileName === "Brak profilu" ? "disabled" : ""
          } flex`}
        >
          <InterfaceMenu />
        </div>
        <div className="interface--container flex">
          <Routes>
            <Route
              path="/"
              exact
              element={
                loggedInStatus.profileName === "Brak profilu" ? (
                  <Navigate from="*" to="/settings/profile" />
                ) : (
                  <HomePage />
                )
              }
            />
            <Route path="/settings/account" element={<AccountSettings />} />
            <Route path="/settings/profile" element={<ProfileSettings />} />
            <Route
              path="/settings/account/password"
              element={<PasswordChange />}
            />
            <Route path="/expenses" element={<Expenses />} />
            <Route path="/expenses/edit/" element={<EditExpense />} />
            <Route path="/expenses/edit/:expenseID" element={<EditExpense />} />
            <Route path="/loans" element={<ShowLoans />} />
            <Route path="/loans/edit" element={<EditLoan />} />
            <Route
              path="/loans/edit/:personID/:loanID"
              element={<EditLoan />}
            />
            <Route path="/savings" element={<ShowSavings />} />
            <Route path="/savings/edit/" element={<EditSaving />} />
            <Route path="/savings/edit/:savingID" element={<EditSaving />} />
          </Routes>
        </div>
      </Router>
    </>
  );
}
