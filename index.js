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
app.get("/hello",(req,res)=>{
    res.send("Hello update here");
})
app.listen(port,()=>{
    console.log("Genius Server is running",port)
})
/*
// one time
1.Heroku init 
2. .gitignore
Every:
1.git init 
2. .gitignore(node_modules,.env)
3.push everything from git.
make sure you have that script:(start:node index.js)
5.make sure : in port port number put (process.env.PORT || 5000)
6.heroku login
7.heroku create (only one time project)
8.commad :git push heroku main

-------------
update :
git add .
git commit -m
git push
Then save everything
git push heroku main
*/