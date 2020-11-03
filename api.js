const { HLTV } = require('hltv')
const express =  require('express')
const db = require("./db");
const router = express.Router()
const app = express()
db.connect((err)=>{
    // If err unable to connect to database
    // End application
    if(err){
        console.log('unable to connect to database');
        process.exit(1);
    }
    // Successfully connected to database
    // Start up our Express Application
    // And listen for Request
    else{
        app.listen(3000,()=>{
            console.log('connected to database, app listening on port 3000');
        });
    }
});

router.get('/top', (req, res) => {
    db.getDB().collection('teams').find({}).toArray(function(err, obj) {
        res.send(obj)
    })
})
router.get('/match/:id', (req,res) => {
    HLTV.getMatch({id: req.params.id}).then(obj => {
        res.send(obj)
    })
})
router.get('/map/:id', (req,res) => {
    HLTV.getMatchMapStats({id: req.params.id}).then(obj => {
        res.send(obj)
    })
})
router.get('/matchesRecent',(req,res) => {
    const da = new Date().valueOf()
    db.getDB().collection('matches').find({'date': {$gt: da - 24*60*60*1000}}).toArray(function(err, obj) {
        res.send(obj)
    })
})
router.get('/matches', (req,res) => {
    db.getDB().collection('matches').find({}).toArray(function(err, obj) {
        res.send(obj)
    })
})
router.get('/maps', (req,res) => {
    db.getDB().collection('maps').find({}).toArray(function(err, obj) {
        res.send(obj)
    })
})
router.get('/team/:name', (req,res) => {
    db.getDB().collection('matches').find({$or: [{'team1.name' : req.params.name}, { 'team2.name' : req.params.name }]}).toArray(function(err, obj) {
        console.log(obj)
        res.send(obj)
    })
})
router.get('/recent', (req,res) => {
    HLTV.getResults({startPage:0,endPage:2}).then(obj => {
        res.send(obj)
    })
})
module.exports = router
