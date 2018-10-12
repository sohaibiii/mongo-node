const { MongoClient, ObjectID } = require('mongodb')

// var obj = new ObjectID()
// console.log(obj)

var obj = {
  name: 'sohaib',
  class: 'bsse'
}

var { name } = obj
console.log(name)

MongoClient.connect(
  'mongodb://localhost:27017',
  { useNewUrlParser: true },
  (err, database) => {
    if (err) {
      return console.log('there is an error occured')
    }

    var db = database.db('Todo-Mongo')

    console.log('connection has been established')

    db.collection('student').insertOne({
      name: 'ali',
      age: 22,
      class: 'bscs'
    }, (err, reponse) => {
      if (err) {
        return console.log('data has not been added', err)
      }
      console.log('data has been added')

      console.log(JSON.stringify(reponse.ops, undefined, 2))
    })
    db.collection('class').insertOne({
      name: 'CS',
      TEACHER: 'SIR Hanif'
    }, (err, result) => {
      if (err) {
        return console.log("we can't add the data")
      }

      console.log(result.ops[0]._id.getTimestamp())
    })

    database.close()
  }
)
