const express = require('express')
const path = require('path')
const app = express()
const {bots, playerRecord} = require('./data')
const {shuffleArray} = require('./utils')
const cors = require("cors")

app.use(cors());
app.use(express.json())

// include and initialize the rollbar library with your access token
var Rollbar = require('rollbar')
const { resolveModuleName, resolveProjectReferencePath } = require('typescript')
var rollbar = new Rollbar({
  accessToken: 'b225299eb8f44e9e8d0cfba3f56d8c6c',
  captureUncaught: true,
  captureUnhandledRejections: true,
})

// record a generic message and send it to Rollbar
rollbar.log('Hello world!')

app.use('/js', express.static(path.join(__dirname, 'public/index.js')))

app.use('/css', express.static(path.join(__dirname, 'public/index.css')))

app.use('/html', express.static(path.join(__dirname, 'public/index.html')))

app.get("/", function (req, res) {
    rollbar.info("HTML served successfully")
    res.sendFile(path.join(__dirname, "public/index.html"))
})

app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "public/index.css"))
})

app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "public/index.js"))
})



app.get('/api/robots', (req, res) => {
    try {
        res.status(200).send(botsArr)
    } catch (error) {
        console.log('ERROR GETTING BOTS', error)
        res.sendStatus(400)
    }
})

app.get('/api/robots/five', (req, res) => {
    rollbar.info("The robots have been shuffled to the player.")
    try {
        let shuffled = shuffleArray(bots)
        let choices = shuffled.slice(0, 5)
        let compDuo = shuffled.slice(6, 8)
        res.status(200).send({choices, compDuo})
    } catch (error) {
        rollbar.critical('ERROR GETTING FIVE BOTS!')
        console.log('ERROR GETTING FIVE BOTS', error)
        res.sendStatus(400)
    }
})

app.post('/api/duel', (req, res) => {
    try {
        // getting the duos from the front end
        let {compDuo, playerDuo} = req.body

        // adding up the computer player's total health and attack damage
        let compHealth = compDuo[0].health + compDuo[1].health
        let compAttack = compDuo[0].attacks[0].damage + compDuo[0].attacks[1].damage + compDuo[1].attacks[0].damage + compDuo[1].attacks[1].damage
        
        // adding up the player's total health and attack damage
        let playerHealth = playerDuo[0].health + playerDuo[1].health
        let playerAttack = playerDuo[0].attacks[0].damage + playerDuo[0].attacks[1].damage + playerDuo[1].attacks[0].damage + playerDuo[1].attacks[1].damage
        
        // calculating how much health is left after the attacks on each other
        let compHealthAfterAttack = compHealth - playerAttack
        let playerHealthAfterAttack = playerHealth - compAttack

        // comparing the total health to determine a winner
        if (compHealthAfterAttack > playerHealthAfterAttack) {
            rollbar.log("The player has lost against the computer")
            playerRecord.losses++
            res.status(200).send('You lost!')
        } else {
            rollbar.log("The player has won against the computer")
            playerRecord.losses++
            res.status(200).send('You won!')
        }
    } catch (error) {
        rollbar.error('ERROR DUELING')
        console.log('ERROR DUELING', error)
        res.sendStatus(400)
    }
})

app.get('/api/player', (req, res) => {
    try {
        rollbar.log("Player Record sent")
        res.status(200).send(playerRecord)
    } catch (error) {
        console.log('ERROR GETTING PLAYER STATS', error)
        res.sendStatus(400)
    }
})

app.use(rollbar.errorHandler())

const port = process.env.PORT || 3000

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})