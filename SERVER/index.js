const { MongoClient } = require('mongodb');
const express = require('express');
const port = process.env.PORT || 5000;
const ObjectId = require('mongodb').ObjectId
const app = express();
const cors = require('cors');
require('dotenv').config()


// dRggtV8DxwiEehVF
app.use(cors());
app.use(express.json())

async function run() {


    const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.39aol.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


    try {
        await client.connect();
        const database = client.db('car-collection');
        const carsCollection = database.collection("cars");
        const usersCollection = database.collection("users");
        const bookingCollection = database.collection("books");
        const userReview = database.collection("reviews");
        //    const bookingCollection = database.collection("bookService") 
        //    const usersCollection = database.collection("users") 

        // get service api
        app.get('/cars', async (req, res) => {
            const cursor = carsCollection.find({});
            const service = await cursor.toArray();
            res.send(service);
        })

        // get singale api
        app.get('/cars/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const options = {
                projection: { _id: 0 },
            };
            const singleCar = await carsCollection.findOne(query, options)
            res.send(singleCar);
        })

        // post car
        app.post('/cars', async (req, res) => {
            const car = req.body;
            const result = await carsCollection.insertOne(car);
            res.send(result);
        })


        // post api on book
        app.post('/book', async (req, res) => {
            const bookService = req.body;
            const result = await bookingCollection.insertOne(bookService);
            res.send(result);
        })

        // get book apu
        app.get('/book', async (req, res) => {
            const book = await bookingCollection.find({}).toArray();
            res.send(book)
        })

        // get single book with email

        app.get('/book/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email }
            const book = bookingCollection.find(query);
            const bookService = await book.toArray();
            res.send(bookService)
        })


        // save user
        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user)
            res.send(result);
        })


        app.put('/users', async (req, res) => {
            const user = req.body;
            const filter = { email: user.email };
            const options = { upsert: true };
            const updateDoc = { $set: user };
            const result = await usersCollection.updateOne(filter, updateDoc, options);
            res.json(result);
        });

        app.put('/users/admin', async (req, res) => {
            const user = req.body;
            const filter = { email: user.email };
            const updateDoc = { $set: { role: "admin" } };
            const result = await usersCollection.updateOne(filter, updateDoc);
            res.json(result);
        })

        // get review api
        app.get('/reviews', async (req, res) => {
            const review = await userReview.find({}).toArray();
            res.send(review);
        })

        app.post('/reviews', async (req, res) => {
            const review = req.body;
            const result = await userReview.insertOne(review);
            res.send(result);
        })

        // get admin 
        app.get('/users/:email', async (req, res) => {
            const user = await usersCollection.findOne({ email: req.params.email });
            let Admin = false;
            if (user?.role === 'admin') {
                Admin = true;
            }
            res.json({ admin: Admin })
        })

        // update status
        app.put('/updateStatus/:id', async (req, res) => {
            const id = req.params.id;
            const updateStatus = req.body.status;
            const filter = { _id: ObjectId(id) };
            const result = await bookingCollection.updateOne(filter, {
                $set: { status: updateStatus },
            })
            res.send(result)
        })


        // delete api
        app.delete('/bookCar/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };

            const result = await bookingCollection.deleteOne(query);
            res.json(result);
        })


    }
    finally {

    }

}


run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Hello world')
})

app.listen(port, () => {
    console.log("my server is runningin port 5000")
})