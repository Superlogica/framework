<?php

function zephir_init(){


exec_script("
sudo cloud-init php54atualizado
sudo apt-get -y install git gcc make re2c php5 php5-dev libpcre3-dev
cd /tmp
cd /tmp; sudo git clone https://github.com/json-c/json-c.git
cd /tmp/json-c; sh autogen.sh; ./configure; make && sudo make install
cd /tmp; sudo git clone https://github.com/phalcon/zephir
cd /tmp/zephir; ./install -c
sudo apt-get -y install vim
");

}
