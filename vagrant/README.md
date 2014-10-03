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

5. Para instalação do cloud execute COMO ADMINISTRADOR o script "instalarVagrant.ps1".
 - Diretório do script: \\192.168.0.40\programas\01-Super\DEV
 - Para executar como ADMINISTRADOR:
   . copie o script para algum diretório de facil localização;
   . abra o powerShell como ADM;
   * Normalmente no primeiro acesso do powerShell, ele vem desabilitado para execução de script, para liberar use o comando: Set-ExecutionPolicy Unrestricted;
   * Localize o diretório do script via linha de comando e execute. EX: cd C:\;./instalarVagrant.ps1
 
OBS. Após a execução dos scripts estará instalado: o virtualBox, Vagrant, o rsync, e o rsync estará declarado no PATH;

OBS. Para subir outros ambientes acesse o link abaixo e copie os vagrantfile conforme necessidade:
 - https://github.com/Superlogica/framework/tree/master/vagrant/boxes


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

- Firebird
 - sudo /etc/init.d/firebird2.1-super restart

- Debug.txt
 - criar: sudo echo '' >> /home/cloud/var/log/debug.txt
 - abrir: tail -f /home/cloud/var/log/debug.txt
 - limpar: sudo echo '' > /home/cloud/var/log/debug.txt





