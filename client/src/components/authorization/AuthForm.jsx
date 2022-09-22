import React, { useState } from 'react'
import LoginForm from './LoginForm'
import RegisterForm from './RegisterForm'

export default function AuthForm() {

    const [active, setActive] = useState("login")

    const switchToggle = (e) => {
        setActive(e.target.dataset.type)
    }

    return (
        <div className="auth-form flex">
            <div className="auth-form--container flex">
                <div className="switch-container flex">
                    <div className="switch-container--button flex" data-type="login" onClick={switchToggle} data-state={active === "login" ? true : false}>
                        <span>Logowanie</span>
                    </div>
                    <div className="switch-container--button flex" data-type="register" onClick={switchToggle} data-state={active === "register" ? true : false}>
                        <span>Rejestracja</span>
                    </div>
                    <span className="horizontal-line" style={active === "login" ? {transform: "translateX(0)"} : {transform: "translateX(100%)"}}></span>
                </div>
                <div className="form-container flex">
                    {active === "login" ? <LoginForm /> : <RegisterForm />}
                </div>
            </div>
        </div>
  )
}
