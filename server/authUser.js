function authUser(req, res, next) {
    if(!req.session.userID) {
        return res.status(403).send({ message: 'Brak permisji lub sesja wygasła. Zaloguj się ponownie'})
    }
    next()
}

module.exports = authUser