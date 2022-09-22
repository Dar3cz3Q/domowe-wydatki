import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const TIMEOUT_TIME = process.env.REACT_APP_TIMEOUT_TIME;

export default function PasswordChange() {
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      navigate("/settings/account");
    }, TIMEOUT_TIME);
  });

  return (
    <div>
      Strona zmiany hasła nie jest jeszcze gotowa. Za chwilę zostaniesz
      przekierowany na stronę konta.
    </div>
  );
}
