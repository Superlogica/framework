<?php

function chavepublica_init(){


	exec_script("
		sudo wget https://raw.githubusercontent.com/Superlogica/framework/master/linux/templates/ssh_config -O /etc/ssh/ssh_config
                ssh-keygen -t dsa -N ''
                cd /home/$USER/.ssh
                echo 'DIGITE SEU NOME'
                read nome_user
                cp id_dsa.pub $nome_user.pub
                smbclient //SLNAS2/chaves -c 'put $nome_user.pub'               
	");
}