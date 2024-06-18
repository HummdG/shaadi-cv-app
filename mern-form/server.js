const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(cors());

const uri = "mongodb+srv://hummd2001:zIGI1mmNoU9eL8XS@cluster0.4xjxxak.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
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
    console.log("Successfully connected to MongoDB");

    const database = client.db('mern-form');
    const usersCollection = database.collection('users');

    // Define a schema-like structure for user data
    const userSchema = {
      name: String,
      height: Number,
      occupation: String,
      interests: String
    };

    // Define routes
    app.post('/api/users', async (req, res) => {
      try {
        const newUser = req.body;
        const result = await usersCollection.insertOne(newUser);
        res.json(result);
      } catch (err) {
        res.status(400).json('Error: ' + err);
      }
    });

    // Additional route to get all users (optional)
    app.get('/api/users', async (req, res) => {
      try {
        const users = await usersCollection.find().toArray();
        res.json(users);
      } catch (err) {
        res.status(400).json('Error: ' + err);
      }
    });

    app.listen(port, () => {
      console.log(`Server is running on port: ${port}`);
    });

  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

run().catch(console.dir);
