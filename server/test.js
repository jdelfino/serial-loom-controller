var LoomDriver = require('./LoomDriver.js');
const driver = new LoomDriver.LoomDriver('/dev/ttyACM0');

(async () => {
await driver.open();
console.log("opened");
await driver.move_to_heddle(5);
await driver.strike();
})();
