var LoomDriver = require('./LoomDriver.js');

const express = require('express')
const path = require('path')    
const app = express()
const port = 3000

app.use(express.json());

app.use(express.static(path.join(__dirname, './public')));

const driver = new LoomDriver.LoomDriver('/dev/ttyACM0');

(async () => await driver.open())();
console.log("Connected to loom");

function sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }

app.post('/api/setrow', async (req, res) => {
    console.log("got a row");
    console.log(req.body);
    for (let i = 0; i < req.body.length; i++) {
      if (req.body[i] == 1) {
        await driver.move_to_heddle(i)
        await driver.strike();
      }
    }
    await driver.home();
    res.send(req.body);
});

app.get('/', (req, res) => {
    res.send('Hello WTF!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
