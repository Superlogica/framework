<?php
function usuariosinfraamazon_init(){

	exec_script("

		#Criaчуo de grupos

		addgroup infra;
						
		#Criaчуo de usuarios

		sudo cloud-init usuario sljumpserver infra;
		sudo cloud-init usuario marlon infra;
		sudo cloud-init usuario jeanrodrigues infra;
		sudo cloud-init usuario matheus infra;
		sudo cloud-init usuario luis infra;
		sudo cloud-init usuario carlos infra;

		#Adicionar ao sudo

		adduser sljumpserver sudo;
		adduser jeanrodrigues sudo;
		adduser marlon sudo;
		adduser matheus sudo;
		adduser luis sudo;
		adduser carlos sudo;

		#Adicionar ao bash
		usermod -s  /bin/bash sljumpserver;
		usermod -s  /bin/bash jeanrodrigues;
		usermod -s  /bin/bash marlon;
		usermod -s  /bin/bash matheus;
		usermod -s  /bin/bash luis;
		usermod -s  /bin/bash carlos;



    ");

}
