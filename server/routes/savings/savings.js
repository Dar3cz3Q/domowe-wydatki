const express = require("express");
const router = express.Router();
const mssql = require("../../database");
const authUser = require("../../authUser");
const validateUpdateFields = require("./savingsFieldValidation");

//*Download available user savings
router.post("/", authUser, async(req, res) => {
    const SQLQuery = `SELECT h.OperacjaID as id, t.Nazwa as typ, h.Kwota as kwota FROM HistoriaOszczedzania as h JOIN TypyTransakcji as t ON h.TypTransakcji = t.TypID WHERE h.OsobaID = '${req.session.profileID}' ORDER BY h.OperacjaID DESC`;
    try {
        let result = await mssql.request().query(SQLQuery);
        if (result.rowsAffected[0] == 0) {
            return res
                .status(404)
                .json({ message: "Konto nie posiada oszczędności" });
        }
        res.status(200).send(result.recordset);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

//*Download single saving
router.post("/:id", authUser, async(req, res) => {
    const SQLQuery = `SELECT TypTransakcji as typ, Kwota as kwota FROM HistoriaOszczedzania WHERE OsobaID = ${req.session.profileID} AND OperacjaID = ${req.params.id}`;
    try {
        let result = await mssql.request().query(SQLQuery);
        if (result.rowsAffected[0] == 0) {
            return res
                .status(406)
                .json({ message: "Oszczędność nie jest przypisana do konta" });
        }
        res.status(200).send(result.recordset[0]);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

//*Add saving
router.put("/", authUser, validateUpdateFields, async(req, res) => {
    const SQLQuery = `INSERT INTO HistoriaOszczedzania(OsobaID, TypTransakcji, Kwota) VALUES('${req.session.profileID}', '${req.body.type}', '${req.body.kwota}')`;
    try {
        await mssql.request().query(SQLQuery);
        res.status(200).json({
            message: "Oszczędność została dodana. Za chwilę nastąpi powrót do oszczędności",
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

//*Edit loan
router.patch("/", authUser, validateUpdateFields, async(req, res) => {
    const SQLQuery = `UPDATE HistoriaOszczedzania SET TypTransakcji = '${req.body.type}', Kwota = '${req.body.kwota}' WHERE OperacjaID = ${req.body.id} AND OsobaID = ${req.session.profileID}`;
    try {
        await mssql.request().query(SQLQuery);
        res.status(200).json({
            message: "Oszczędność została zaktualizowana. Za chwilę nastąpi powrót do oszczędności",
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

//*Remove saving
router.delete("/:id", authUser, async(req, res) => {
    const SQLQuery = `DELETE FROM HistoriaOszczedzania WHERE OperacjaID = ${req.params.id} AND OsobaID = ${req.session.profileID}`;
    try {
        let result = await mssql.request().query(SQLQuery);
        if (result.rowsAffected[0] == 0) {
            return res
                .status(406)
                .json({ message: "Oszczędność nie jest przypisana do konta" });
        }
        res.status(200).json({
            message: "Oszczędność została usunięta. Za chwilę nastąpi powrót do oszczędności",
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;