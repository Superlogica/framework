Como criar ambientes dev para o Superlógica?

# PRÉ INSTALAÇÃO

1. Liberar 100GB de espaço em seu HD
2. Deixar como "Espaço livre" ( Diminuir partição do gerenciador de disco )
3. Instalar Linux Ubuntu Desktop 14.04 LTS 64Bits

# INSTALACAO

1. Abra o terminal e execute a seguinte url:
 - cd /opt;sudo rm -rf /opt/cloud-init;sudo mkdir /opt/cloud-init;sudo chmod 777 /opt/cloud-init/;cd /opt/cloud-init; sudo wget https://raw.githubusercontent.com/Superlogica/framework/master/linux/cloud-init-init --no-check-certificate;

2. Instale SmartGit( execute no terminal ):
 - sudo cloud-init smartgit

3. A partir do SmartGit, clone os projetos que necessário dentro do diretório /home
( Obrigatório baixar inicialmente os projetos cloud, apps e plataforma )

4. Após projetos clonados, instale o restante do projeto( execute no terminal)
 - sudo cloud-init cloudteste
 
#IDE's DE DESENVOLVIMENTO
- NetBeans
	- Para uso, baixe direto do site com pacote e complemento que lhe for mais conveniente

- Sublime
	- No terminal, execute o comando: sudo cloud-init sublime

- Atom
	- No terminal, execute o comando: sudo cloud-init atom

- Firebird
	- Por padrão é baixado o FlameRobin automaticamente

- MySql
	- Por padrão é baixado o MySql WorkBench automaticamente	

# USO

- Acessar servidor web: 
	- localhost:3059

- Executar cookbooks
	- sudo cloud-init <nome_do_cookbook>
	- ex: sudo cloud-init fb25

- Firebird
	- sudo /etc/init.d/firebird2.5-superclassic restart

- Apache
	- sudo /etc/init.d/apache2 restart

- Limpar cache
	- sudo /etc/init.d/varnish restart
 




