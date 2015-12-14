<?php

function criarbkp_init(){


	exec_script("
		echo '------Tentando criar a pasta Backup------'
		sudo mkdir /home/cloud-db/backup
		sudo chmod 777 -R /home/cloud-db/backup
		echo '------Iniciando criaчуo------'
		gbak -backup -v -garbage -limbo -user sysdba -password masterkey /home/cloud-db/backup/base.fdb 127.0.0.1:/home/cloud-db/backup/backup.gbk
		sudo chmod 777 -R /home/cloud-db
	");
}
