<?php

/**
 * Init-Dev - Firebird3
 * @return [type] [description]
 */
function fb30_init(){

     $fb_ver = "3.0" ;
     $config = "/firebird/firebird30.conf";

     //Desinstala as versѕes antigas do Firebird
     exec_script("sudo apt-get autoremove firebird2* --purge -y");

     //Instala as dependъncias do Firebird 3
     $dependencias = array("python-software-properties");
     instalar($dependencias);

     exec_script("sudo add-apt-repository ppa:mapopa/firebird3.0 -y");
     $pacotes = array(
          "firebird3.0-server",
     	"firebird3.0-common", 
     	"firebird3.0-common-doc", 
     	"firebird3.0-utils", 
     	"libfbclient2", 
     	"libib-util"
     	);

     atualizar(); // Update no Servidor;
     instalar($pacotes);
     put_template($config, '/etc/firebird/3.0/firebird.conf');

     // Cria as pastas do cloud-db
     exec_script("
          mkdir -p /home/cloud-db/1; 
          mkdir -p /home/cloud-db/bkp;
          chown firebird.firebird /home/cloud-db/ -R;"
          );

     // Cria as pastas de dados do Firebird 3.0
     exec_script("
          sudo mkdir -p /run/firebird3.0/;
          chmod 777 /run/firebird3.0 -R;
          ");

     // Coloca o firebird na inicializaчуo do sistema
     exec_script("
          sudo systemctl enable firebird3.0.service;
          sudo systemctl start firebird3.0.service
          ");

}


