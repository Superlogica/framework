<?php

function mongodb_init(){
    
    exec_script("
        sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 7F0CEB10;
        echo 'deb http://repo.mongodb.org/apt/ubuntu '$(lsb_release -sc)'/mongodb-org/3.0 multiverse' | sudo tee /etc/apt/sources.list.d/mongodb-org-3.0.list;
        sudo apt-get update;
        sudo apt-get install -y mongodb-org=3.0.4 mongodb-org-server=3.0.4 mongodb-org-shell=3.0.4 mongodb-org-mongos=3.0.4 mongodb-org-tools=3.0.4;
        sudo service mongod stop;
        sudo sed -i 's/bind_ip/#bind_ip/g' /etc/mongod.conf
        sudo service mongod start;
    ");

}
