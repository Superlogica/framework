# Superlógica Docker V2

## Setup inicial (todas as plataformas)

1) Crie a estrutura inicial dos projetos

```bash
mkdir {cloud-db,tmp,moedor-superlogica}
mkdir -p tmp/{mysql,logs}
mkdir -p tmp/logs/{apps,cloud}
chmod -R 777 tmp
```

2) Clone os projetos Superlógica dentro do respectivo diretório. 

A estrutura de diretórios deve ficar dessa forma: 

```
.
├── apps
├── cloud
├── cloud-db
├── moedor-superlogica
├── plataforma
└── tmp
    ├── logs
    │   ├── apps (Logs do apache do container de apps)
    │   └── cloud (Logs do apache do container de cloud)
    └── mysql
```

## Setup Linux

1) **Docker**: Faça Download e instalação da versão mais recente do Docker.

```bash
curl -sSL https://get.docker.io | sh 
```

2) **Docker-compose**: Faça o download a versão mais recente do Docker Compose

```bash
bash
curl -L https://github.com/docker/compose/releases/download/1.13.0/docker-compose-`uname -s`-`uname -m` > /usr/local/bin/docker-compose
exit
sudo chmod +x  /usr/local/bin/docker-compose
```

3) Faça o download do arquivo compose do projeto

```bash
wget https://raw.githubusercontent.com/Superlogica/framework/master/linux/superlogica-docker/v2/docker-compose.yml
```

4) Subindo o projeto 

```bash
docker-compose up 
```

## OS X

### Instalação do Docker

1) Faça Download da versão mais recente (Pode ser BETA) do Docker

> https://www.docker.com/docker-mac

Descompacte o dmg e instale normalmente. 

2) Instale o [docker-sync](http://docker-sync.io/).

> O Docker-sync é uma ferramenta de sincronia de código entre host / container criada para solucionar problemas de performance da montagem de filesystem entre sistemas OS X / Windows.

```bash
gem install docker-sync
```

3) Fazendo o download dos arquivos do compose

Na raiz dos projetos Superlógica, faça o Download dos arquivos de configuração dos projetos. Serão necessários 3 arquivos. O **docker-compose** padrão dos projetos, um **docker-compose-mac** para sobrescrever os volumes externos especificos para o OSX, e o **docker-sync** para criar os volumes syncados. 

```bash
wget https://raw.githubusercontent.com/Superlogica/framework/master/linux/superlogica-docker/v2/docker-compose.yml

wget https://raw.githubusercontent.com/Superlogica/framework/master/linux/superlogica-docker/v2/docker-compose-mac.yml

wget https://raw.githubusercontent.com/Superlogica/framework/master/linux/superlogica-docker/v2/docker-sync.yml
```

4) Subindo o projeto 

#### Opção 1: Sem o docker-sync 

```bash
docker-compose up
```

#### Opção 2: com o docker-sync

Essa opção vai demorar alguns minutos da primeira vez

```bash
docker-sync-stack start
```

## Windows

1) Se vira, brother.

# Considerações

## SQL Mode 

Para alterar o SQL Mode, basta editar o arquito `docker-compose.yml` e trocar o `command` do container `superlogica-mysql`.
Para remover o modo TRADITIONAL, basta alterar de `--sql-mode='TRADITIONAL'` para `--sql-mode=''`

```
  superlogica-mysql:
    image: mysql:5.7
    ports:
      - "3306:3306"
    environment:
      - MYSQL_USER=sysdba
      - MYSQL_PASSWORD=masterkey
      - MYSQL_ROOT_PASSWORD=root
      - MYSQL_DATABASE=superlogica-seed
    volumes:
      - ./tmp/mysql:/var/lib/mysql:rw
    command: "--sql-mode='TRADITIONAL'" <------- AQUI
    networks:
      - developer

```

## COMANDOS ÚTEIS 

1. **COMANDOS BÁSICOS DOCKER**

    - Iniciar/Reiniciar o docker**
    
     `docker-compose up --force-recreate`
    
     **Ver containers em execução**
    
      `docker ps -a`
        
    - **Conectar em um container**

    `docker exec -it home_superlogica-cloud_1 bash`
    
    - **Reiniciar memcached**
     
     `	docker restart home_superlogica-memcached_1`

2. **CONECTAR NO MYSQL:**

    `docker exec -it home_superlogica-mysql_1 mysql --user=root --password=root`

3. **DROP DATABASE E SOURCE **- Requer mysql-client instalado ou execute dentro do container.

  -  `mysql -u root -proot -h 127.0.0.1 -e  "DROP DATABASE IF EXISTS NOMEDABASE;"`
    
  -  `mysql -u root -proot -h 127.0.0.1 < /home/cloud-db/NOMEDABASE.sql;`


4. AUMENTAR MEMÓRIA DO MYSQL** - Melhora performance e evita erros ao importar bases grandes
    
  -  `mysql --user=root --password=root -e "set @@global.max_allowed_packet=1048576000;"`

  -  `mysql --user=root --password=root -e "select @@global.max_allowed_packet;`
