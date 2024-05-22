var serialport = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline')

var SerialPort = serialport.SerialPort;

// This class is a wrapper around the SerialPort class that provides a simple
// interface for sending GCode commands to a serial device. It is designed to
// be used with the Repetier firmware.
class SerialGCodeDriver {
    constructor(port_name, baud_rate) {
        this.port_name = port_name;
        this.baud_rate = baud_rate;
    }

    async open() {
        return new Promise((resolve, reject) => {
            this.port = new SerialPort({
                baudRate: this.baud_rate,
                path: this.port_name
            });

            this.port.on('open', () => {
                var gc = this;
                var response_parser = this.port.pipe(new ReadlineParser({ delimiter: '\r\n' }))
                this.port.flush();
                
                response_parser.on('data', async function(data) {
                    if (data.startsWith('Free RAM:')) {
                        response_parser.on('data', (data) => { gc.handle_data(gc, data); });
                        await gc.send('G28');
                        resolve() 
                    }
                });

                this.sending = false;
                this.queue = [];
                this.sent = [];

                this.port.on('error', function (err) {
                    console.log(err);
                });
            
                this.port.on('close', function () {
                    process.exit(0);
                }); 
            });
        });   
    }

    handle_data(gc, data) {
        if (data.startsWith('ok')) {
            var next = gc.sent.shift();
            if(next) {
                var [cmd, callback] = next;
                callback();
            }
        }
        else if(data.startsWith('Resend')) {
            console.log("Got resend request: " + data);
            
            const spl = data.split(':');
            if(spl != undefined && spl.length > 1) {
                const index = parseInt(spl[1]);
                if(index <= gc.sent.length) {
                    var to_resend = gc.sent.splice(-index, 1)[0];
                    console.log("Resending command " + index + ": " + to_resend[0]);
                    gc.queue.push(to_resend);
                }
            }
        }
        else if (data != 'wait') {
            console.log(data);
        }
        gc.dequeue();
    }

    dequeue() {
        if(this.sending) {
            return;
        }
        
        var next = this.queue.shift();
        if (!next) {
            return;
        }

        var [cmd, callback] = next;

        this.sending = true;
        var gc = this;
        this.port.write(cmd + '\n', function (err) {
            if (err) {
                console.log(err);
            }
            gc.sent.push(next);
            gc.sending = false;
            gc.dequeue();
        });
    }

    async send(cmd) {
        return new Promise((resolve, reject) => {
            this.queue.push([cmd, function() {
                resolve();
            }]);
            this.dequeue();
        });
    }
}

module.exports = {
    SerialGCodeDriver
}
