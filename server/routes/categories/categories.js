const express = require('express')
const router = express.Router()
const mssql = require('../../database')
const authUser = require('../../authUser')

//*Download all categories
router.post('/', authUser, async (req, res) => {
    const SQLQuery = `SELECT KategoriaID as ID, Nazwa FROM Kategorie ORDER BY Nazwa`
    try {
        let result = await mssql.request().query(SQLQuery)
        res.status(200).send(result.recordset)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

module.exports = router