!/bin/bash
sudo apt-get install unzip;
cd /home/apps/; sudo wget http://github.com/Superlogica/framework/archive/master.zip; unzip -d /home/apps master.zip;
sudo cp -f -R framework-master/* .
sudo cp -f -R ./vagrant/* /vagrant
rm -rvf framework-master; rm -rvf master.zip