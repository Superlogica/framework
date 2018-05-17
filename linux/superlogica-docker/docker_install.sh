#!/bin/bash
# Script para instalação do projeto Superlógica usando Docker no Ubuntu (testado em 16.04, mas deve funcionar em qualquer versão mais nova).
# Desenvolvido por: Vinícius Silva <viniciusls>

echo "Atualizando repositórios";
sudo apt-get update;

echo "Instalando pacotes para permitir que o apt utilize pacotes via HTTPS e o curl";
sudo apt-get install -fy \
    apt-transport-https \
    ca-certificates \
    curl \
    software-properties-common;

echo "Adicionando chave de assinatura do Docker";
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -

echo "Adicionando repositório do Docker no apt";
# Necessário apontar para o artful pois ainda não existe o docker-ce nos repositórios do bionic, somente o docker.io
sudo add-apt-repository \
   "deb [arch=amd64] https://download.docker.com/linux/ubuntu \
   artful \
   stable"

echo "Atualizando repositórios";
sudo apt-get update;

echo "Instalando Docker-CE";
sudo apt-get install -fy docker-ce;

echo "Instalando Docker-compose (ATENÇÃO: funciona somente no Bash)";
sudo curl -L https://github.com/docker/compose/releases/download/1.19.0/docker-compose-`uname -s`-`uname -m` -o /usr/local/bin/docker-compose;

echo "Atualizando permissões do docker-compose";
sudo chmod +x /usr/local/bin/docker-compose;

echo "Entrando em /home e baixando o script docker-compose da Superlogica";
cd /home;
sudo wget https://raw.githubusercontent.com/Superlogica/framework/master/linux/superlogica-docker/docker-compose-php7.yml;

echo "Instalando a imagem da Superlogica e iniciando o container";
sudo docker-compose -f docker-compose-php7.yml up;

echo "Adicionando usuário atual ao grupo docker para execução de comandos no Docker Daemon sem sudo";
sudo usermod -aG docker $USER
