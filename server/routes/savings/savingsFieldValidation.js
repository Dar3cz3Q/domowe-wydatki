function validateUpdateFields(req, res, next) {
  let errors = {};
  validatePrice(req.body.kwota, errors);
  if (Object.keys(errors).length != 0 && !res.headersSent) {
    return res.status(400).send(errors);
  }
  next();
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

module.exports = validateUpdateFields;
