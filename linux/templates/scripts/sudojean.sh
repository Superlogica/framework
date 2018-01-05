#!/bin/bash
#------------------------------------------------------------------
#Autor: Jean Rodrigues
# Instalar projeto Sl - NÃO EXECUTAR COM SUDO
# Exemplo: ./instalarprojetosl.sh 
#------------------------------------------------------------------
versao=$(/usr/bin/lsb_release -ds);
clear
 Menu(){
   echo "-----------------------------------------------"
   echo "             LinuxAdmin                        "
   echo "        Meu sistema é: $versao                 "
   echo "-----------------------------------------------"
   echo
   echo "[ 1 ] Configurar PC - Atualizações e programas úteis"
   echo "[ 2 ] Instalar projeto - Instala o projeto SL"
   echo "[ 0 ] Sair"
   echo
   echo -n "Digite a opcão desejada:   "
   read opcao;
   case $opcao in
      1) configurarPc ;;
      2) instalarProjeto ;;
      0) clear; echo "DESCONECTANDO DO SITEMA, AGUARDE..." ; sleep 3; clear; exit ;;
      *) echo "Opcão desconhecida." ; sleep 2; clear; Menu ;;
   esac
}


configurarPc () {
#Atualizações.
	sudo apt-get update && sudo apt-get upgrade -y;

#Instalando programas úteis.

	echo "Instalando o git"
	sudo apt-get install git -y;

 #Instala o meld com encode 
 sudo apt-get install meld -y
 git config --global diff.tool meld
 git config --global difftool.prompt false
 gsettings set org.gnome.meld detect-encodings "['ISO-8859-1']"
	
	echo "Instalando o curl"
	sudo apt-get install curl;
	
  echo 'Instalando Vim'
	sudo apt-get install vim -y;
	
  echo 'Instalando Terminator'
	sudo apt-get install terminator -y;
	
  echo 'Instalando Atom'
	sudo apt-get update;
	sudo add-apt-repository ppa:webupd8team/atom -y;
	sudo apt-get update;
	sudo apt-get install atom -y;
	
  echo "Instalando Dbeaver"
	wget -c https://dbeaver.jkiss.org/files/dbeaver-ce_latest_amd64.deb
	sudo dpkg -i dbeaver-ce_latest_amd64.deb;
	sudo apt-get install -f;
	
	echo -e "INSTALANDO O GOOGLE CHROME STABLE";
	wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb;
	sudo dpkg -i google-chrome-stable_current_amd64.deb;
	sudo apt-get -f install;
	
	echo -e "INSTALANDO SLACK";
	wget https://downloads.slack-edge.com/linux_releases/slack-desktop-3.0.2-amd64.deb
	sudo dpkg -i slack-desktop-3.0.2-amd64.deb;

	echo -e "INSTALANDO SKYPE";
	wget https://repo.skype.com/latest/skypeforlinux-64.deb
	sudo dpkg -i skypeforlinux-64.deb;

#chrome-gnome-shell instalando extensões pelo navegador
	sudo apt-get install chrome-gnome-shell -y
	
	echo "Instalando mysql-client"
	sudo apt-get install mysql-client -y;
	
   sudo apt-get auto-remove -y;
   sudo apt-get auto-clean -y;
    
    
sleep 3; clear; Menu
}



instalarProjeto() { 

#Configurando o projeto
	cd /opt;sudo rm -rf /opt/cloud-init;sudo mkdir /opt/cloud-init;sudo chmod 777 /opt/cloud-init/;cd /opt/cloud-init; sudo wget https://raw.githubusercontent.com/Superlogica/framework/master/linux/cloud-init-init --no-check-certificate; sudo chmod 777 /opt/cloud-init/cloud-init-init;
	sudo /opt/cloud-init/cloud-init-init git;
	cloud-init chavepublica;
	cd /home;
	clear;
	echo -e " \033[1;33m  **COPIE ESTA CHAVE E ADICIONE NA SUA CONTA NO GITHUB** \033[1;31m  **OBRIGATÓRIO PARA CONTINUAR** \033[0m";
	echo "";
	#cat /home/$USER/.ssh/*.pub;
	find /home/$USER/.ssh -name '*.pub' -exec cat {} \;
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
	sudo /opt/cloud-init/cloud-init-init cloudteste;
	sudo apt install php7.0-bcmath -y;
	sudo /opt/cloud-init/cloud-init-init cloudteste;
	sudo cloud-init tester;
	cd /home/cloud;
	composer install;
	cd;
	sleep 3; clear; Menu
	
fi;

}


echo "INICIANDO SISTEMA, AGUARDE..."; sleep 3; clear; Menu
