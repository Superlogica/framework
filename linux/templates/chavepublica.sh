#!/bin/sh

file="$HOME/.ssh/id_dsa.pub"
if [ ! -e "$file" ]
then
      ssh-keygen -t dsa -N '';
      cp $HOME/.ssh/id_dsa.pub $USER.pub;
      smbclient //SLNAS2/chaves -c 'put '$USER'.pub';
      rm $USER.pub;
      echo "FINALIZADO"
else
      cp $HOME/.ssh/id_dsa.pub $USER.pub;
      smbclient //SLNAS2/chaves -c 'put '$USER'.pub';
      rm $USER.pub;
      echo "FINALIZADO"
fi
