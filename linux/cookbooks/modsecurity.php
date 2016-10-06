<?php 
/**
 * Instalação e configuração do Modsecurity Web Application Firewall 
 * no Apache
 * @author  Matheus Scarpato Fidelis
 * @email   matheus.scarpato@superlogica.com
 * @date    03/10/2016
 */

/**
* Init Method
* @return none
*/
function modsecurity_init($arg) {
	
	switch (strtolower($arg)) {
		case 'help':
			helper();
			break;

		case 'deteccao':
			instalacao_comum();
			reiniciar_apache();
			break;

		case 'seguro':
			instalacao_comum();
			reiniciar_apache();
			break;

		case 'visualizarlog':
			anexa_logs():
		
		default:
			helper();
			break;
	}
}

/**
* Helper do cookbook
* @return none
*/
function helper() {
	echo "\n\n======> Cookbook do Modsecurity - Web Application Firewall <======
	 \nA estrutura do cookbook é : sudo cloud-init modsecurity <modo>
	 \nModos disponíveis: 
	 \n'deteccao' => Modo passivo Detection Only do Modsecurity. Apenas gera os logs das tentativas de invasão
	 \n'seguro' => Modo ativo SecEngine. Bloqueia todas as requisições suspeitas com 403 Forbidden\n";
}

/**
* Instala as dependencias do Modsecurity
* @return none
*/
function instalar_dependencias() {
	exec_script("
		sudo apt-get install apache2-threaded-dev libxml2-dev libcurl4-gnutls-dev liblua5.1-0 liblua5.1-0-dev build-essential php5-cli libghc-pcre-light-dev");
}

/**
* Instala as libs e o conjunto de regras do Modsecurity
* @return none
*/
function instalar_modsecurity() {
	//Bibliotecas auxiliares
	exec_script("
		sudo apt-get install zip libapache2-mod-security2 libxml2 libxml2-dev libxml2-utils libaprutil1 libaprutil1-dev");

	//Baixa e instala as regras de bloqueio da comunidade - Teste
	//Testar os links simbólicos
	exec_script("
		mv /etc/modsecurity/modsecurity.conf-recommended /etc/modsecurity/modsecurity.conf;
		cd /tmp; wget https://github.com/SpiderLabs/owasp-modsecurity-crs/archive/master.zip;
		unzip master.zip;
		cp -R owasp-modsecurity-crs-master/* /etc/modsecurity/ ;
		mv /etc/modsecurity/modsecurity_crs_10_setup.conf.example /etc/modsecurity/modsecurity_crs_10_setup.conf;
		cd /etc/modsecurity;

		for f in * ; do ln -s /etc/modsecurity/base_rules/$f /etc/modsecurity/activated_rules/$f ; done ;
		for f in * ; do ln -s /etc/modsecurity/optional_rules/$f /etc/modsecurity/activated_rules/$f ; done ;");

		//Arquivo que inclui as rules do modsecurity
		$security2File = "/etc/apache2/mods-available/security2.conf";
		if (file_exists($security2File)) {
			@unlink($security2File);
		}
		put_template("security2.conf", $security2File);  
}

/**
* Mostra os logs do Modsecurity
* @return none
*/
function anexa_logs() {
	exec_script("tail -f /var/log/apache2/modsec_audit.");
}

/**
* Ativa os novos headers e reinicia o pache
* @return none
*/
function reiniciar_apache() {
	exec_script("
		sudo a2enmod headers;
		sudo service apache2 restart;");
}

/**
* Instalação default entre as duas versões do modsecurity
* @return none
*/
function instalacao_comum() {
	instalar_dependencias();
	instalar_modsecurity();
}