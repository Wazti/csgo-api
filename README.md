# CS-GO-API


[![Build Status](https://travis-ci.org/joemccann/dillinger.svg?branch=master)](https://travis-ci.org/joemccann/dillinger)

### Installation

Dillinger requires [Node.js](https://nodejs.org/) v4+ to run.

Install the dependencies and devDependencies and start the server.
`http://localhost:8000/api`

```sh
$ cd csgo-api
$ npm i
$ npm run start
```

Чтобы загрузить все матчи за последние 3 месяца

```sh
$ npm run all
```

### MONGO
Ставишь mongodb
Поднимаешь локально базу отдельным процессом
```sh
cd csgo-api
mongod --dbpath ${Путь}/csgo-api/data    
```
### Апишки
`/top`
Возвращает топ 30 команд
`/matchesRecent`
    Возвращает матчи за последние сутки
`/matches`
    Возвращает все матчи, которые есть в базе
`/team/${name}`
    Возвращает все матчи, в которых участвовала команда ${name}
`/maps`
    Возвращает все карты, которые есть в базе


