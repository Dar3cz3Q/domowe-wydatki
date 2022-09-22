const mssql = require("../../database");

async function validateUpdateFields(req, res, next) {
  let errors = {};
  validateDesc(req.body.opis, errors);
  validatePrice(req.body.kwota, errors);
  validateDate(req.body.data, errors);
  await validateCategory(req.body.kategoria, errors, req, res);
  await validateShop(req.body.sklep, errors, req, res);
  await validateMethod(req.body.metoda_platnosci, errors, req, res);
  if (Object.keys(errors).length != 0 && !res.headersSent) {
    return res.status(400).send(errors);
  }
  next();
}

function validateDesc(opis, errors) {
  if (!opis) {
    return (errors.opis = "Opis nie może być pusty");
  }
  if (opis.length > 100) {
    return (errors.opis = "Opis nie może mieć więcej niż 100 znaków");
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

async function validateCategory(kategoria, errors, req, res) {
  if (!kategoria) {
    return (errors.kategoria = "Kategoria nie może być pusta");
  }
  const SQLQuery = `SELECT KategoriaID FROM Kategorie WHERE Nazwa = '${kategoria}'`;
  try {
    let result = await mssql.request().query(SQLQuery);
    if (result.rowsAffected[0] == 0) {
      return (errors.kategoria = "Kategoria nie została znaleziona");
    }
    req.body.kategoria = result.recordset[0].KategoriaID;
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function validateShop(sklep, errors, req, res) {
  if (!sklep) {
    return (errors.sklep = "Sklep nie może być pusty");
  }
  const SQLQuery = `SELECT SklepID FROM Sklepy WHERE Nazwa = '${sklep}'`;
  try {
    let result = await mssql.request().query(SQLQuery);
    if (result.rowsAffected[0] == 0) {
      return (errors.sklep = "Sklep nie został znaleziony");
    }
    req.body.sklep = result.recordset[0].SklepID;
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function validateMethod(metoda_platnosci, errors, req, res) {
  if (!metoda_platnosci) {
    return (errors.metoda_platnosci = "Metoda płatności nie może być pusta");
  }
  const SQLQuery = `SELECT MetodaID FROM MetodyPlatnosci WHERE Nazwa = '${metoda_platnosci}'`;
  try {
    let result = await mssql.request().query(SQLQuery);
    if (result.rowsAffected[0] == 0) {
      return (errors.metoda_platnosci = "Metoda nie została znaleziona");
    }
    req.body.metoda_platnosci = result.recordset[0].MetodaID;
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

module.exports = validateUpdateFields;
