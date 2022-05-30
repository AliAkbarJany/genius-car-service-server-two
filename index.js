const express=require('express')
const cors=require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app=express()
const port=process.env.PORT||5000;

require('dotenv').config();

// middlewear...
app.use(cors())
app.use(express.json())


// URI er Vetor-a (template string use korte hobe) User::(${process.env.DB_USER}) PASS:(${process.env.DB_PASS})
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.f7zhn.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run () {

    try{
        await client.connect();
        const serviceCollection=client.db('geniusCarTwo').collection('servicTwo')

        // READ/get (multiple) user...
        app.get('/service',async(req,res)=>{
            const query={}
            const cursor=serviceCollection.find(query);
            const services=await cursor.toArray()
            res.send(services)
        })

        // READ/get (single) user...
        app.get('/service/:id',async(req,res)=>{
            const id=req.params.id;
            const query={_id:ObjectId(id)}
            const service=await serviceCollection.findOne(query)
            res.send(service)
        })

        // psot/create data//
        app.post('/service',async(req,res)=>{
            const newService=req.body;
            console.log(newService)
            const result= await serviceCollection.insertOne(newService)
            res.send(newService)
        })

        // Delete ...
        app.delete('/service/:id',async(req,res)=>{
            const id=req.params.id;
            const query={_id:ObjectId(id)}
            const result=await serviceCollection.deleteOne(query)
            res.send(result);
        })
    }
    finally{
        // await client.close()
    }

}
run().catch(console.dir)


app.get('/',(req,res)=>{
    res.send('Running Genius Server')
})

// READ (single) document...
app.get('/user/:userId',(req,res)=>{
    console.log(req.params)
    // const id=req.params.id;
    // console.log(id)
    res.send("single user READ")
})

app.listen(port,()=>{
    console.log('Listening to port',port)
})