const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5001;

// middlewares

app.use(cors());

app.use(express.json());

// Mongo DB Connection

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@mongodbcloud.ja2jrii.mongodb.net/?retryWrites=true&w=majority`;

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
        const userCollection = database.collection("users");
        const productCollection = database.collection("products");
        const productCartCollection = database.collection("cartProducts");

        // Product related APIs

        // GET API for all products 
        app.get('/products', async (req, res) => {
            const cursor = productCollection.find()
            const result = await cursor.toArray()
            console.log(result);
            res.send(result);
        })

        // GET API for single product
        app.get('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const product = await productCollection.findOne(query);
            res.send(product);
        })

        // GET API for selected brand products
        app.get('/products-by-brand/:bname', async (req, res) => {
            const bname = req.params.bname;
            console.log('Brand Name:', bname);
            const query = { bname: bname };
            const selectedBrandProducts = productCollection.find(query);
            const result = await selectedBrandProducts.toArray()
            res.send(result);
        });


        // POST API for add product
        app.post('/products', async (req, res) => {
            const product = req.body;
            console.log(product);
            try {
                const result = await productCollection.insertOne(product);
                res.json({ message: "Product added successfully", result });
            } catch (error) {
                console.error(error);
                res.status(500).json({ error: "An error occurred while adding the product." });
            }
        });

        // PUT API for update product
        app.put('/products/:id', async (req, res) => {
            const id = req.params.id;
            console.log('Client requested to update product with ID:', id);
            const product = req.body;
            console.log(id, product);
            const filter = { _id: new ObjectId(id) };
            const updatedProduct = {
                $set: {
                    pname: product.pname,
                    bname: product.bname,
                    selectedType: product.selectedType,
                    price: product.price,
                    image: product.image,
                    des: product.des,
                    rating: product.rating,
                }
            }
            const options = { upsert: true };
            const result = await productCollection.updateOne(filter, updatedProduct, options);
            res.json({ message: 'User updated successfully' });
        })

        // Product Cart Related APIs

        // API to add a product to the cart
        app.post('/add-to-cart', async (req, res) => {
            const product = req.body;
            console.log(product);
            const result = await productCartCollection.insertOne(product);
            console.log(result)
            res.json({ message: "Product added to cart successfully", result });
        });


        // // API to get the user's cart
        // app.get('/products/cart', async (req, res) => {
        //     const cursor = productCartCollection.find()
        //     const result = await cursor.toArray()
        //     console.log(result);
        //     res.send(result);
        // });

        // API to remove a product from the cart
        // app.delete('/api/remove-from-cart/:id', async (req, res) => {
        //     const itemId = req.params.id;
        //     try {
        //         await CartItem.findByIdAndRemove(itemId);
        //         res.json({ message: 'Product removed from cart.' });
        //     } catch (error) {
        //         console.error(error);
        //         res.status(500).json({ error: 'An error occurred while removing the product from the cart.' });
        //     }
        // });


        app.delete('/products/:id', async (req, res) => {
            const id = req.params.id;
            console.log('Fronted requested: please delete', id, 'this user from mongodb');
            const query = { _id: new ObjectId(id) };
            const result = await coffeeCollection.deleteOne(query);
            console.log('Requested user', id, 'deleted successfully');
            res.send(result);
        })

        // User Management related apis

        // GET API for all users
        app.get('/users', async (req, res) => {
            const cursor = userCollection.find()
            const result = await cursor.toArray()
            console.log(result);
            res.send(result);
        });

        // GET API for single User
        app.get('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const user = await userCollection.findOne(query);
            res.send(user);
        })

        // POST API
        app.post('/users', async (req, res) => {
            const user = req.body;
            console.log(user);
            try {
                const result = await userCollection.insertOne(user);
                res.json({ message: "User added successfully", result });
            } catch (error) {
                console.error(error);
                res.status(500).json({ error: "An error occurred while adding the user." });
            }
        });


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