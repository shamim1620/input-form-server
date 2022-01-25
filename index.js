const express = require('express')
const { MongoClient } = require('mongodb');
const cors = require('cors')
require('dotenv').config()
const ObjectId = require('mongodb').ObjectId;

const app = express()
const port = 5000

app.use(cors())
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.iwf59.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db('email_store');
        const emailCollection = database.collection('user');

        // GET API 
        app.get('/users', async (req, res) => {
            const cursor = emailCollection.find({});
            const users = await cursor.toArray();
            res.send(users);
        })

        // POST API 
        // app.post('/users', async (req, res) => {
        //     const user = req.body;
        //     const result = await emailCollection.insertOne(user);

        //     res.json(result)

        // })

        //UPSERT API
        app.put('/users', async (req, res) => {
            const user = req.body;
            const filter = { email: user.email };
            const options = { upsert: true };
            const updateDoc = { $set: user };
            const result = await emailCollection.updateOne(filter, updateDoc, options);

            res.json(result)

        })


        //DELETE API
        app.delete('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await emailCollection.deleteOne(query)

            res.json(1);

        })

    }
    finally {
        // await client.close();
    }

}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})