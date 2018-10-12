const { MongoClient, ObjectID } = require('mongodb')

MongoClient.connect(
  'mongodb://localhost:27017',
  { useNewUrlParser: true },
  (err, database) => {
    if (err) {
      return console.log('there is an error occured')
    }

    var db = database.db('Todo-Mongo')

    // db
    //   .collection('class')
    //   .deleteMany({
    //     name: 'CS'
    //   })
    //   .then(res => {
    //     console.log(res)
    //   })

    // db.collection('class').deleteOne({
    //   class: 'BSSE'
    // })

    db
      .collection('student')
      .findOneAndDelete({
        _id: new ObjectID('5bbda21dc1097098fcff9e13')
      })
      .then(res => {
        console.log(res)
      })

    // database.close()
  }
)
