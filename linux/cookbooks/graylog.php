<?php 
/**
 * Instalação do Graylog Server
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

		case 'install':
			install_docker();
			break;

		case 'up':
			up_graylog();
			break;

		default:
			todos();
			break;
	}
}

/**
* Instala o Graylog no sistema
* @return none
*/
function install_graylog() {
	$graylogPath = "/opt/builds/graylog/docker-compose.yml";
	exec_script("
		sudo cloud docker todos;
		mkdir -p {$graylogPath};");

	put_template("docker/graylog/docker-compose.yml", $graylogPath);
}

/**
* Inicia o Graylog
* @return none
*/
function up_graylog() {
	$graylogPath = "/opt/builds/graylog";
	exec_script("
		cd {$graylogPath};
		docker-compose up -d;");
}