var LoomDriver = require('./LoomDriver.js');
const driver = new LoomDriver.LoomDriver('/dev/cu.usbmodem1301');

(async () => {
await driver.open();
console.log("opened");
await driver.move_to_heddle(5);
await driver.strike();
})();