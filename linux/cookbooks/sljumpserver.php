<?php
function sljumpserver_init(){
	//Configurações do servidor samba
	put_template("local/seguranca","/etc/cron.daily/seguranca");

	exec_script("
		#Instalação e configuração

		sudo apt-get install samba --yes --force-yes;
		mv /etc/samba/smb.conf /etc/samba/smb.conf.original;

		#Diretórios e permissões

		sudo mkdir /home/configs/scripts -p;
		sudo mkdir /home/infra;
		sudo mkdir /home/temp/uploads -p;
		sudo mkdir /home/chaves;
		sudo mkdir /home/programas;
		sudo chmod -R 777 /home/configs;
		sudo chmod -R 777 /home/configs/scripts;
		sudo chmod -R 777 /home/infra;
		sudo chmod -R 777 /home/temp;
		sudo chmod -R 777 /home/temp/uploads;
		sudo chmod -R 777 /home/chaves;
		sudo chmod -R 777 /home/programas;
		sudo chmod +x /etc/cron.daily/seguranca;
		sudo -u root echo PATH='/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/games:/usr/local/games:/home/configs/scripts/' > /etc/environment;

		sudo cloud-init localserver;
		
		#Criação de grupos

		addgroup infra;
		addgroup usuarios;
		addgroup dev;
		addgroup dev-admin;
		addgroup suporte-admin;
		addgroup subad-admin
				
		#Criação de usuarios administrativos

		sudo cloud-init usuario sljumpserver infra;
		sudo cloud-init usuario jeanrodrigues infra;
		sudo cloud-init usuario marlon infra;
		sudo cloud-init usuario matheus infra;
		sudo cloud-init usuario luiscera infra;
		sudo cloud-init usuario carlos infra;
		sudo cloud-init usuario cloudserver infra;
		adduser cloudserver sudo;
		usermod -s  /bin/bash cloudserver;

		#Criação de usuarios comuns

		sudo cloud-init usuario adenilson.oliveira subad-admin;
		sudo cloud-init usuario adriely.marques dev;
		sudo cloud-init usuario alan.tavares dev-admin;
		sudo cloud-init usuario aleff.douglas dev-admin;
		sudo cloud-init usuario andre.junqueira dev;
		sudo cloud-init usuario augusto.depaula dev-admin;
		sudo cloud-init usuario bruno.reyller dev;
		sudo cloud-init usuario diego.aguiar dev;
		sudo cloud-init usuario diego.sousa dev;
		sudo cloud-init usuario eder.domingos dev;
		sudo cloud-init usuario eduardo.oliveira dev-admin;
		sudo cloud-init usuario elvis.silva dev;
		sudo cloud-init usuario emersonrodrigues dev-admin;
		sudo cloud-init usuario fabio.paixao dev;
		sudo cloud-init usuario felipe.mazzola subad-admin;
		sudo cloud-init usuario felipe.mesquita dev;
		sudo cloud-init usuario gesiel.diniz dev;
		sudo cloud-init usuario gustavo.ferreira dev;
		sudo cloud-init usuario heitor.souza dev-admin;
		sudo cloud-init usuario henrique.jatkoski suporte-admin;
		sudo cloud-init usuario isaque.nascimento dev-admin;
		sudo cloud-init usuario josimar.gomes dev;
		sudo cloud-init usuario leandro.panhan dev;
		sudo cloud-init usuario leonardo.lopes dev;
		sudo cloud-init usuario luispaulo.pereira dev-admin;
		sudo cloud-init usuario matheus.mazzola dev;
		sudo cloud-init usuario matheus.mondenez dev;
		sudo cloud-init usuario nelson.couto dev;
		sudo cloud-init usuario rafael.claro dev;
		sudo cloud-init usuario rodney.ferreira dev-admin;
		sudo cloud-init usuario saylor.damasceno dev;
		sudo cloud-init usuario telma.araujo dev;
		sudo cloud-init usuario thiago.teixeira dev;
		sudo cloud-init usuario vagner.araujo dev;
		sudo cloud-init usuario vanderlei.martins dev;

        
    ");

    put_template("local/smb.conf","/etc/samba/smb.conf");
    put_template("scripts/appsdeploy","/home/configs/scripts/appsdeploy");
    put_template("scripts/deploysubad","/home/configs/scripts/deploysubad");
    put_template("scripts/estagiodeploy","/home/configs/scripts/estagiodeploy");
    put_template("scripts/isql","/home/configs/scripts/isql");
    put_template("scripts/masterdeploy","/home/configs/scripts/masterdeploy");
    put_template("scripts/novaestagio","/home/configs/scripts/novaestagio");
    put_template("scripts/suporte","/home/configs/scripts/suporte");
    put_template("scripts/upload","/home/configs/scripts/upload");
    put_template("scripts/uploadmysql","/home/configs/scripts/uploadmysql");
    put_template("scripts/conectaradmin","/home/configs/scripts/conectaradmin");
    put_template("scripts/execute","/home/configs/scripts/execute");

    exec_script("
    	chmod +x -R /home/configs/scripts/*;

    ");

}
 