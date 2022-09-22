const express = require('express')
const router = express.Router()
const mssql = require('../../database')
const authUser = require('../../authUser')
const validateUpdateFields = require('./expenseFieldValidation')

//*Download all expenses
router.post('/', authUser, async (req, res) => {
    const SQLQuery = `SELECT w.WydatekID as id, w.Opis as opis, w.Kwota as kwota, w.DataWydatku as data, k.Nazwa as kategoria, s.Nazwa as sklep, m.Nazwa as metoda_platnosci FROM Wydatki as w JOIN Sklepy as s ON w.SklepID = s.SklepID JOIN Kategorie as k ON w.KategoriaID = k.KategoriaID JOIN MetodyPlatnosci as m ON w.MetodaPlatnosciID = m.MetodaID WHERE OsobaID = ${req.session.profileID} ORDER BY w.DataWydatku DESC`
    try {
        let result = await mssql.request().query(SQLQuery)
        if(result.rowsAffected[0] == 0) {
            return res.status(404).json({ message: 'Konto nie posiada wydatków' })
        }
        result.recordset.map(record => {
            record.data = record.data.toISOString().slice(0, 10);
        })
        res.status(200).send(result.recordset)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

//*Download single expense
router.post('/:id', authUser, async (req, res) => {
    const SQLQuery = `SELECT w.Opis as opis, w.Kwota as kwota, w.DataWydatku as data, k.Nazwa as kategoria, s.Nazwa as sklep, m.Nazwa as metoda_platnosci FROM Wydatki as w JOIN Sklepy as s ON w.SklepID = s.SklepID JOIN Kategorie as k ON w.KategoriaID = k.KategoriaID JOIN MetodyPlatnosci as m ON w.MetodaPlatnosciID = m.MetodaID WHERE OsobaID = '${req.session.profileID}' AND w.WydatekID = '${req.params.id}' ORDER BY w.DataWydatku DESC`
    try {
        let result = await mssql.request().query(SQLQuery)
        if(result.rowsAffected[0] == 0) {
            return res.status(406).json({ message: 'Wydatek nie jest przypisany do konta' })
        }
        result.recordset[0].data = result.recordset[0].data.toISOString().slice(0, 10);
        res.status(200).send(result.recordset[0])
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

//*Edit expense
router.patch('/', authUser, validateUpdateFields, async (req, res) => {
    const SQLQuery = `UPDATE Wydatki SET KategoriaID = '${req.body.kategoria}', SklepID = '${req.body.sklep}', DataWydatku = '${req.body.data}', Kwota = '${req.body.kwota}', Opis = '${req.body.opis}', MetodaPlatnosciID = '${req.body.metoda_platnosci}' WHERE WydatekID = '${req.body.id}' AND OsobaID = '${req.session.profileID}'`
    try {
        let result = await mssql.request().query(SQLQuery)
        if(result.rowsAffected[0] == 0) {
            return res.status(406).json({ message: 'Wydatek nie jest przypisany do konta' })
        }
        res.status(200).json({ message: 'Wydatek został zaktualizowany. Za chwilę nastąpi powrót do wydatków' })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

//*Add expense
router.put('/', authUser, validateUpdateFields, async (req, res) => {
    const SQLQuery = `INSERT INTO Wydatki(KategoriaID, OsobaID, SklepID, DataWydatku, Kwota, Opis, MetodaPlatnosciID) VALUES('${req.body.kategoria}', '${req.session.profileID}', '${req.body.sklep}', '${req.body.data}', '${req.body.kwota}', '${req.body.opis}', '${req.body.metoda_platnosci}')`
    try {
        await mssql.request().query(SQLQuery)
        res.status(200).json({ message: 'Wydatek został dodany. Za chwilę nastąpi powrót do wydatków' })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

//*Remove expense
router.delete('/:id', authUser, async (req, res) => {
    const SQLQuery = `DELETE FROM Wydatki WHERE WydatekID = '${req.params.id}' AND OsobaID = '${req.session.profileID}'`
    try {
        let result = await mssql.request().query(SQLQuery)
        if(result.rowsAffected[0] == 0) {
            return res.status(406).json({ message: 'Wydatek nie jest przypisany do konta' })
        }
        res.status(200).json({ message: 'Wydatek został usunięty. Za chwilę nastąpi powrót do wydatków' })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

module.exports = router