const mssql = require("../../database");

async function validateUpdateFields(req, res, next) {
  let errors = {};
  await validatePerson(req.body.osoba, errors, req, res);
  validatePrice(req.body.kwota, errors);
  validateDate(req.body.data, errors);
  validateTermin(req.body.termin, req.body.data, errors);
  if (Object.keys(errors).length != 0 && !res.headersSent) {
    return res.status(400).send(errors);
  }
  next();
}

async function validatePerson(osoba, errors, req, res) {
  const personDetails = osoba.split(" ");
  if (!osoba) {
    return (errors.osoba = "Osoba nie może być pusta");
  }
  const SQLQuery = `SELECT OsobaID FROM Osoby WHERE Imie = '${personDetails[0]}' AND Nazwisko = '${personDetails[1]}'`;
  try {
    let result = await mssql.request().query(SQLQuery);
    if (result.rowsAffected[0] == 0) {
      return (errors.osoba = "Osoba nie została znaleziona");
    }
    if (result.recordset[0].OsobaID == req.session.profileID) {
      return (errors.osoba = "Osoba nie może być taka sama jak obecny profil");
    }
    req.body.osoba = result.recordset[0].OsobaID;
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

function validatePrice(kwota, errors) {
  if (!kwota) {
    return (errors.kwota = "Kwota nie może być pusta");
  }
  if (isNaN(kwota)) {
    return (errors.kwota = "Kwota musi być liczbą");
  }
  if (Number(kwota) < 0) {
    return (errors.kwota = "Kwota nie może być mniejsza od 0");
  }
}

function validateDate(data, errors) {
  const today = new Date();
  if (!data) {
    return (errors.data = "Data nie może być pusta");
  }
  if (new Date(data) > today) {
    return (errors.data = "Data ma nieprawidłową wartość");
  }
}

function validateTermin(termin, data, errors) {
  if (!termin) {
    return (errors.termin = "Termin nie może być pusty");
  }
  if (new Date(data) > new Date(termin)) {
    return (errors.termin = "Termin ma nieprawidłową wartość");
  }
}

module.exports = validateUpdateFields;
