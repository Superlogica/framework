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
			instalacao_segura();
			reiniciar_apache();
			break;

		case 'visualizarlog':
			anexa_logs();

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
		sudo apt-get install apache2-threaded-dev libxml2-dev libcurl4-gnutls-dev liblua5.1-0 liblua5.1-0-dev build-essential php5-cli libghc-pcre-light-dev -y");
}

/**
* Instala as libs e o conjunto de regras do Modsecurity
* @return none
*/
function instalar_modsecurity() {

	//Regras que vão ser instaladas.
	$regras = array(
		'modsecurity_crs_41_xss_attacks.conf', // XSS
		'modsecurity_crs_41_sql_injection_attacks.conf', // SQL Injection
		'modsecurity_40_generic_attacks.data', // SCANS, REMOVE FILE INCLUSIONS E ETC
		'modsecurity_35_scanners.data', // DATABASE DE FINGERPRINTS DE SCANNERS
		'modsecurity_40_generic_attacks.conf', // GENERIC ATTACKS DATABASE
		'modsecurity_crs_45_trojans.conf' // PROTEÇÃO ATIVA CONTRA TROJANS ENVIADOS POR REQUEST E RESPONSE
	);

	//Bibliotecas auxiliares
	exec_script("
		sudo apt-get install zip libapache2-mod-security2 libxml2 libxml2-dev libxml2-utils libaprutil1 libaprutil1-dev -y");

	//Baixa e instala as regras de bloqueio da comunidade
	exec_script("
		mv /etc/modsecurity/modsecurity.conf-recommended /etc/modsecurity/modsecurity.conf;
		cd /tmp; wget https://github.com/SpiderLabs/owasp-modsecurity-crs/archive/master.zip;
		unzip master.zip;
		cp -R owasp-modsecurity-crs-master/* /etc/modsecurity/ ;
		mv /etc/modsecurity/modsecurity_crs_10_setup.conf.example /etc/modsecurity/modsecurity_crs_10_setup.conf;
		cd /etc/modsecurity;
		rm -r /etc/modsecurity/base_rules/* ;");

		foreach ($regras as $regra) {
			$remote = "modsecurity-rules/{$regra}";
			$local = "/etc/modsecurity/base_rules/{$regra}";
			put_template($remote, $local);
		}

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
	exec_script("tail -f /var/log/apache2/modsec_audit.log ");
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
* Instalação do Modo DetectionOnly
* @return none
*/
function instalacao_comum() {
	instalar_dependencias();
	instalar_modsecurity();

	put_template('modsecurity-detecao.conf', '/etc/modsecurity/modsecurity.conf');
}

/**
* Instalação do Modo Sec Engine
* @return none
*/
function instalacao_segura() {
	instalar_dependencias();
	instalar_modsecurity();

	put_template('modsecurity-seguro.conf', '/etc/modsecurity/modsecurity.conf');

}
