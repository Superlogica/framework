<?php

function hhvm_init($maq="trusty"){


exec_script("
cloud-init cloud default
wget -O - http://dl.hhvm.com/conf/hhvm.gpg.key | sudo apt-key add -
echo deb http://dl.hhvm.com/ubuntu $maq main | sudo tee /etc/apt/sources.list.d/hhvm.list
sudo apt-get update
sudo apt-get install hhvm
sudo update-rc.d hhvm defaults
sudo /usr/share/hhvm/install_fastcgi.sh
sudo rm -Rf /var/www/html/
sudo ln -s /home/cloud/public /var/www/html
");

put_template("hhvm_proxy_fcgi.conf", "/etc/apache2/mods-available/hhvm_proxy_fcgi.conf");

}
