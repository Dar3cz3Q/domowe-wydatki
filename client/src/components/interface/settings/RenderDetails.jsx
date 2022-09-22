import React from "react";
import ShowInputMessage from "../../ShowInputMessage";

const INPUT_NAMES = {
  login: "Login",
  password: "Hasło",
  email: "Email",
  forename: "Imię",
  surname: "Nazwisko",
  IDcard: "Numer dowodu osobistego",
  pesel: "Pesel",
  birthDate: "Data urodzenia",
};

export default function RenderDetails({
  name,
  value,
  inputValue,
  inputState,
  inputRef,
  error,
}) {
  const handleInput = (e) => {
    inputState((state) => ({
      ...state,
      [name]: e.target.value,
    }));
  };

  return (
    <div className="detail--group flex">
      <label htmlFor={name}>{INPUT_NAMES[name]}:</label>
      <input
        className={error[name] ? "error" : ""}
        ref={inputRef}
        type={name === "birthDate" ? "date" : "text"}
        name={name}
        id={name}
        defaultValue={value}
        value={[inputValue][name]}
        readOnly
        onChange={handleInput}
      />
      {error[name] ? <ShowInputMessage errorMessage={error[name]} /> : ""}
    </div>
  );
}
