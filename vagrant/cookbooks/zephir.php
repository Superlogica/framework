<?php

function zephir_init(){


exec_script("
cd /tmp
git clone https://github.com/json-c/json-c.git
cd json-c
sh autogen.sh
./configure
make && sudo make install
cd /tmp
git clone https://github.com/phalcon/zephir
cd zephir
./install -c
sudo apt-get install vim
");

}
