# Loom Controller

This repository contains a React application + Express backend that allows control of 
the [serial loom](https://dl.acm.org/doi/10.1145/3411764.3445750) via a browser.

It is intended to run on Raspberry Pi Zero 2 W. 

# Set up

1. Download the [Raspberry Pi Imager](https://www.raspberrypi.com/software/)
2. Flash an SD card with Raspberry Pi OS Lite (64-bit) (found under "Raspberry Pi OS (Other)" in the imager)
   * Set the hostname to "loom"
   * Set the username and password both to "loom"
   * Configure WiFi to connect to the teacher's WiFi network, and Wireless LAN country to "US"
   * Set locale to America/New_York
   * (Services tab) Enable SSH with password authentication
3. Boot up the raspberry pi
4. From a terminal, run `ssh loom@loom.local`, enter `loom` as the password.
5. `sudo apt-get update`
6. `sudo apt-get install git`
7. `git clone https://github.com/jdelfino/serial-loom-controller.git`
8. `cd serial-loom-controller`
9. `./setup.sh`
10. Log out (ctrl-D), then SSH again (`ssh loom@loom.local`)
10. `cd server`
11. `nohup node index.js &`

After that, you are free to disconnect. You should be able to load the frontend by visiting loom.local:3000 in a browser.
