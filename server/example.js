var driver = require('./LoomDriver.js');

(async () => {
    // Create a new loom driver by naming the USB port it is connected to
    var l = new driver.LoomDriver('/dev/cu.usbmodem11301');

    // Wait for the connection to be established and the loom to home itself
    await l.open();

    // Strike each heddle in sequence
    for (var i = 0; i < 40; i++) {
        await l.move_to_heddle(i);
        await l.strike();
    }
    /*
    for (var i = 0; i < 200; i++) {
        await l.move_to_heddle(10);
        await l.move_to_heddle(7);
    }
    */
})()
