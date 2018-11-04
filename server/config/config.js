var env = process.env.NODE_ENV || 'development'

// by default process.env.NODE_ENV  'production' hta hai
console.log('***** env is', env)

if (env === 'development' || env === 'test') {
  var config = require('../config/config.json')

  // dont need to convert the json file into object it automatically does when we import this
  var configobject = config[env]
  Object.keys(configobject).forEach(key => {
    process.env[key] = configobject[key]
  })
}

// same as above

// if (env === 'development') {
//   process.env.PORT = 3000
//   process.env.MONGODB_URI = 'mongodb://localhost:27017/Todo-Mongo'
// } else if (env === 'test') {
//   process.env.PORT = 3000
//   process.env.MONGODB_URI = 'mongodb://localhost:27017/Todo-Mongo-test'
// }
