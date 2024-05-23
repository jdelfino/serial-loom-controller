#!/bin/bash
# allocate swap, 500MB RAM + 100MB swap is not enough
if [ ! -f /swapfile ]; then
    sudo fallocate -l 1G /swapfile
    sudo chmod 600 /swapfile
    sudo mkswap /swapfile
    sudo swapon /swapfile
    sudo cp /etc/fstab /etc/fstab.bak
    echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
fi

# set up the loom server as a service, so it starts whenever the pi boots up
sudo cp /home/loom/serial-loom-controller/loom.service /lib/systemd/system/
sudo systemctl start loom.service
sudo systemctl enable loom.service

# install nvm / node
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.2/install.sh | bash

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion

nvm install --lts

cd server
npm install

sudo cp /home/loom/serial-loom-controller/loom.service /lib/systemd/system/
sudo systemctl daemon-reload
sudo systemctl start loom.service
sudo systemctl enable loom.service

