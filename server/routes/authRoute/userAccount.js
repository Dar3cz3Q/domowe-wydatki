const express = require('express')
const router = express.Router()
const { config } = require('../../config/config')
const mssql = require('../../database')
const { validateLoginFields, validateRegisterFields, validateUpdateFields } = require('./authFieldValidation')
const authUser = require('../../authUser')

const bcrypt = require('bcrypt')
const saltRounds = 12

//*Check if user is logged in
router.post('/', (req, res) => {
    if (req.session.userID) {
        res.status(202).send({
            username: req.session.username,
            profileName: req.session.profileName
        })
    } else {
        res.status(401).send(null)
    }
})

//*Logout (remove cookie)
router.delete('/', (req, res) => {
    res.clearCookie(config.cookie.cookieName)
    res.status(204).send(null)
})

//*Login
router.post('/login', validateLoginFields, async (req, res) => {
    const login = req.body.login;
    const password = req.body.password;
    try {
        const SQLQuery = `SELECT * FROM Konta WHERE Username = '${login}'`;
        let result = await mssql.request().query(SQLQuery)
        let account = result.recordset[0]
        if (account == null) {
            return res.status(404).json({ message: 'Nie znaleziono użytkownika' })
        }
        bcrypt.compare(password, account.Haslo, (err, response) => {
            if (response) {
                req.session.username = account.Username;
                req.session.userID = account.IDKonta;
                req.session.profileID = null;
                req.session.profileName = null;
                res.status(200).send({
                    username: account.Username,
                    profileName: null
                })
            } else {
                res.status(403).json({ message: 'Wprowadzono niepoprawne hasło' })
            }
        })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

//*Register
router.post('/register', validateRegisterFields, async (req, res) => {
    const login = req.body.login
    const email = req.body.email
    const password = req.body.password
    try {
        const salt = await bcrypt.genSalt(saltRounds)
        const hashedPassword = await bcrypt.hash(password, salt)
        const SQLQuery = `INSERT INTO Konta(Username, Email, Haslo) VALUES('${login}', '${email}', '${hashedPassword}')`;
        await mssql.request().query(SQLQuery)
        res.status(201).send({ message: "Konto zostało utworzone" })
    } catch (err) {
        console.log(err)
        if (err.number === 2627) {
            err.message = 'Login/Email jest już zajęty'
            return res.status(409).json({ message: err.message })
        }
        res.status(500).json({ message: err.message })
    }
})

//*Download user data
router.post('/data', authUser, async (req, res) => {
    try {
        const SQLQuery = `SELECT Username as 'login', Email as 'email', Data_utworzenia as Utworzono FROM Konta WHERE IDKonta = ${req.session.userID}`;
        let result = await mssql.request().query(SQLQuery)
        res.status(200).send(result.recordset[0])
    } catch (err) {
        console.log(err)
        res.status(400).json({ message: err.message })
    }
})

//*Update account
router.patch('/', authUser, validateUpdateFields, async (req, res) => {
    try {
        const SQLQuery = `UPDATE Konta SET Username = '${req.body.login}', Email = '${req.body.email}' WHERE IDKonta = ${req.session.userID}`;
        await mssql.request().query(SQLQuery)
        res.clearCookie(config.cookie.cookieName)
        res.status(200).json({ message: 'Konto zostało zaktualizowane. Za chwilę nastąpi wylogowanie' })
    } catch (err) {
        console.log(err)
        if (err.number === 2627) {
            err.message = 'Login/Email jest już zajęty'
            return res.status(409).json({ message: err.message })
        }
        res.status(500).json({ message: err.message })
    }
})

//*Delete account
router.delete('/remove', authUser, async (req, res) => {
    try {
        const SQLQuery = `DELETE FROM Konta WHERE IDKonta = ${req.session.userID}`;
        await mssql.request().query(SQLQuery)
        res.clearCookie(config.cookie.cookieName)
        res.status(200).json({ message: 'Konto zostało usunięte. Za chwilę nastąpi wylogowanie' })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

module.exports = router