import React from "react";
import { NavLink } from "react-router-dom";

export default function InterfaceMenu() {
  return (
    <ul>
      <NavLink to="/">
        <li>Strona główna</li>
      </NavLink>
      <li>
        Ustawienia:
        <ul>
          <NavLink to="/settings/account">
            <li>Konto</li>
          </NavLink>
          <NavLink to="/settings/profile">
            <li>Profil</li>
          </NavLink>
        </ul>
      </li>
      <NavLink to="/expenses">
        <li>Wydatki</li>
      </NavLink>
      <NavLink to="/loans">
        <li>Pożyczki</li>
      </NavLink>
      <NavLink to="/savings">
        <li>Oszczędności</li>
      </NavLink>
    </ul>
  );
}
