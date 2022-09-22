const LOGIN_REGEX = /^[A-Za-z0-9_.]+$/
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PASSWORD_REGEX = /^(?=.*?[A-Z])(?=(.*[a-z]){1,})(?=(.*[\d]){1,})(?=(.*[\W]){1,})(?!.*\s).{4,16}$/

function validateUpdateFields(req, res, next) {
    let errors = {};
    validateLogin(req.body.login, errors);
    validateEmail(req.body.email, errors);
    if(Object.keys(errors).length != 0) {
        return res.status(400).send(errors)
    }
    next()
}

function validateLoginFields(req, res, next) {
    let errors = {};
    validateLogin(req.body.login, errors);
    validatePassword(req.body.password, errors);
    if(Object.keys(errors).length != 0) {
        return res.status(400).send(errors)
    }
    next()
}

function validateRegisterFields(req, res, next) {
    let errors = {};
    validateLogin(req.body.login, errors);
    validatePassword(req.body.password, errors);
    validateEmail(req.body.email, errors);
    if(Object.keys(errors).length != 0) {
        return res.status(400).send(errors)
    }
    next()
}

function validateLogin(login, errors) {
    if(!login) {
        return errors.login = 'Login nie może być pusty'
    } 
    if(login.length > 32) {
        return errors.login = 'Login nie może mieć więcej niż 32 znaki'
    }
    if (!LOGIN_REGEX.test(login)) {
        return errors.login = 'Login zawiera niedozwolone znaki'
    }
}

function validatePassword(password, errors) {
    if(!password) {
        return errors.password = 'Hasło nie może być puste' 
    }
    if (!PASSWORD_REGEX.test(password)) {
        return errors.password = 'Hasło musi posiadać od 4 do 16 znaków, dużą literę, małą literę, liczbę, znak specjalny'
    }
}

function validateEmail(email, errors) {
    if(!email) {
        return errors.email = 'Email nie może być pusty'
    }
    if (!EMAIL_REGEX.test(email)) {
        return errors.email = 'Email posiada niepoprawny format'
    }
}

module.exports = {
    validateLoginFields, 
    validateRegisterFields,
    validateUpdateFields
}