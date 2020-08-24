#!/bin/bash
#------------------------------------------------------------------
# Autor	:	Jean Rodrigues
# Nome	:	instalar-ubuntu.sh
# Data	:	05/02/2019
#------------------------------------------------------------------

clear
Menu(){
   echo -e ""
   echo -e "----------------------------------------------------"
   echo -e "        Instalar projeto com Docker V 2.1           "
   echo -e "----------------------------------------------------"
   echo -e ""
   echo "[1] Superlogica Docker - Para dev's Superlógica e verticais (instala o ambiente Superlógica)"
   echo "[2] Subadquirente Docker - Para dev's PJBank (instala o ambiente Superlógica e Pjbank)"
   echo "[0] Sair"
   echo
   echo -n "Digite a opcão desejada:   "
   read opcao;
   case $opcao in
      1) superlogica-docker ;;
      2) subadquirente-docker ;;
      0) clear; echo -e "SAINDO DO SCRIPT..." ; sleep 3; clear; exit ;;
      *) echo -e "Opcão desconhecida." ; sleep 2; clear; Menu ;;
   esac
}

function configurarProjeto() {

	echo "Fazendo atualização e instalando programas básico"
	sudo apt-get update \
	&& sudo apt-get upgrade -y \
	&& sudo apt-get install -y git curl vim terminator mysql-client;


	echo "Criando alias uteis"
	echo "alias conectarmysql='docker exec -it home_superlogica-mysql_1 mysql --user=root --password=root'" >> ~/.bashrc
	echo "alias subirdocker='docker-compose up -d --force-recreate'" >> ~/.bashrc
	echo "" >> ~/.bashrc


	echo "Criando a estrutura inicial dos projetos";
	# O ambiente do subadquirente (pasta/projeto) será criado na função 'subadquirente-docker'
	cd /home;
	sudo mkdir {apps,cloud,plataforma,cloud-db,tmp};
	sudo mkdir -p tmp/{mysql,logs};
	sudo mkdir -p tmp/logs/{apps,cloud};
	sudo chmod -R 777 apps/ cloud/ plataforma/ cloud-db/ tmp/;

	echo "Fazendo o download da versão mais recente do Docker Compose";
	sudo touch  /usr/local/bin/docker-compose \
	&& sudo chmod 777  /usr/local/bin/docker-compose \
	&& sudo curl -L https://github.com/docker/compose/releases/download/1.13.0/docker-compose-`uname -s`-`uname -m` > /usr/local/bin/docker-compose;

	echo "Fazendo Download e instalação da versão mais recente do Docker." 
	curl -sSL https://get.docker.io | sh \
	&& sudo usermod -aG docker $USER;


	echo "Gerando chave RSA"
	# se você ja tiver uma chave e essa for uma reinstalação
	# 
	ssh-keygen -t rsa -N '' -f ~/.ssh/id_rsa;
	clear;
	echo -e " \033[1;33m  **COPIE ESTA CHAVE E ADICIONE NA SUA CONTA NO GITHUB** \033[1;31m  **OBRIGATÓRIO PARA CONTINUAR** \033[0m";
	echo "";
	find ~/.ssh -name '*.pub' -exec cat {} \;
	echo "";
	echo -e " \033[1;33m No Github, vá em Settings, SSH and GPG Keys, clique em New SSH Key, cole o conteúdo da chave e salve. \033[0m";
	echo "";
	echo -e " \033[1;34m **DEPOIS DA CHAVE ADICIONADA PROSSIGA COM A CONFIGURAÇÃO PRESSIONANDO (S) ou (N) PARA SAIR!** \033[0m";
	read x
	if [[ "$x" == "S" ]] || [[ "$x" == "s" ]];
	then
		echo "DIGITE O E-MAIL DA SUA CONTA NO GIT";
		read email;
		echo "DIGITE SEU NOME";
		read nome;
		git config --global user.email "$email";
		git config --global user.name "$nome";
		git clone git@github.com:Superlogica/apps.git;
		git clone git@github.com:Superlogica/cloud.git;
		git clone git@github.com:Superlogica/plataforma.git;
		cd;

	fi;
}

function superlogica-docker () {
	configurarProjeto;
	echo "Entrando em /home e baixando o script docker-compose da Superlogica";
	cd /home;
	sudo wget https://raw.githubusercontent.com/Superlogica/framework/master/linux/superlogica-docker/v2/v2.1/cloud/docker-compose.yml -O docker-compose.yml;
	echo "Subindo o projeto";
	sudo docker-compose up;
	clear; echo "Concluído!"; sleep 3; clear; Menu
}

function subadquirente-docker () {
	
	echo "Criando alias uteis"
	echo "alias comandos='bash /home/subadquirente/Tests/comandos.sh'" >> ~/.bashrc
	echo "" >> ~/.bashrc
	configurarProjeto;
	clear;
    echo -e " \033[1;33m  **ATIVE A AUTENTICAÇÃO EM DUAS ETAPAS DA CHAVE (PUBLICA/PRIVADA)** \033[1;31m  **OBRIGATÓRIO PARA CONTINUAR** \033[0m"
    echo ""
    echo -e " \033[1;33m                 PRESSIONE ENTER PARA CONTINUAR \033[0m";
    read x
    echo -e " \033[1;34m  **INSIRA UMA SENHA ABAIXO** \033[0m";
    ssh-keygen -p -f ~/.ssh/id_rsa
	echo "Entrando em /home e baixando o projeto subadquirente";
	cd /home;
	sudo mkdir subadquirente;
	sudo chmod 777 subadquirente;
	git clone git@github.com:Superlogica/subadquirente.git;
	echo "Entrando em /home e baixando o script docker-compose da Superlogica";
	sudo wget https://raw.githubusercontent.com/Superlogica/framework/master/linux/superlogica-docker/v2/v2.1/subadquirente/docker-compose.yml -O docker-compose.yml;
	echo "Subindo o projeto";
	sudo docker-compose up;
	clear; echo "Concluído!"; sleep 3; clear; Menu
}

if [ "$(id -u)" = "0" ]; then
	clear;
	echo "Voce não pode executar este script como root!"
	echo "Voce não pode executar este script como root!"
	echo "Voce não pode executar este script como root!"
	echo "Voce não pode executar este script como root!"
	exit;
else
	echo "INICIANDO SCRIPT DE INSTALAÇÃO..."; sleep 3; clear; Menu
fi;
