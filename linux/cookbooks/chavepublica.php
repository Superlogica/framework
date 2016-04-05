<?php

function chavepublica_init(){


	exec_script("
		sudo wget https://raw.githubusercontent.com/Superlogica/framework/master/linux/templates/ssh_config -O /etc/ssh/ssh_config
                ssh-keygen -t dsa -N ''
                cd /home/$USER/.ssh
                echo 'DIGITE SEU NOME'
                read nome_user
                scp id_dsa.pub 192.168.0.165:/home/temp/chaves/$nome_user.pub               
	");
}