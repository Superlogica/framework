<?php
function chavepublica_init(){
	exec_script("
		sudo wget https://raw.githubusercontent.com/Superlogica/framework/master/linux/templates/ssh_config -O /etc/ssh/ssh_config
                sudo wget https://raw.githubusercontent.com/Superlogica/framework/master/linux/templates/chavepublica.sh -O chavepublica.sh
                sudo chmod +x chavepublica.sh;
                sudo ./chavepublica.sh;   
	");
}