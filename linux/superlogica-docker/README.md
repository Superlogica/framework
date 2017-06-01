

# Rodando o projeto da Superlógica no Docker

## Setup dos projetos

* Clone os projetos da Superlógica em qualquer pasta
* Na raiz desta pasta, baixe o arquivo docker-compose.yml



## Setup do Docker 

### Linux Ubuntu/Debian 


* Instale as dependências do Docker

```
$ sudo apt-get install \
        apt-transport-https \
        ca-certificates \
        curl \
        software-properties-common
```

* Instale a chave gpg do Docker

```
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
```

* Como o BASH, instale o repositório

```
$ bash 
$ sudo add-apt-repository \
   "deb [arch=amd64] https://download.docker.com/linux/ubuntu \
   $(lsb_release -cs) \
   stable"

$ exit
```

* Faça o Download da versão mais recente do Docker (Minimo 1.13)

```
$  sudo apt-get update && sudo apt-get install docker-ce -y
```

* Faça o Download da versão 1.13 do Docker-Compose 

```
$ bash
$ curl -L https://github.com/docker/compose/releases/download/1.13.0/docker-compose-`uname -s`-`uname -m` > /usr/local/bin/docker-compose
$ exit
$ sudo chmod +x  /usr/local/bin/docker-compose
```

### MacOS

* Faça Download da versão mais recente (Pode ser BETA) do Docker

> https://www.docker.com/docker-mac

Descompacte o dmg e instale normalmente. 


## Rodando o projeto em PHP 7 

Faça o Download do docker-compose-php7 na RAIZ da pasta onde estão os projetos

```bash
$ wget https://raw.githubusercontent.com/Superlogica/framework/master/linux/superlogica-docker/docker-compose-php7.yml
```

Para rodar o projeto utilizando em PHP 7.0, entre na pasta do projeto e execute 

```
    $ docker-compose -f docker-compose-php7.yml up 
```

Da primeira vez a imagem AIO (All in One do projeto será baixada). 
