# PRÉ INSTALAÇÃO
1. Link download Linux Ubuntu Desktop 14.04 LTS 64Bits http://www.ubuntu.com/download/desktop
2. Liberar 100GB de espaço em seu HD
3. Deixar como "Espaço livre" ( Diminuir partição do gerenciador de disco )
4. Instalar Linux Ubuntu Desktop 14.04 LTS 64Bits nesta partição disponibilizada

# INSTALACAO


1. Abra o terminal e execute a seguinte url:

```
cd /opt;sudo rm -rf /opt/cloud-init;sudo mkdir /opt/cloud-init;sudo chmod 777 /opt/cloud-init/;cd /opt/cloud-init; sudo wget https://raw.githubusercontent.com/Superlogica/framework/master/linux/cloud-init-init --no-check-certificate; sudo chmod 777 /opt/cloud-init/cloud-init-init;
```

2. Instale Git( execute no terminal ):

```
 sudo /opt/cloud-init/cloud-init-init git;
```

3. Gere a chave publica com o comando:

```
cloud-init chavepublica
```

>Nesse processo, será solicitado uma senha para adicionar mais uma camada de segurança na autenticação. É possível deixar em branco, mas sério, não deixem. Coloquem uma senha maneira aí. _Fidelis-Raj._

Será gerado alguns arquivos dentro da pasta oculta .ssh, um deles com extensão .pub será sua chave pública.

execute este comando para ver o conteudo da sua chave pública:

```
cat /home/$USER/.ssh/*.pub
```
_O conteúdo exibido pode não parecer, mas é apenas uma linha. Então copie o mesmo evitando as quebras._

No _Github_, vá em _Settings_, SSH and GPG Keys, clique em _New SSH Key_, cole o conteúdo da chave e salve.


4. A partir do Git, clone os projetos que necessário dentro do diretório /home por meio de SSH
( Obrigatório baixar inicialmente os projetos cloud, apps e plataforma )

```
    cd /home	
    git clone (link para o repositório)
```

5. Após projetos clonados, instale o restante do projeto( execute no terminal)

```
sudo /opt/cloud-init/cloud-init-init cloudteste;
```
	
# IDE's DE DESENVOLVIMENTO
- NetBeans
	- Para uso, baixe direto do site com pacote e complemento que lhe for mais conveniente

- Atom
	- No terminal, execute o comando:
  
  ```
  sudo /opt/cloud-init/cloud-init-init atom
```

- Gerenciar banco de dados firebird:

 - Por padrão é baixado o FlameRobin automaticamente.

 - As bases devem ficar no diretorio /home/cloud-db/ (Se não conseguir acessar rode permissão na cloud-db).


- Gerenciar banco de dados MySql:
 - Por padrão é baixado o MySql WorkBench automaticamente

# Utilitários

- Chrome

```
sudo cloud-init chrome
```

- Notepadd++
 - Instalado por padrão


- Remmina (Acesso RDP)
 - Instalado por padrão
 
 
- Synaptic (Gerenciador de pacotes)
 - Instalado por padrão
 
 
- Wine (Rodar programas do Windows .exe)

```
sudo cloud-init wine
```

# USO

- Acessar servidor web:

 - localhost:3059 (Cloud)
 - localhost:8080 (Apps)


- Executar cookbooks
 - sudo cloud-init <nome_do_cookbook>
 - ex: sudo cloud-init fb25


- Firebird (Reiniciar)

```
sudo /etc/init.d/firebird2.5-superclassic restart
```

- Apache (Reiniciar)

```
sudo /etc/init.d/apache2 restart
```

- Varnish (Reiniciar)

```
sudo /etc/init.d/varnish restart
```	

- Permissão bases

```
sudo chmod 777 -R /home/cloud-db
```	

- Limpar cache do sistema

```
sudo cloud-init limparcache
```
