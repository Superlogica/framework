#!/bin/bash

#Gera chave publica, renomeia para o usuario logado e envia para o servidor local.
ssh-keygen -t dsa -N '';
cp $HOME/.ssh/id_dsa.pub $USER.pub;
smbclient //SLNAS2/chaves -c 'put '$USER'.pub';
echo "FINALIZADO"