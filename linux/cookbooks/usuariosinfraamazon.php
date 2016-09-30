<?php
function usuariosinfraamazon_init(){

	exec_script("

		#Criaчуo de grupos

		addgroup infra;
						
		#Criaчуo de usuarios

		sudo cloud-init usuario sljumpserver infra;
		sudo cloud-init usuario marlon-sljumpserver infra;
		sudo cloud-init usuario jeanrodrigues-sljumpserver infra;
		sudo cloud-init usuario matheus-sljumpserver infra;
		sudo cloud-init usuario luis-sljumpserver infra;
		sudo cloud-init usuario carlos-sljumpserver infra;

		#Adicionar ao sudo

		adduser sljumpserver sudo;
		adduser jeanrodrigues-sljumpserver sudo;
		adduser marlon-sljumpserver sudo;
		adduser matheus-sljumpserver sudo;
		adduser luis-sljumpserver sudo;
		adduser carlos-sljumpserver sudo;

		#Adicionar ao bash
		usermod -s  /bin/bash sljumpserver;
		usermod -s  /bin/bash jeanrodrigues-sljumpserver;
		usermod -s  /bin/bash marlon-sljumpserver;
		usermod -s  /bin/bash matheus-sljumpserver;
		usermod -s  /bin/bash luis-sljumpserver;
		usermod -s  /bin/bash carlos-sljumpserver;



    ");

}
