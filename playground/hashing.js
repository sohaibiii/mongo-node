const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

var password = 'sohaibi'

bcrypt.genSalt(10, (err, salt) => {
  bcrypt.hash(password, salt, (err, hash) => {
    console.log(hash)
  })
})
var hash = '$2a$10$2.k9oR5MhATT7mss.KSKSOQ7/rlDUOa8IAiV6vbh010/rnXNB.ywu'

bcrypt.compare(password, hash, (err, res) => {
  console.log(res)
})

// var data = {
//   id: 4
// }

// var token = jwt.sign(data, 'sohaibi') // convert the data into hashingToken with secret key
// console.log('hashing is', token)

// var veri = jwt.verify(token, 'sohaibi') // verify the token with key and return data

// console.log('data is ', veri)

// const { SHA256 } = require('crypto-js')

// var msg = 'hello my name is khan'
// var cryp = SHA256(msg).toString()
// console.log(cryp)

// var data = {
//   id: 4
// }

// token = {
//   data,
//   hash: SHA256(JSON.stringify(data) + 'sohaibi').toString()
// }

// // token.data.id = 5;
// // token.hash = SHA256(JSON.stringify(token.data)).toString

// var reshash = SHA256(JSON.stringify(token.data) + 'sohaibi').toString()

// if (reshash === token.hash) {
//   console.log('ok you are save')
// } else {
//   console.log('you are not save')
// }
