<?php
function chavepublica_init(){
	exec_script("
		sudo wget https://raw.githubusercontent.com/Superlogica/framework/master/linux/templates/ssh_config -O /etc/ssh/ssh_config;
                ssh-keygen -t dsa -N '';
                cp \$HOME\/.ssh/id_dsa.pub \$USER\.pub");
                echo "PRESSIONE ENTER PARA CONTINUAR";exec_script("smbclient //SLNAS2/chaves -c 'put '\$USER'.pub'");
}       
