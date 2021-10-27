const express =require("express");
const { MongoClient } = require('mongodb');
const ObjectId = require("mongodb").ObjectId;
const cors =require("cors");
require('dotenv').config()


const app=express();
const port =process.env.PORT || 5000;

// middllleware
app.use(cors());
app.use(express.json());
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ej29o.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
    async function run() {
        try {
            await client.connect();
           const database=client.db("carMechanic");
           const servicesCollection=database.collection("services")
        // post api
        app.post("/services",async(req,res)=>{
            const service =req.body;
            console.log("hitting thee post api",service);
            const result =await servicesCollection.insertOne(service);
            console.log(result);
            res.json(result);
        });
         
        // Get all Data
        app.get("/services",async(req,res)=>{
            const cursor =servicesCollection.find({});
            const services =await cursor.toArray();
            res.send(services);
        });
       // get single sevice
        app.get("/services/:id",async(req,res)=>{
            const id =req.params.id;
            console.log("getting spacific id",id);
            const query ={_id:ObjectId(id)};
            const service= await servicesCollection.findOne(query);
            res.json(service);
        });
        // Delete api
        app.delete("/services/:id", async(req,res)=>{
            const id =req.params.id;
            console.log(id);
            const query={_id:ObjectId(id)};
            const result = await servicesCollection.deleteOne(query);
            res.json(result);

        })
         
        } finally {
            //  await client.close();
        }
}
run().catch(console.dir);


app.get("/",(req, res)=>{
    res.send("Running is on");
});
app.listen(port,()=>{
    console.log("Genius Server is running",port)
})