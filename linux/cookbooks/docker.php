<?php 
function docker_init() {
	//Instalação do Docker
	exec_script("
			sudo apt-get update && apt-get install curl libcurl3 libcurl3-dev php5-curl -y;
			curl -sSL https://get.docker.com/ | sh 
		");

	//Instalação do Docker Compose
	exec_script("
		curl -L https://github.com/docker/compose/releases/download/1.8.0/docker-compose-`uname -s`-`uname -m` > /usr/local/bin/docker-compose;
		chmod +x /usr/local/bin/docker-compose;
		");
}
