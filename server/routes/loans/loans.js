const express = require("express");
const router = express.Router();
const mssql = require("../../database");
const authUser = require("../../authUser");
const validateUpdateFields = require("./loansFieldValidation");

//*Download available user loans
router.post("/", authUser, async(req, res) => {
    const SQLQuery = `SELECT CONCAT('${
    req.body.type
  }/', PozyczkaID) as id, Kwota as kwota, DataPozyczki as data, TerminOddania as termin, CzyOddano as oddano, CONCAT(Imie, ' ', Nazwisko) as osoba FROM Pozyczki as p JOIN Osoby as o ON p.${
    req.body.type === "in" ? "PozyczkodawcaID" : "PozyczkobiorcaID"
  } = o.OsobaID WHERE p.${
    req.body.type === "in" ? "PozyczkobiorcaID" : "PozyczkodawcaID"
  } = '${req.session.profileID}' ORDER BY DataPozyczki DESC`;
    try {
        let result = await mssql.request().query(SQLQuery);
        if (result.rowsAffected[0] == 0) {
            return res
                .status(404)
                .json({ message: "Konto nie posiada pożyczek od innych osób" });
        }
        result.recordset.map((record) => {
            record.oddano ? (record.oddano = "Tak") : (record.oddano = "Nie");
            record.termin = record.termin.toISOString().slice(0, 10);
            record.data = record.data.toISOString().slice(0, 10);
        });
        res.status(200).send(result.recordset);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

//*Download single loan
router.post("/:id", authUser, async(req, res) => {
    const SQLQuery = `SELECT CONCAT(o.Imie, ' ', o.Nazwisko) as osoba, p.Kwota as kwota, p.DataPozyczki as data, p.TerminOddania as termin, p.CzyOddano as oddano FROM Pozyczki as p JOIN Osoby as o ON p.${
    req.body.type === "in" ? "PozyczkodawcaID" : "PozyczkobiorcaID"
  } = o.OsobaID WHERE p.${
    req.body.type === "in" ? "PozyczkobiorcaID" : "PozyczkodawcaID"
  } = '${req.session.profileID}' AND p.PozyczkaID = '${
    req.params.id
  }' ORDER BY DataPozyczki DESC`;
    try {
        let result = await mssql.request().query(SQLQuery);
        if (result.rowsAffected[0] == 0) {
            return res
                .status(406)
                .json({ message: "Pożyczka nie jest przypisana do konta" });
        }
        result.recordset[0].data = result.recordset[0].data
            .toISOString()
            .slice(0, 10);
        result.recordset[0].termin = result.recordset[0].termin
            .toISOString()
            .slice(0, 10);
        res.status(200).send(result.recordset[0]);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

//*Toggle loan returned state
router.patch("/mark", authUser, async(req, res) => {
    const SQLQuery = `UPDATE Pozyczki SET CzyOddano = '${
    req.body.state
  }' WHERE PozyczkaID = ${req.body.id} AND ${
    req.body.type === "out" ? "PozyczkodawcaID" : "PozyczkobiorcaID"
  } = ${req.session.profileID}`;
    try {
        let result = await mssql.request().query(SQLQuery);
        if (result.rowsAffected[0] == 0) {
            return res
                .status(406)
                .json({ message: "Pożyczka nie jest przypisana do konta" });
        }
        res.status(200).json({ message: "Pożyczka została zaktualizowana" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

//*Add loan
router.put("/", authUser, validateUpdateFields, async(req, res) => {
    const SQLQuery = `INSERT INTO Pozyczki(PozyczkodawcaID, PozyczkobiorcaID, Kwota, DataPozyczki, TerminOddania, CzyOddano) VALUES('${
    req.body.type === "out" ? req.body.osoba : req.session.profileID
  }', '${req.body.type === "out" ? req.session.profileID : req.body.osoba}', '${
    req.body.kwota
  }', '${req.body.data}', '${req.body.termin}', 'false')`;
    try {
        await mssql.request().query(SQLQuery);
        res.status(200).json({
            message: "Pożyczka została dodana. Za chwilę nastąpi powrót do pożyczek",
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

//*Edit loan
router.patch("/", authUser, validateUpdateFields, async(req, res) => {
    const SQLQuery = `UPDATE Pozyczki SET ${
    req.body.type === "out" ? "PozyczkobiorcaID" : "PozyczkodawcaID"
  } = '${req.body.osoba}', ${
    req.body.type === "out" ? "PozyczkodawcaID" : "PozyczkobiorcaID"
  } = '${req.session.profileID}', Kwota = '${
    req.body.kwota
  }', DataPozyczki = '${req.body.data}', TerminOddania = '${
    req.body.termin
  }' WHERE PozyczkaID = ${req.body.id} AND ${
    req.body.type === "out" ? "PozyczkobiorcaID" : "PozyczkodawcaID"
  } = ${req.session.profileID}`;
    try {
        let result = await mssql.request().query(SQLQuery);
        if (result.rowsAffected[0] == 0) {
            return res
                .status(406)
                .json({ message: "Pożyczka nie jest przypisana do konta" });
        }
        res.status(200).json({
            message: "Pożyczka została zaktualizowana. Za chwilę nastąpi powrót do pożyczek",
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

//*Remove loan
router.delete("/:type/:id", authUser, async(req, res) => {
    const SQLQuery = `DELETE FROM Pozyczki WHERE PozyczkaID = '${
    req.params.id
  }' AND ${
    req.params.type === "out" ? "PozyczkodawcaID" : "PozyczkobiorcaID"
  } = '${req.session.profileID}'`;
    try {
        let result = await mssql.request().query(SQLQuery);
        if (result.rowsAffected[0] == 0) {
            return res
                .status(406)
                .json({ message: "Pożyczka nie jest przypisana do konta" });
        }
        res.status(200).json({
            message: "Pożyczka została usunięta. Za chwilę nastąpi powrót do pożyczek",
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;