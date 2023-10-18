const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5001;

// middlewares

app.use(cors());

// const corsConfig = {
//     origin: '',
//     credentials: true,
//     methods: ['GET', 'POST', 'PUT', 'DELETE']
// }
// app.use(cors(corsConfig))
// app.options("", cors(corsConfig))

app.use(express.json());

// Mongo DB Connection

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@mongodbcloud.ja2jrii.mongodb.net/?retryWrites=true&w=majority`;
// const uri = "mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.0.1";
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        await client.connect();

        const database = client.db("brandShopDB");
        const brandCollection = database.collection("brands");
        const userCollection = database.collection("users");
        const productCollection = database.collection("products");

        app.get('/brands', async (req, res) => {
            const cursor = brandCollection.find()
            const result = await cursor.toArray()
            console.log(result);
            res.send(result);
        })

        // app.get('/brands/:id', async (req, res) => {
        //     const id = req.params.id;
        //     const query = { _id: new ObjectId(id) };
        //     const coffee = await coffeeCollection.findOne(query);
        //     res.send(coffee);

        // })

        // app.post('/brands', async (req, res) => {
        //     console.log(req.body);
        //     const newCoffee = req.body;
        //     const result = await coffeeCollection.insertOne(newCoffee);
        //     res.send(result);
        // })

        // app.put('/brands/:id', async (req, res) => {
        //     const id = req.params.id;
        //     console.log('Frontend requested to update user with ID:', id);
        //     const coffee = req.body;
        //     console.log(id, coffee);
        //     const filter = { _id: new ObjectId(id) };
        //     const updatedCoffee = {
        //         $set: {
        //             name: coffee.name,
        //             supplier: coffee.supplier,
        //             category: coffee.category,
        //             price: coffee.price,
        //             taste: coffee.taste,
        //             details: coffee.details,
        //             photo: coffee.photo,
        //         }
        //     }
        //     const options = { upsert: true };
        //     const result = await coffeeCollection.updateOne(filter, updatedCoffee, options);
        //     res.json({ message: 'User updated successfully' });
        // })

        // app.delete('/brands/:id', async (req, res) => {
        //     const id = req.params.id;
        //     console.log('Fronted requested: please delete', id, 'this user from mongodb');
        //     const query = { _id: new ObjectId(id) };
        //     const result = await coffeeCollection.deleteOne(query);
        //     console.log('Requested user', id, 'deleted successfully');
        //     res.send(result);
        // })

        await client.db("admin").command({ ping: 1 });
        console.log("Pinged!!! You are successfully connected to MongoDB!");
    } finally {
        // await client.close();
    }
}
run().catch(console.log);



app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/index.html'));
})

app.listen(port, () => console.log(`Brand Shop CRUD Backend server running on port ${port}!`));