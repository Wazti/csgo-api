const db = require("./db");
const { HLTV } = require('hltv')
const express =  require('express')
const app = express()
async function all(){
    const topTeams = await getTop()
    for (const team of topTeams) {
        db.getDB().collection('teams').updateOne(
            {name: team.team.name},
            {$set:{'id': team.team.id}},
            { upsert: true},  function (err, result){
            if (err) {
                console.log(err)
            }
        })
        const teamStats = await getTeam(team.team.id)
        console.log(team.team.name)
        const date = new Date().valueOf()
        teamStats.matches.forEach(async map => {
            if (date -  3 * 31 * 24 * 60 * 60 * 1000 <= map.dateApproximate) {
                db.getDB().collection('maps').updateOne(
                    {id: map.mapStatsId},
                    {$set:{'map': map.map, 'date': map.dateApproximate, 'team1': { 'name': team.team.name, 'id': team.team.id }, 
                    'team2': { 'id' : map.enemyTeam.id, 'name' : map.enemyTeam.name }}},
                    {upsert: true}, function(err, result) {
                        if (err) {
                            console.log(err)
                        }
                        console.log(`Положили карту ${map.mapStatsId} за ${team.team.name}`)
                    }
                )
            }
        })
        await sleep(3500)
        
    }
    await sleep(3000)
    db.getDB().collection('maps').find({}).toArray( async function(err, mapArr) {
        let count = 0
        let len = mapArr.length
        const date = new Date().valueOf()
        for (const map of mapArr) {
            count += 1
            if (date -  3 * 31 * 24 * 60 * 60 * 1000 <= map.date) {
                try {
                    await sleep(2000)
                    console.log(map.id)
                    let mapInfo = await getMapInfo(map.id)
                    await sleep(2000)
                    console.log(mapInfo.matchPageID, 'ID')
                    let { match, demo } = await getMatchMongo(mapInfo.matchPageID)
                    console.log(match)
                    if (!match) {
                        match = await getMatchInfo(mapInfo.matchPageID)
                        demo = match.demos.find((item) => item.name.includes('GOTV'))
                        console.log('Добавили матч')
                    } else {
                        console.log('Уже есть матч такой')
                    }
                    db.getDB().collection('matches').updateOne(
                        {id: mapInfo.matchPageID},
                        {$set:{'team1': map.team1, 'team2': map.team2, 'demo': demo.link, 'date': match.date}, $addToSet: {'maps': map}},
                        { upsert: true},  function (err, result){
                        if (err) {
                            console.log(err)
                        }
                    })
                } catch (e) {
                    console.log(e)
                }
            }
            console.log(`${count} из ${len}`)
        }
        console.log('Парсинг закончен')
    })
    
}
async function lastDay(){
    const matches  = await getResults()
    for (const match of matches) {
        const da = new Date().valueOf()
        if (da - 24 * 60 * 60 * 1000 <= match.date) {
            const res = await db.getDB().collection('teams').findOne({$or: [{name: match.team1.name}, { name: match.team2.name }]})
            console.log(res)
            if (res) {
                await sleep(3500)
                try {
                    const mtch = await getMatchInfo(match.id)
                    const maps = mtch.maps.map((map)=>{
                        if (map.statsId) {
                            db.getDB().collection('maps').updateOne(
                                {id: map.statsId},
                                {$set:{'map': map.name, 'date': match.date, 'team1': { 'name': mtch.team1.name, ' id': mtch.team1.id }, 
                                'team2': { 'id' : mtch.team2.id, 'name' : mtch.team2.name }}},
                                {upsert: true}, function(err, result) {
                                    if (err) {
                                        console.log(err)
                                    }
                                    console.log(`Положили ${map.statsId}`)
                                }
                            )
                            return { id: map.statsId, 'map': map.name, 'date': match.date, 'team1': { 'name': mtch.team1.name, 'id': mtch.team1.id }, 
                            'team2': { 'id' : mtch.team2.id, 'name' : mtch.team2.name }} 
                        }
                    })
                    demo = mtch.demos.find((item) => item.name.includes('GOTV'))
                    db.getDB().collection('matches').updateOne(
                        {id: match.id},
                        {$set:{'team1': mtch.team1, 'team2': mtch.team2, 'demo': demo.link, 'date': mtch.date}, $addToSet: {'maps': maps}},
                        { upsert: true},  function (err, result){
                        if (err) {
                            console.log(err)
                        }
                    })
                } catch (e) {
                    console.log(e)
                }
            }
        }
    }
    console.log('Парсинг закончен')
}
async function getMatchMongo(id) {
    const mtch = await db.getDB().collection('matches').findOne({id: id})
    if (mtch) 
    return {match: mtch, demo: {link : mtch.demo}} 
    else {
        return {match: null, demo: null}
    }
}
async function getTop () {
    const obj = await HLTV.getTeamRanking();
    return obj;
}
function sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  } 
async function getTeam(id) {
    const obj = await HLTV.getTeamStats({ id });
    return obj;
}
async function getMapInfo(id) {
    const obj = await HLTV.getMatchMapStats({ id });
    return obj;
}
async function getMatchInfo(id) {
    const obj = await HLTV.getMatch({ id });
    return obj;
}
async function getResults(){
    const obj = await HLTV.getResults({ startPage: 0, endPage: 2 });
    return obj;
}


async function clear(){
    await sleep(1000)
    db.getDB().collection('maps').drop(function (err, result) {
        if (err) throw err;
        if (result) console.log("Collection successfully deleted.");
        db.close();
    });
}
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
    else {
        app.listen(5000,()=>{
            console.log('connected to database, app listening on port 3000');
        });
    }
}); 
for (var i=0; i<process.argv.length;i++) {
    switch (process.argv[i]) {
        case 'all':
            console.log('Получаем инфу за все время')
            all();
            break;
        case 'clear':
            console.log('Чистить коллекцию')
            clear();
            break;
        case 'lastDay':
            console.log('Получаем инфу за последний день')
            lastDay();
            break;
    }
}

module.exports.all = all;
module.exports.clear = clear;
module.exports.lastDay = lastDay;