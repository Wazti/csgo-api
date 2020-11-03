
const express = require('express')
const PORT = process.env.PORT || 8000
const app = express()
app.use("/api", require("./api"))
app.listen(PORT, () => {
    console.log('Hi, bitch')
})