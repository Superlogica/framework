<?php

/**
 * Instalação padrão do Git
 */
function git_init() {
    exec_script("
        sudo mkdir /home/cloud
		sudo mkdir /home/framework
		sudo mkdir /home/apps
		sudo mkdir /home/plataforma
		sudo mkdir /home/cloud-db
		sudo mkdir /home/cloud-db/backup
		sudo mkdir /home/layouts
		sudo mkdir /home/cloud-admin
		sudo mkdir /home/subadquirente
		
		sudo chmod -R 777 /home/cloud
		sudo chmod -R 777 /home/framework
		sudo chmod -R 777 /home/apps
		sudo chmod -R 777 /home/plataforma
		sudo chmod -R 777 /home/cloud-db
		sudo chmod -R 777 /home/cloud-db/backup
		sudo chmod -R 777 /home/layouts
		sudo chmod -R 777 /home/cloud-admin
		sudo chmod -R 777 /home/subadquirente
		
		sudo apt-get install -y git-core
    ");
}

