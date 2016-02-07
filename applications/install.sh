# usual stuff required by almost all
echo 'installing basic stuff'
sudo apt-get install build-essential libssl-dev
sudo apt-get install curl git

# installing google chrome
echo 'installing google chrome stable'
wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | sudo apt-key add -
sudo sh -c 'echo "deb http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google-chrome.list'
sudo apt-get install google-chrome-stable

# installing mongodb
echo 'installing mongodb'
sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv EA312927
# for 12.04
echo "deb http://repo.mongodb.org/apt/ubuntu precise/mongodb-org/3.2 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.2.list
# for 14.04
echo "deb http://repo.mongodb.org/apt/ubuntu trusty/mongodb-org/3.2 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.2.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo service mongod start

# meteor
echo 'installing meteor'
curl https://install.meteor.com/ | sh
