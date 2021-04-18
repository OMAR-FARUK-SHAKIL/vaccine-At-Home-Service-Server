const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
// const fileUpload = require('express-fileupload');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()

const uri = "mongodb+srv://emaWatson:emawatson81@cluster0.wj6rs.mongodb.net/vaccineAtHome?retryWrites=true&w=majority";
// const uri = "mongodb+srv://omarshakil:omarshakil35@cluster0.wj6rs.mongodb.net/vaccineAtHome?retryWrites=true&w=majority";


// const MongoClient = require('mongodb').MongoClient;
const app = express()
app.use(bodyParser.json());
app.use(cors());
// app.use(express.static('doctors'));
// app.use(fileUpload());
const port = 5500;

app.get('/', (req, res) => {
  res.send("hello world! This is Omar Faruk Shakil.")
})

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
  const serviceCollection = client.db("vaccineAtHome").collection("services");
  const adminCollection = client.db("vaccineAtHome").collection("admin");
  const reviewsCollection = client.db("vaccineAtHome").collection("reviews");
  console.log('DB connected successfully');

  app.post('/addService', (req, res) => {
    const newService = req.body;
    console.log(newService);
    serviceCollection.insertOne(newService)
        .then(result => {
          console.log("insert to DB");
            res.send(result.insertedCount > 0)
        })
        .catch(err =>{console.log(err)})
});


app.get('/services',(req, res) => {
  serviceCollection.find({})
  .toArray((err,documents) =>{
    res.send(documents);
  })
})


app.get('/appointments', (req, res) => {
  appointmentCollection.find({})
      .toArray((err, documents) => {
          res.send(documents);
      })
});

app.get('/doctors', (req, res) => {
  doctorCollection.find({})
      .toArray((err, documents) => {
          res.send(documents);
      })
});

app.post('/addAdmin', (req, res) => {
  // const file = req.files.file;
  console.log('bod=',req.body);
  const name = req.body.name;
  const email = req.body.email;
  // const newImg = file.data;
  // const encImg = newImg.toString('base64');

  // var image = {
  //     contentType: file.mimetype,
  //     size: file.size,
  //     img: Buffer.from(encImg, 'base64')
  // };

  adminCollection.insertOne({ name, email})
      .then(result => {
          res.send(result.insertedCount > 0);
      })
})



app.post('/isDoctor', (req, res) => {
  const email = req.body.email;
  doctorCollection.find({ email: email })
      .toArray((err, doctors) => {
          res.send(doctors.length > 0);
      })
});

});



app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
