<?php 
/**
 * Instalação do Docker e Docker Compose
 * @author  Matheus Scarpato Fidelis
 * @email   matheus.scarpato@superlogica.com
 * @date    06/10/2016
 */

/**
* Init Method
* @return none
*/
function docker_init($arg)  {
	switch (trim(strtolower($arg)))  {
		case 'help':
			helper();
			break;

		case 'docker':
			install_docker();
			break;

		case 'compose':
			install_compose();
			break;

		default:
			todos();
			break;
	}
}

/**
* instalação do Docker 
* @return none
*/
function install_docker() {
	exec_script("
		curl -sSL https://get.docker.io | sh;
		sudo usermod -aG docker root;
		sudo usermod -aG docker ubuntu;
		systemctl enable docker;
		/etc/init.d/docker start;");
}

/**
* Instalação do Docker Compose
* @return none
*/
function install_compose() {
	exec_script("
		curl -L https://github.com/docker/compose/releases/download/1.8.0/docker-compose-`uname -s`-`uname -m` > /usr/local/bin/docker-compose;
		chmod +x /usr/local/bin/docker-compose;
		docker-compose --version;");
}

/**
* Instala todos os componentes do Docker
* @return none
*/
function todos() {
	install_docker();
	install_compose();
}

/**
* Helper do Cookbook
* @return none
*/
function helper() {
	exec_script("
		Para executar o cookbook:\n
		sudo cloud docker // Instala todos os componentes \n
		sudo cloud docker docker // Instala somente o Docker \n  
		sudo cloud docker compose // Instala somente o Docker Compose \n
		sudo cloud docker todos // Instala todos os componentes");
}