const { MongoClient, ObjectID } = require('mongodb')

MongoClient.connect(
  'mongodb://localhost:27017',
  { useNewUrlParser: true },
  (err, database) => {
    if (err) {
      return console.log('there is an error occured')
    }

    var db = database.db('Todo-Mongo')

    db.collection('class').findOneAndUpdate(
      {
        _id: new ObjectID('5bbef037227eba0e0051ec10')
      },
      {
        $set: {
          name: 'BSSE'
        }
      },
      {
        returnOriginal: false
      }
    )

    db.collection('student').findOneAndUpdate(
      {
        _id: new ObjectID('5bbd7dad66e57c13a4c86786')
      },
      {
        $set: {
          name: 'ali bhai'
        },
        $inc: {
          age: 1
        }
      },
      {
        returnOriginal: false
      }
    ).then(
      (res)=>{
        console.log(res)

      }
    )

    // database.close()
  }
)
