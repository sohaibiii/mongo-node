const { MongoClient, ObjectID } = require('mongodb')

MongoClient.connect(
  'mongodb://localhost:27017',
  { useNewUrlParser: true },
  (err, database) => {
    if (err) {
      return console.log('there is an error occured')
    }

    var db = database.db('Todo-Mongo')

    db
      .collection('class')
      .find({
        _id: new ObjectID('5bbc6ba50488322d787de900')
      })
      .toArray()
      .then(
        data => {
          console.log(JSON.stringify(data, undefined, 2))
        },
        err => {
          console("can't access values", err)
        }
      )
    db.collection('student').find().count().then(
      data => {
        console.log('the count is', data)
      },
      err => {
        console("can't access values", err)
      }
    )

    // database.close()
  }
)
