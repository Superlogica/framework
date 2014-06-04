!/bin/bash
sudo apt-get install unzip;
cd /home/apps/; sudo wget https://github.com/Superlogica/framework/archive/master.zip; unzip -d /home/apps master.zip;
sudo cp framework-master/* .
rm -rvf framework-master; rm -rvf master.zip