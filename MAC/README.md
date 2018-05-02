# INSTRUÇÕES PARA MAC

## Pré Requisitos

* [Docker](https://www.docker.com/community-edition)
* [MySQL Workbench] (https://dev.mysql.com/downloads/workbench/)

### Restaurando bases .fdb e .sql de dentro do docker 

No terminal, de dentro da pasta onde está seu projeto:
```bash
  docker-compose -f docker-compose-php7.yml up
```

Em outro terminal, veja o ID do container criado e logue-se nele:
```bash
docker ps
```

Você verá algo do tipo:
```bash
CONTAINER ID        IMAGE                    COMMAND                  CREATED             STATUS              PORTS                                                                                                                NAMES
7a9660a58f02        superlogica/apache-aio   "bash -c /usr/local/…"   3 weeks ago         Up 28 hours         0.0.0.0:80->80/tcp, 0.0.0.0:3050->3050/tcp, 0.0.0.0:3059->3059/tcp, 0.0.0.0:3306->3306/tcp, 0.0.0.0:8080->8080/tcp   superlogica_superlogica_1
```

Pegue o container ID e use para logar-se no container e conseguir dar comandos linux:
```bash
docker exec -it 7a9660a58f02 bash
```

Desta maneira, você conseguirá dar comandos para restaurar backups de bases igual fazia no linux:
```bash
sudo cloud-init restaurarbkp
```






### Rodando bases MySQL

* Instale o MySQL Workbench

Se você usa fish, adicione o PATH para conseguir rodar comandos de mysql pelo terminal (Este passo só é feito 1 vez):
```bash
nano ~/.config/fish/config.fish
```
adicione:
```bash
set -gx PATH /Applications/MySQLWorkbench.app/Contents/MacOS $PATH
```
--
* Descompacte sua base mysql na pasta cloud-db
```bash
vim SUABASE.sql
```
Obs: Utilize o vim para que não tenha problemas de encoding ao fazer edições neste arquivo
* Altere o CREATE DATABASE e o USE para SUABASE-001

Logue-se no terminal para dar comandos de mysql:
```bash
mysql -uroot -proot -h 0.0.0.0
mysql> source SUABASE.sql
```
Espere até execução do comando terminar e veja se não deu erros

Ao terminar, verifique se sua base aparece usando o comando:
```bash
show databases;
```

Se precisar deletar esse database:
```bash
drop database SUABASE;
```

### Acessando bases pelo DBeaver

* Ao configurar o db, você deve utilizar host configurado como 0.0.0.0 ao invés de localhost


### Firebird erro Database shutdown

Se tiver algum problema de database shutdown quando estiver tentando visualizar o DB pelo Dbeaver, vá no container do docker e execute o comando para fazer a base ficar online:

```
gfix  -user "SYSDBA" -password "masterkey"  -online SUABASE.FDB
```

Se precisar, o comando abaixo força o db como shutdown:
```
gfix  -user "SYSDBA" -password "masterkey"   -shut -force 0 SUABASE.FDB
```

link para referência:
https://stackoverflow.com/questions/14617099/firebird-database-file-shutdown-error-message






















