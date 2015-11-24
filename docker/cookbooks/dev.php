<?php

function dev_init(){


exec_script("sudo apt-key adv --keyserver hkp://p80.pool.sks-keyservers.net:80 --recv-keys 58118E89F3A912897C070ADBF76221572C52609D
             cd /etc/apt/sources.list.d
             sudo wget https://raw.githubusercontent.com/Superlogica/framework/master/docker/docker.list
	     apt-get update 
  	     apt-get purge lxc-docker* 
apt-cache policy docker-engine 
sudo apt-get update 
sudo apt-get install docker-engine 
sudo service docker start
sudo apt-get update 
sudo apt-get install phpmyadmin
");




}
