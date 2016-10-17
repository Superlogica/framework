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

		case 'destroi':
			mata_imagens();

		case 'php7':
			superlogica_php7();

		case 'php5':
			superlogica_php5();

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

	instalar("zram-config");
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
* Remove todas as imagens e todos os containers
* @return none
*/
function mata_imagens() {
	exec_script("
		docker rm $(docker ps -a -q);
		docker rmi $(docker images -q)
		");
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

/**
* Helper do Cookbook
* @return none
*/
function build() {
	$php5Path = "/opt/builds/superlogica_php5";
	$php7Path = "/opt/builds/superlogica_php7";
	$php5Compose = "{$php5Path}/docker-compose.yml";
	$php7Compose = "{$php7Path}/docker-compose.yml";
	$php5Dockerfile = "{$php5Path}/docker-compose.yml";
	$php7Dockerfile = "{$php7Path}/docker-compose.yml";
	$php5Firebird = "/opt/builds/superlogica_php5/setPass.sh";
	$php7Firebird = "/opt/builds/superlogica_php7/setPass.sh";

	@mkdir($php5Path);
	@mkdir($php7Path);

	put_template("docker/cloud-php5/docker-compose.yml", $php5Compose);
	put_template("docker/cloud-php7/docker-compose.yml", $php7Compose);
	put_template("docker/cloud-php5/Dockerfile", $php5Dockerfile);
	put_template("docker/cloud-php7/Dockerfile", $php7Dockerfile);
	put_template("docker/cloud-php5/setPass.sh", $php5Firebird);
	put_template("docker/cloud-php7/setPass.sh", $php7Firebird);
	run("superlogica_php5", $php5Path);
	run("superlogica/php7", $php7Path);
}

/**
* Constroi Containers
* @return none
*/
function run($path, $name) {
	if (!is_dir($path)) {
		@mkdir($path);
	}
	$command = "/usr/bin/docker build -t {$name} {$path}";
	exec_script($command);
}

/**
* Build no Container de PHP7
* @return none
*/
function superlogica_php7() {
	exec_script("/usr/local/bin/docker-compose -f /opt/builds/superlogica_php7/docker-compose.yml up -d;");
}

/**
* Build no Container de PHP5
* @return none
*/
function superlogica_php5() {
	exec_script("/usr/local/bin/docker-compose -f /opt/builds/superlogica_php5/docker-compose.yml up -d;");
}
