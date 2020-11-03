# CS-GO-API


[![Build Status](https://travis-ci.org/joemccann/dillinger.svg?branch=master)](https://travis-ci.org/joemccann/dillinger)

### Installation

Dillinger requires [Node.js](https://nodejs.org/) v4+ to run.

Install the dependencies and devDependencies and start the server.

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
