// const { MongoClient, ServerApiVersion } = require("mongodb");
// require("dotenv").config();

// const client = new MongoClient(process.env.MONGO_URL,  {
//     serverApi: {
//         version: ServerApiVersion.v1,
//         strict: true,
//         deprecationErrors: true,
//     }
// });

// async function run() {
//     try {
//       // Connect the client to the server (optional starting in v4.7)
//     await client.connect();
//       // Send a ping to confirm a successful connection
//     await client.db("admin").command({ ping: 1 });
//     const data = await client.db().admin().listDatabases();
//     console.log(data);
//     console.log("Pinged your deployment. You successfully connected to MongoDB!");
//     } finally {
//       // Ensures that the client will close when you finish/error
//     await client.close();
//     }
// }

// run().catch(console.dir);

const mongoose = require('mongoose')
require('dotenv').config();

mongoose.connect(`${process.env.MONGO_URL}LawnTennis`)
.then(()=>{
    console.log('You successfully connected to MongoDB!');
}).catch((error)=>{
    console.log(error);
});