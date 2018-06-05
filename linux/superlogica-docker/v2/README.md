# Superlógica Docker V2

## Setup inicial (todas as plataformas)

1) Crie a estrutura inicial dos projetos

```bash
mkdir {cloud-db,tmp}
mkdir -p tmp/{mysql,logs}
mkdir -p tmp/logs/{apps,cloud}
chmod -R 777 tmp
```

2) Clone os projetos Superlógica dentro de qualquer diretório. 

A estrutura de diretórios deve ficar dessa forma: 

```
.
├── apps
├── cloud
├── cloud-db
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
