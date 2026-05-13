import express, { type Request, type Response } from 'express';
//import mongoSanitize from 'express-mongo-sanitize';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from "./src/db/connect.js"
import chatRoutes from './src/routes/chatRoutes.js';
import authRoutes from './src/routes/authRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
//app.use(mongoSanitize());

app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server is running!');
});

// veritabanı fonk
connectDB();

app.use('/api/chat', chatRoutes);
app.use('/api/auth', authRoutes);


app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});


/*
mongodb+srv://ikras:<db_password>@clusternew.olqu6am.mongodb.net/?appName=ClusterNew


const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://ikras:<db_password>@clusternew.olqu6am.mongodb.net/?appName=ClusterNew";

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
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);


*/
