<?php 
/**
 * Instalação do Fail2ban
 * @author  Matheus Scarpato Fidelis
 * @email   matheus.scarpato@superlogica.com
 * @date    03/10/2016
 */

/**
* Init Method
* @return none
*/
function fail2ban_init($arg) {
	
	switch (trim(strtolower($arg))) {
		case 'help':
			helper();
			break;

		case 'instalar':
			instalacao_fail2ban();
			break;

		case 'instalaremtodos':
			instalacao_todos();
			break;

		case 'logauth':
			log_auth();
			break;

		case 'logjail':
			anexa_logs();
			break;

		case 'baniremtodos':
			baniremtodos();
			break;

		case 'banir':
			baniraqui();
			break;

		case 'liberaremtodos':
			liberaremtodos();
			break;

		case 'liberar':
			liberaraqui();
			break;
		
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
	 \n'instalar'=>	Instala o Fail2Ban
	 \n'logauth' => Anexa o log de autenticação do sistema
	 \n'logjail' => Anexa o log da jail do fail2ban\n";
}


/**
* Instala o Fail2ban
* @return none
*/
function instalacao_fail2ban() {
	exec_script("
		sudo apt-get install fail2ban");

		//Arquivo de configuração do Fail2ban
		$jailFile = "/etc/fail2ban/jail.conf";
		if (file_exists($jailFile)) {
			@unlink($jailFile);
		}
		put_template("jail.conf", $jailFile);  
}

/**
* Mostras os logs do auth.log do sistema
* @return none
*/
function log_auth() {
	exec_script("tail -f /var/log/auth.log");
}


/**
* Mostras os logs da jail do fail2ban
* @return none
*/
function log_jail() {
	exec_script("tail -f /var/log/fail2ban.log");
}

/**
* Coloca um IP na jail do SSH e HTTP
* @return none
*/
function baniraqui() {
	$ip = trim($GLOBALS['argv'][3]);
	if ($ip) {
		echo "BANINDO O IP: {$ip}\n";
		echo "BANINDO REQUISIÇÕES NO APACHE: ";
		exec_script("sudo fail2ban-client set apache banip {$ip}");
		echo "BANINDO REQUISIÇÕES NO SSH: ";
		exec_script("sudo fail2ban-client set ssh banip {$ip}");
	} else {
		echo "FORNEÇA UM IP"
	}
}

/**
* Executa o comando banir em todos os servidores
* @return none
*/
function baniremtodos() {
	$ip = trim($GLOBALS['argv'][3]);
	$command = "sudo cloud todos cloud fail2ban banir {$ip}";
	exec_script($command);
}

/**
* Retira um IP da Jail
* @return none
*/
function liberaraqui() {
	$ip = trim($GLOBALS['argv'][3]);
	if ($ip) {
		echo "LIBERANDO O IP: {$ip}\n";
		echo "LIBERANDO REQUISIÇÕES NO APACHE: ";
		exec_script("sudo fail2ban-client set apache unbanip {$ip}");
		echo "LIBERANDO REQUISIÇÕES NO SSH: ";
		exec_script("sudo fail2ban-client set ssh unbanip {$ip}");
	} else {
		echo "FORNEÇA UM IP"
	}
}

/**
* Mostras os logs do auth.log do sistema
* @return none
*/
function liberaemtodos() {
	$ip = trim($GLOBALS['argv'][3]);
	$command = "sudo cloud todos cloud fail2ban liberar {$ip}";
	exec_script($command);
}
