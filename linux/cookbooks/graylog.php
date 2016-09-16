<?php 
function graylog_init($acao = "subir") {
	$path = "/opt/cloud-init/cloud/templates/docker-graylogserver/";
	$acao = $acao ? strtolower($acao) : "subir";

	switch ($acao) {
		case 'subir':		
			break;

		case 'instalar':
			exec_script("
				sudo cloud-init docker;
				mkdir -p {$path};
				");
			build_graylog($path);
		
		default:
			# code...
			break;
	}
}

function build_graylog($path) {
	put_template();
}

function up_graylog() {

}