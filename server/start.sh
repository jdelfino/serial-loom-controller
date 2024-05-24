#!/bin/bash
stty -F /dev/ttyACM0 115200 -echo -echoe -echok -echoctl -echoke
. /home/loom/.nvm/nvm.sh
npm run start
