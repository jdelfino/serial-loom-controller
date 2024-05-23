# Loom Controller

This repository contains a React application + Express backend that allows control of 
the [serial loom](https://dl.acm.org/doi/10.1145/3411764.3445750) via a browser.

It is intended to run on Raspberry Pi Zero 2 W. 

# Set up

1. Download and open the [Raspberry Pi Imager](https://www.raspberrypi.com/software/)
1. Flash the OS image to an SD card
   * Select "Raspberry Pi Zero 2 W" (or whichever version of Pi you're using)
   * Select Raspberry Pi OS Lite (64-bit) (found under "Raspberry Pi OS (Other)" in the imager)
   * Select the SD card as the storage
   * Click "Next"
   * Select "Edit settings"
      * Set the hostname to "loom"
      * Set the username and password both to "loom"
      * Configure WiFi to connect to the teacher's WiFi network, and Wireless LAN country to "US"
      * Set locale to America/New_York
      * (Services tab) Enable SSH with password authentication
   * Click "Yes"/"Ok" until the flashing starts, then wait 
1. Boot up the raspberry pi
1. From a terminal, run `ssh loom@loom.local`, enter `loom` as the password.
1. `sudo apt-get update && sudo apt-get --assume-yes install git`
1. `git clone https://github.com/jdelfino/serial-loom-controller.git`
1. `cd serial-loom-controller`
1. `./setup.sh`
   * This will take a few minutes, be patient
1. Log out (ctrl-D), then SSH again (`ssh loom@loom.local`)
1. `cd server`
1. `nohup node index.js &`

After that, you are free to disconnect. You should be able to load the frontend by visiting loom.local:3000 in a browser.
