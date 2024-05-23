# allocate swap, 500MB RAM + 100MB swap is not enough
sudo fallocate -l 1G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
sudo cp /etc/fstab /etc/fstab.bak
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab

# install nvm / node
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.2/install.sh | bash
nvm install --lts

# install node packages - they're stored in git because an `npm install` takes an hour
# on a pi zero
cp -r loomapp/node_modules_raspbian loomapp/node_modules
cp -r server/node_modules_raspbian loomapp/node_modules

echo "Run this command: source ~/.bashrc"

