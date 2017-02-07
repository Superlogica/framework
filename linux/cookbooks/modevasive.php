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
function modevasive_init($arg) {
	switch (trim($arg)) {
		case 'help':
			help();
			break;
		
		default:
			instalar_evasive();
			break;
	}
}

/**
* Instalar o Mod Evasive
* @return none
*/
function instalar_evasive() {
	$conf = "/etc/apache2/mods-enabled/evasive.conf";
	$pacotes = array(
		'libapache2-mod-evasive', 'apache2'
		);

	instalar($pacotes);

	if (file_exists($conf)) {
		@unlink($conf);
	}
	put_template("evasive.conf", $security2File);
	apache_restart();
}

/**
* Helper do cookbook
* @return none
*/
function help() {
	echo "\n\n======> Cookbook do ModEvasive - Protect Against DoS and DDoS Attack <======
	 \nA estrutura do cookbook é : sudo cloud-init modsecurity <modo>
	 \nModos disponíveis:
	 \n'deteccao' => Modo passivo Detection Only do Modsecurity. Apenas gera os logs das tentativas de invasão
	 \n'seguro' => Modo ativo SecEngine. Bloqueia todas as requisições suspeitas com 403 Forbidden\n";
}
