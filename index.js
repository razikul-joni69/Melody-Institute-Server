const express = require('express')
const cors = require("cors")
const dotenv = require("dotenv").config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 8000

const app = express();

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

//TODO: temp json files
const classes = require("./data/classes.json")

const client = new MongoClient(process.env.MONGODB_URI, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});
async function main() {
    try {
        await client.connect()
        console.log("Database Connection Established!")

        app.listen(port, () => {
            console.log(`Melody Institute app listening on port ${port}`)
        })

        app.get('/', (req, res) => {
            res.send('🆗 Melody Institute Server in running!')
        })

        const userCollection = client.db("melody-institute").collection("users")
        const classCollection = client.db("melody-institute").collection("classes")

        // INFO: Users
        app.get('/api/v1/users', async (req, res) => {
            const result = await userCollection.find({}).toArray()
            res.send(result)
        });

        app.get('/api/v1/users/:email', async (req, res) => {
            const email = req.params.email;
            const result = await userCollection.findOne({ email: email }, { projection: { _id: 0, role: 1 } })
            res.send(result)
        });

        app.post('/api/v1/user', async (req, res) => {
            const user = req.body;
            const result = await userCollection.insertOne(user)
            res.send(result)
        })

        // INFO: Classes
        app.get("/api/v1/classes", async (req, res) => {
            res.send(classes)
        });

        app.post("/api/v1/classes", async (req, res) => {
            const cls = req.body;
            const result = await classCollection.insertOne(cls);
            res.send(result);
        })

    } catch (e) {
        console.log(e.message)
    }
}

main()

