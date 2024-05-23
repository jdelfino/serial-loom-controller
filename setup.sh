#!/bin/bash
# allocate swap, 500MB RAM + 100MB swap is not enough
sudo fallocate -l 1G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
sudo cp /etc/fstab /etc/fstab.bak
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab

# allow loom to access serial ports
sudo adduser loom dialout

# set up the loom server as a service, so it starts whenever the pi boots up
sudo cp /home/loom/serial-loom-controller/loom.service /lib/systemd/system/
sudo systemctl start loom.service
sudo systemctl enable loom.service

# install nvm / node
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.2/install.sh | bash
nvm install --lts

source ~/.bashrc
cd server
npm install

echo "You must log out and log back in for all changes to take effect"
