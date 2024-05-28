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

After this, when you plug the Raspberry Pi into the Arduino, the loom motor should home itself.

You should be able to load the frontend by visiting loom.local:3000 in a browser.


# Details

This project has several parts:
1. A [React](https://react.dev/) frontend, which displays a grid of buttons. The buttons can be toggled to set a weave pattern. Rows can be sent to the loom one at a time, copy/pasted, or removed.
1. An [Express](https://expressjs.com/) server. This serves the frontend React app as a static page, and also exposes an API with a single endpoint ([/api/setrow/](https://github.com/jdelfino/serial-loom-controller/blob/main/server/index.js#L23)), which can be used to send a row to the loom.
1. 2 libraries for interacting with the loom via a serial port: [SerialGCodeDriver](https://github.com/jdelfino/serial-loom-controller/blob/main/server/SerialGCodeDriver.js) and [LoomDriver.js](https://github.com/jdelfino/serial-loom-controller/blob/main/server/LoomDriver.js). LoomDriver is a higher level library which exposes commands to move to a heddle and strike. SerialGCodeDriver is a lower level library that handles the 2 way serial communication with the loom (including resend handling, see [G-code](https://reprap.org/wiki/G-code#Replies_from_the_RepRap_machine_to_the_host_computer)).
1. Linux scripts and configuration to make the server launch when the loom is connected to the USB port. All of this is controlled by [setup.sh](https://github.com/jdelfino/serial-loom-controller/blob/main/setup.sh), which:
   * Allocates a 1GB swapfile (the 500MB RAM + 100MB default swap isn't enough)
   * Installs node via nvm
   * Installs the npm libraries needed to run the backend server
   * Sets up a [`systemctl`](https://www.digitalocean.com/community/tutorials/how-to-use-systemctl-to-manage-systemd-services-and-units) service to run the backend server
   * Sets up a [`udev`](https://opensource.com/article/18/11/udev) rule to start the service when something vaguely resembling the loom is connected to the USB port.

# Editing the frontend

The built frontend is checked into this repository (in [server/public](https://github.com/jdelfino/serial-loom-controller/tree/main/server/public). This isn't a great practice, but installing React on a Pi Zero takes a long time, and you shouldn't really be editing the frontend from the Pi.

To modify the frontend:
1. Check out this repository on your laptop or some other device.
2. Modify the frontend, and test it (suggestion: to test in isolation, comment out the [actual fetch call](https://github.com/jdelfino/serial-loom-controller/blob/main/loomapp/src/App.js#L14) to the backend API, and replace it with a 1 second sleep)
3. Run `npm build deploy`, which builds the app and copies it to `server/public`.
4. Stagem, commit, and push all changes.
5. Log onto the Pi Zero, run `git pull` from the `~/serial-loom-controller` directory, then run `sudo systemctl restart loom.service` to restart the server.

# Networking

The current Pi Zero is configured to have a static IP of 10.1.29.204 (configured by network administration, based on the Pi's mac address). It also broadcasts as `loom.local` on the local DNS, although this broadcast seems to be slow and flaky.

You can ssh into the loom with `ssh loom@10.1.29.204` or `ssh loom@loom.local`.
