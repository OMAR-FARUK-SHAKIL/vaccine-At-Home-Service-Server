const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectID;
require('dotenv').config();


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wj6rs.mongodb.net/vaccineAtHome?retryWrites=true&w=majority`;


const app = express()
app.use(bodyParser.json());
app.use(cors());

const port = 5500;

app.get('/', (req, res) => {
  res.send("hello world! This is Omar Faruk Shakil.")
})

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
  const serviceCollection = client.db("vaccineAtHome").collection("services");
  const adminCollection = client.db("vaccineAtHome").collection("admin");
  const reviewsCollection = client.db("vaccineAtHome").collection("reviews");
  const ordersCollection = client.db("vaccineAtHome").collection("orders");
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


app.get('/allOrders', (req, res) => {
  ordersCollection.find({})
      .toArray((err, documents) => {
        console.log(documents);
          res.send(documents);
      })
});

app.get('/orders/:email', (req, res) => {
  console.log("order = ",req.params.email);
  const email=req.params.email;
  ordersCollection.find({email: email})
      .toArray((err, documents) => {
          res.send(documents);
      })
});

app.post('/addAdmin', (req, res) => {
  console.log('bod=',req.body);
  const name = req.body.name;
  const email = req.body.email;
 
  adminCollection.insertOne({ name, email})
      .then(result => {
          res.send(result.insertedCount > 0);
      })
})

app.post('/addReview', (req, res) => {
  const newReview = req.body;
  console.log("review=",newReview);
  reviewsCollection.insertOne(newReview)
      .then(result => {
        console.log("insert to DB");
          res.send(result.insertedCount > 0)
      })
      .catch(err =>{console.log(err)})
});

app.get('/reviews',(req, res) => {
  reviewsCollection.find({})
  .toArray((err,documents) =>{
    res.send(documents);
  })
})


app.post('/orderService', (req, res) => {
  const newReview = req.body;
  console.log("review=",newReview);
  ordersCollection.insertOne(newReview)
      .then(result => {
        console.log("insert to DB");
          res.send(result.insertedCount > 0)
      })
      .catch(err =>{console.log(err)})
});


app.post('/isAdmin', (req, res) => {
  const email = req.body.email;
  adminCollection.find({ email: email })
      .toArray((err, doctors) => {
          res.send(doctors.length > 0);
      })
});

app.delete('/delete/:id',(req, res) => {
  console.log(req.params.id);
  serviceCollection.deleteOne({_id:ObjectId(req.params.id)})
  .then((result) =>{
      // console.log(result);
     res.send(result.deletedCount>0) ;
  })
});


});


app.listen(process.env.PORT || port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
