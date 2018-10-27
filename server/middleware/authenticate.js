var { User } = require('../mongoose-connect/user')

var Authenticatemiddleware = (req, res, next) => {
  var token = req.header('x-token')
  return User.findByToken(token)
    .then(user => {
      if (!user) {
        return Promise.reject()
      }
      // res.send(user)
      req.user = user
      req.token = token
      next()
    })
    .catch(err => {
      res.status(401).send(err)
    })
}

module.exports = {
  Authenticatemiddleware
}
