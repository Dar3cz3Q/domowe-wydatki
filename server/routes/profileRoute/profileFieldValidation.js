function validateProfileEditFields(req, res, next) {
  let errors = {};
  validateForeName(req.body.forename, errors);
  validateSurname(req.body.surname, errors);
  validateIDCard(req.body.IDcard, errors);
  validatePesel(req.body.pesel, errors);
  validateBirthDate(req.body.birthDate, errors);
  if (Object.keys(errors).length != 0) {
    return res.status(400).send(errors);
  }
  next();
}

function validateForeName(name, errors) {
  if (!name) {
    return (errors.forename = "Imię nie może być puste");
  }
  if (name.length > 32) {
    return (errors.forename = "Imię nie może zawierać więcej niż 32 znaki");
  }
}

function validateSurname(surname, errors) {
  if (!surname) {
    return (errors.surname = "Nazwisko nie może być puste");
  }
  if (surname.length > 32) {
    return (errors.surname = "Nazwisko nie może zawierać więcej niż 32 znaki");
  }
}

function validateIDCard(IDCard, errors) {
  if (!IDCard) {
    return (errors.IDcard = "Numer dowodu osobistego nie może być pusty");
  }
  if (!validateDO(IDCard)) {
    return (errors.IDcard = "Numer dowodu osobistego jest niepoprawny");
  }
}

function validatePesel(pesel, errors) {
  if (!pesel) {
    return (errors.pesel = "Pesel nie może być pusty");
  }
  if (!validatePeselSum(pesel)) {
    return (errors.pesel = "Pesel jest niepoprawny");
  }
}

function validateBirthDate(birthDate, errors) {
  const today = new Date();
  if (!birthDate) {
    return (errors.birthDate = "Data urodzenia nie może być pusta");
  }
  if (new Date(birthDate) > today) {
    return (errors.birthDate = "Data urodzenia ma nieprawidłową wartość");
  }
}

function validatePeselSum(pesel) {
  let sum = 0;
  sum =
    1 * pesel[0] +
    3 * pesel[1] +
    7 * pesel[2] +
    9 * pesel[3] +
    1 * pesel[4] +
    3 * pesel[5] +
    7 * pesel[6] +
    9 * pesel[7] +
    1 * pesel[8] +
    3 * pesel[9];
  let control = Number(pesel[10]);
  if (10 - (sum % 10) === control) {
    return true;
  }
  return false;
}

module.exports = {
  validateProfileEditFields,
};

/**
 * Numer dowodu osobistego
 * Tomasz Lubinski
 * www.algorytm.org
 */

/**
 * Sprawdza czy podany numer Dowodu Osobistego jest prawidłowy
 * @param {string} numer - seria i numer Dowodu Osobistego do walidacji (bez spacji, myślników, itp)
 * @return {boolean} - zwraca true jeżeli podany numer jest prawidłowy, false w przeciwnym wypadku
 */
function validateDO(numer) {
  numer = numer.toUpperCase();
  letterValues = [
    "0",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z",
  ];
  function getLetterValue(letter) {
    for (j = 0; j < letterValues.length; j++)
      if (letter == letterValues[j]) return j;
    return -1;
  }

  //Check seria
  for (i = 0; i < 3; i++) if (getLetterValue(numer[i]) < 10) return false;
  //Check number
  for (i = 3; i < 9; i++)
    if (getLetterValue(numer[i]) < 0 || getLetterValue(numer[i]) > 9)
      return false;

  //sprawdz cyfre controlna
  sum =
    7 * getLetterValue(numer[0]) +
    3 * getLetterValue(numer[1]) +
    1 * getLetterValue(numer[2]) +
    7 * getLetterValue(numer[4]) +
    3 * getLetterValue(numer[5]) +
    1 * getLetterValue(numer[6]) +
    7 * getLetterValue(numer[7]) +
    3 * getLetterValue(numer[8]);
  sum %= 10;
  if (sum != getLetterValue(numer[3])) return false;

  return true;
}
