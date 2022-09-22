const express = require("express");
const router = express.Router();
const mssql = require("../../database");
const authUser = require("../../authUser");

//*Expenses grouped by category
router.post("/expenses/chart", authUser, async (req, res) => {
  const SQLQuery = `SELECT k.Nazwa, SUM(w.Kwota) as Suma FROM Wydatki as w JOIN Kategorie as k ON w.KategoriaID = k.KategoriaID WHERE w.OsobaID = ${req.session.profileID} GROUP BY k.Nazwa ORDER BY SUM(w.Kwota) DESC`;
  try {
    let result = await mssql.request().query(SQLQuery);
    if (result.rowsAffected[0] == 0) {
      return res.status(404).json({ message: "Brak danych" });
    }
    res.status(200).send(result.recordset);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//*Expenses sum
router.post("/expenses/sum", authUser, async (req, res) => {
  const SQLQuery = `SELECT SUM(Kwota) as Suma FROM Wydatki WHERE OsobaID = ${req.session.profileID}`;
  try {
    let result = await mssql.request().query(SQLQuery);
    if (!result.recordset[0].Suma) {
      return res.status(404).json({ message: "Brak danych" });
    }
    res.status(200).send(result.recordset[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//*Expenses grouped by shops
router.post("/expenses/shops", authUser, async (req, res) => {
  const SQLQuery = `SELECT s.Nazwa, COUNT(*) as Ilosc FROM Wydatki as w JOIN Sklepy as s ON w.SklepID = s.SklepID WHERE w.OsobaID = ${req.session.profileID} GROUP BY s.Nazwa ORDER BY COUNT(*) DESC`;
  try {
    let result = await mssql.request().query(SQLQuery);
    if (result.rowsAffected[0] == 0) {
      return res.status(404).json({ message: "Brak danych" });
    }
    res.status(200).send(result.recordset);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//*Expenses grouped by methods
router.post("/expenses/methods", authUser, async (req, res) => {
  const SQLQuery = `SELECT m.Nazwa, COUNT(*) as Ilosc FROM Wydatki as w JOIN MetodyPlatnosci as m ON w.MetodaPlatnosciID = m.MetodaID WHERE w.OsobaID = ${req.session.profileID} GROUP BY m.Nazwa ORDER BY COUNT(*) DESC`;
  try {
    let result = await mssql.request().query(SQLQuery);
    if (result.rowsAffected[0] == 0) {
      return res.status(404).json({ message: "Brak danych" });
    }
    res.status(200).send(result.recordset);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//*Loans sum
router.post("/loans/sum/:type", authUser, async (req, res) => {
  const SQLQuery = `SELECT SUM(Kwota) as Suma FROM Pozyczki WHERE ${
    req.params.type === "in" ? "PozyczkobiorcaID" : "PozyczkodawcaID"
  } = ${req.session.profileID}`;
  try {
    let result = await mssql.request().query(SQLQuery);
    if (!result.recordset[0].Suma) {
      return res.status(404).json({ message: "Brak danych" });
    }
    res.status(200).send(result.recordset[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//*Savings sum
router.post("/savings/sum", authUser, async (req, res) => {
  const SQLQuery = `SELECT dbo.CountSavings('${Number(
    req.session.profileID
  )}') AS Suma`;
  try {
    let result = await mssql.request().query(SQLQuery);
    if (!result.recordset[0].Suma) {
      return res.status(404).json({ message: "Brak danych" });
    }
    res.status(200).send(result.recordset[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//*Savings grouped by type
router.post("/savings/chart", authUser, async (req, res) => {
  const SQLQuery = `SELECT t.Nazwa, SUM(h.Kwota) as Suma FROM HistoriaOszczedzania as h JOIN TypyTransakcji as t ON h.TypTransakcji = t.TypID WHERE OsobaID = ${req.session.profileID} GROUP BY t.Nazwa`;
  try {
    let result = await mssql.request().query(SQLQuery);
    if (result.rowsAffected[0] == 0) {
      return res.status(404).json({ message: "Brak danych" });
    }
    res.status(200).send(result.recordset);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
