var driver = require('./SerialGCodeDriver.js');

/**
 *  A class to control the loom. It is a wrapper around the SerialGCodeDriver
 *  class that provides a simple interface for sending commands to the loom.
 */
class LoomDriver {
    constructor(port_name, baud_rate=115200) {
        this.port_name = port_name;
        this.baud_rate = baud_rate;
    }

    async open() {
        this.serial = new driver.SerialGCodeDriver(this.port_name, this.baud_rate);
        await this.serial.open();
    }

    // Strike the solenoid to drop a heddle.
    async strike() {
        await this.serial.send("M42 P9 S255");      // Drive solenoid pin high
        await this.serial.send("G4 P30");          // Hold High 50ms
        await this.serial.send("M42 P9 S0");      // Solenoid drive off
        await this.serial.send("G4 P51"); 
        await this.serial.send('M400');
    }
    
    // Move to a heddle. Heddles are numbered 0-39.
    async move_to_heddle(num) {
        if (num < 0 || num > 39) {
            console.log("Invalid heddle number: " + num + ", skipping.");
            return
        }
        await this.serial.send('G1 X' + (20 + (num * 10)));
        await this.serial.send('M400');
    }
}

module.exports = {
    LoomDriver
}