<?php

function restaurarbkp_init(){


	exec_script("
		echo '------Tentando criar a pasta Backup------'
		sudo mkdir /home/backup/
		sudo chmod 777 -R /home/backup
		echo '------Iniciando restauracao------'
		gbak -create -v -user sysdba -password masterkey /home/cloud-db/backup.gbk 127.0.0.1:/home/cloud-db/restauracao-001.fdb
		sudo chmod 777 -R /home/cloud-db
	");
}
