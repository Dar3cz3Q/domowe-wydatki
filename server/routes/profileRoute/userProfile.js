const express = require("express");
const router = express.Router();
const mssql = require("../../database");
const { validateProfileEditFields } = require("./profileFieldValidation");
const authUser = require("../../authUser");

//*Download available user profiles
router.post("/", authUser, async (req, res) => {
  const SQLQuery = `SELECT pk.IDProfilu, o.Imie, o.Nazwisko FROM Osoby as o JOIN Profile_konta as pk ON o.OsobaID = pk.IDProfilu JOIN Konta as k ON pk.IDKonta = k.IDKonta WHERE pk.IDKonta = ${req.session.userID}`;
  try {
    let result = await mssql.request().query(SQLQuery);
    if (result.rowsAffected[0] == 0) {
      return res.status(404).json({ message: "Konto nie posiada profili" });
    }
    res.status(200).send(result.recordset);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//*Set active profile to cookie
router.patch("/cookie", authUser, (req, res) => {
  req.session.profileID = req.body.profileID;
  req.session.profileName = req.body.profileName;
  res.status(201).json({ message: "Profil zapisany" });
});

//*Delete active profile from cookie
router.delete("/cookie", authUser, (req, res) => {
  req.session.profileID = null;
  req.session.profileName = null;
  res.status(204).json({ message: "Opuszczono profil" });
});

//*Get one profile
router.post("/data", authUser, async (req, res) => {
  const SQLQuery = `SELECT o.Imie as 'forename', o.Nazwisko as 'surname', os.NrDowoduOsobistego as 'IDcard', os.Pesel as 'pesel', os.DataUrodzenia as 'birthDate' FROM Osoby as o JOIN OsobySzczegoly as os ON o.OsobaID = os.OsobaID WHERE o.OsobaID = ${req.session.profileID}`;
  try {
    let result = await mssql.request().query(SQLQuery);
    result.recordset[0].birthDate = result.recordset[0].birthDate
      .toISOString()
      .slice(0, 10);
    res.status(200).send(result.recordset[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//*Create new profile
router.put("/", authUser, validateProfileEditFields, async (req, res) => {
  try {
    const SQLQuery = `exec Create_person '${req.body.forename}', '${req.body.surname}', '${req.body.IDcard}', '${req.body.pesel}', '${req.body.birthDate}', '${req.session.userID}'`;
    await mssql.request().query(SQLQuery);
    req.session.profileID = null;
    req.session.profileName = null;
    res.status(201).json({
      message: "Profil został utworzony. Za chwilę nastąpi zmiana profilu",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//*Update profile
router.patch("/", authUser, validateProfileEditFields, async (req, res) => {
  try {
    const SQLQuery = `exec Update_person '${req.session.profileID}', '${req.body.forename}', '${req.body.surname}', '${req.body.IDcard}', '${req.body.pesel}', '${req.body.birthDate}'`;
    await mssql.request().query(SQLQuery);
    req.session.profileID = null;
    req.session.profileName = null;
    res.status(200).json({
      message: "Profil został zaktualizowany. Za chwilę nastąpi zmiana profilu",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//*Delete profile
router.delete("/", authUser, async (req, res) => {
  try {
    const SQLQuery = `exec Remove_person '${req.session.profileID}'`;
    await mssql.request().query(SQLQuery);
    req.session.profileID = null;
    req.session.profileName = null;
    res.status(200).json({
      message: "Profil został usunięty. Za chwilę nastąpi zmiana profilu",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//*Download available user profiles 2
router.post("/person", authUser, async (req, res) => {
  const SQLQuery = `SELECT o.OsobaID as ID, CONCAT(o.Imie, ' ', o.Nazwisko) as Nazwa FROM Osoby as o JOIN Profile_konta as pk ON o.OsobaID = pk.IDProfilu JOIN Konta as k ON pk.IDKonta = k.IDKonta WHERE pk.IDKonta = ${req.session.userID} AND pk.IDProfilu !=${req.session.profileID}`;
  try {
    let result = await mssql.request().query(SQLQuery);
    if (result.rowsAffected[0] == 0) {
      return res.status(404).json({ message: "Konto nie posiada profili" });
    }
    res.status(200).send(result.recordset);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
