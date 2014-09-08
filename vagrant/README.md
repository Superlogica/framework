Como criar ambientes de teste/produção para o Superlógica?

# INSTALACAO 

1. Instale VirtualBox:
 - https://www.virtualbox.org/wiki/Downloads

2. Instale Vagrant:
 - http://www.vagrantup.com/downloads.html

3. Instale Github:
 - http://mac.github.com
 - http://windows.github.com

4. Clone o projeto (Github) desejado: 
 - na pasta de c:\git ou $HOME/git

5. Copie nesta pasta um dos Vagrantfiles conforme sua necessidade:
 - https://github.com/Superlogica/framework/tree/master/vagrant/boxes
 - na maioria dos casos o Vagrantfile é este: 
 - https://raw.githubusercontent.com/Superlogica/framework/master/vagrant/boxes/cloudteste/Vagrantfile

6. abra o shell (ou powershell), entre na pasta escolhida no item 3 e digite:
 - vagrant up





# USO

- Pasta sincronizada:
 - vagrant rsync-auto
 - a pasta escolhida no item 3 será sincronizada dentro da maquina virtual do novo ambiente;

- Acessar servidor web: 
 - http://192.168.80.1:3059
 
- Abrir Diretório do projeto no WINDOWS
 - cd c:\git\cloud

- Criar a maquina:
 - vagrant up 

- iniciar a maquina:
 - vagrant reload 

- Acessar a maquina
 - vagrant ssh ou acesse via putty 127.0.0.1:2222 

- Destruir a maquina
 - vagrant destroy

- Executar cookbooks
 -  sudo cloud-init <nome_do_cookbook>
 ex: sudo cloud-init fb21






