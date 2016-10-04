<?php
function usuariosinfraamazon_init(){

	exec_script("

		#Criaчуo de grupos

		addgroup infra;
						
		#Criaчуo de usuarios

		sudo cloud-init usuario sljumpserver amazon;
		sudo cloud-init usuario marlon amazon;
		sudo cloud-init usuario jeanrodrigues amazon;
		sudo cloud-init usuario matheus amazon;
		sudo cloud-init usuario luis amazon;
		sudo cloud-init usuario carlos amazon;

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
 