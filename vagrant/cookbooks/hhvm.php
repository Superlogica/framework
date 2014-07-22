function hhvm($maq="precise"){


exec_script("
wget -O - http://dl.hhvm.com/conf/hhvm.gpg.key | sudo apt-key add -
echo deb http://dl.hhvm.com/ubuntu $maq main | sudo tee /etc/apt/sources.list.d/hhvm.list
sudo apt-get update
sudo apt-get install hhvm
sudo update-rc.d hhvm defaults
sudo /usr/share/hhvm/install_fastcgi.sh
");

}
