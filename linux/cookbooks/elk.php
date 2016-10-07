<?php 
/**
 * Instalação do ELK - Elastic Search, Logstash e Kibana 
 * @author  Matheus Scarpato Fidelis
 * @email   matheus.scarpato@superlogica.com
 * @date    06/10/2016
 */

/**
* Init Method
* @return none
*/
function elk_init($arg)  {
	switch (trim(strtolower($arg)))  {
		case 'help':
			helper();
			break;

		case 'install':
			install_elk();
			break;

		default:
			todos();
			break;
	}
}

function install_elk() {
	$elkPath = "/opt/builds/elk";
	exec_script("
		sudo cloud docker todos;
		mkdir -p {$elkPath};
		cd $elkPath;	
		");
}