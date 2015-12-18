<?php

function restaurarbkp_init(){


	exec_script("
		echo '------Tentando criar a pasta Backup------'
		sudo mkdir /home/cloud-db/backup
		sudo chmod 777 -R /home/cloud-db/backup
		echo '------Iniciando restauracao------'
		gbak -create -v -user sysdba -password masterkey /home/cloud-db/backup/backup.gbk 127.0.0.1:/home/cloud-db/restauracao-001.fdb 2>> /home/cloud-db/backup/log-restauracao.txt
		sudo chmod 777 -R /home/cloud-db
	");
}