const express = require('express');
const app = express();

const equipes = require('./equipe.json');

app.use(express.json());

const MongoClient = require('mongodb').MongoClient;

const url = 'mongodb://localhost:27017';
const dbName = 'dbmonapi';

(async () => {
    try {
        const client = await MongoClient.connect(url);
        const db = client.db(dbName);

        console.log('Connexion réussi avec Mongo');

        // Display tous les equipes 
        app.get('/equipes', async (req, res) => {
            try{
                
                const docs = await db.collection('equipe').find({}).toArray();
                res.status(200).json(docs);
            }
            catch(err){
                console.log(err);
                throw err 
            }
        });

        // Search dans MongoDb
        app.get('/equipes/:id', async (req, res) => {
            const id = parseInt(req.params.id);
            try {
                const docs = await db.collection('equipe').find({id}).toArray();
                res.status(200).json(docs);
            } catch (err) {
                console.log(err);
                throw err;
            }
        });

        //Modifier
        app.put('/equipe/:id',async(req,res) =>{
            try {
                const id = parseInt(req.params.id);
                const replacementEquipe = req.body
                const equipe = await db.collection('equipe').replaceOne({id},replacementEquipe)
                    res.status(200).json(equipe)
            } 
            catch (err) {
                console.log(err);
                throw err;
            }
        })

        //suprimer 
        app.delete('/equipe/:id',async (req,res) => {
            try{
                const id=parseInt(req.params.id)
                const equipe = await db.collection("equipe").findOne({ id:id });
                if(!equipe){
                    res.status(404).json({message:"Equipe not found"})
                    return
                }
                 await db.collection('equipe').findOneAndDelete({id:id});
                res.status(200).json({message:"Suppression une equipe"});
            }
            catch(error){
                res.status(500).json({message:error.message});
            }
        })

        //ajout 
        app.post('/equipes',async (req,res)=>{
            try{
                const equipeData =req.body
                const equipe = await db.collection('equipe').insertOne(equipeData)
                res.status(200).json(equipe)
            }
            catch(err){
                console.log(err)
                throw err
            }
        })

        app.listen(82, () => {
            console.log('REST API via Express');
        });

    } catch (err) {
        console.log(err);
        throw err;
    }
})();
