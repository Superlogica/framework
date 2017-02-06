# PRÉ INSTALAÇÃO
1. Link download Linux Ubuntu Desktop 14.04 LTS 64Bits http://www.ubuntu.com/download/desktop
2. Liberar 100GB de espaço em seu HD
3. Deixar como "Espaço livre" ( Diminuir partição do gerenciador de disco )
4. Instalar Linux Ubuntu Desktop 14.04 LTS 64Bits nesta partição disponibilizada

# INSTALACAO

1. Abra o terminal e execute a seguinte url:
 - cd /opt;sudo rm -rf /opt/cloud-init;sudo mkdir /opt/cloud-init;sudo chmod 777 /opt/cloud-init/;cd /opt/cloud-init; sudo wget https://raw.githubusercontent.com/Superlogica/framework/master/linux/cloud-init-init --no-check-certificate; sudo chmod 777 /opt/cloud-init/cloud-init-init;

2. Instale Git( execute no terminal ):
 - sudo /opt/cloud-init/cloud-init-init git;

3. A partir do Git, clone os projetos que necessário dentro do diretório /home por meio de SSH
( Obrigatório baixar inicialmente os projetos cloud, apps e plataforma )

    - git clone (link para o repositório)

4. Após projetos clonados, instale o restante do projeto( execute no terminal)
 - sudo /opt/cloud-init/cloud-init-init cloudteste;
	
#IDE's DE DESENVOLVIMENTO
- NetBeans
	- Para uso, baixe direto do site com pacote e complemento que lhe for mais conveniente

- Sublime
	- No terminal, execute o comando: sudo /opt/cloud-init/cloud-init-init sublime

- Atom
	- No terminal, execute o comando: sudo /opt/cloud-init/cloud-init-init atom

- Gerenciar banco de dados firebird
	- Por padrão é baixado o FlameRobin automaticamente
	- As bases devem ficar no diretorio /home/cloud-db/ (Se não conseguir acessar rode permissão na cloud-db)

- Gerenciar banco de dados MySql
	- Por padrão é baixado o MySql WorkBench automaticamente

#Utilitários

- Chrome
	- sudo cloud-init chrome

- Notepadd++
 	- Instalado por padrão

- Remmina (Acesso RDP)
 	- Instalado por padrão
 
- Synaptic (Gerenciador de pacotes)
 	- Instalado por padrão
 
- Wine (Rodar programas do Windows .exe)
	- sudo cloud-init wine

# USO

- Acessar servidor web:
	- localhost:3059 (Cloud)
	- localhost:8080 (Apps)

- Executar cookbooks
	- sudo cloud-init <nome_do_cookbook>
	- ex: sudo cloud-init fb25

- Firebird (Reiniciar)
	- sudo /etc/init.d/firebird2.5-superclassic restart

- Apache (Reiniciar)
	- sudo /etc/init.d/apache2 restart

- Varnish (Reiniciar)
	- sudo /etc/init.d/varnish restart
	
- Permissão bases
	- sudo chmod 777 -R /home/cloud-db
	
- Limpar cache do sistema
	- sudo cloud-init limparcache
