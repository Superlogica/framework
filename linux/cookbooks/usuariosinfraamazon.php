<?php
function usuariosinfraamazon_init(){

	exec_script("

		#Criaчуo de grupos

		addgroup infra;
		addgroup usuarios;
		addgroup dev;
		addgroup dev-admin;
		addgroup suporte-admin;
		addgroup subad-admin
				
		#Criaчуo de usuarios

		sudo cloud-init usuario sljumpserver infra;
		sudo cloud-init usuario jeanrodrigues-sljumpserver infra;
		sudo cloud-init usuario matheus-sljumpserver infra;
		sudo cloud-init usuario luis-sljumpserver infra;
		sudo cloud-init usuario carlos-sljumpserver infra;

		#Adicionar ao sudo

		adduser sljumpserver sudo;
		adduser jeanrodrigues-sljumpserver sudo;
		adduser matheus-sljumpserver sudo;
		adduser luis-sljumpserver sudo;
		adduser carlos-sljumpserver sudo;

        
    ");



}