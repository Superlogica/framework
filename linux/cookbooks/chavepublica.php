<?php
function chavepublica_init(){
	exec_script("
                ssh-keygen -t dsa -N ''
                cp \$HOME\/.ssh/id_dsa.pub \$USER\.pub
                smbclient //SLNAS2/chaves -c 'put '\$USER'.pub'              
	");
}
