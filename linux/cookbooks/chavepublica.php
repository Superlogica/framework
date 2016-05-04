<?php
function chavepublica_init(){
    
    $usuario = `echo \$SUDO_USER`;
    
    if (!is_file("/home/$usuario/id_dsa.pub")){
   
     exec_script("
     su \$SUDO_USER\
     ssh-keygen -t dsa -N '' ");
     
    }  
    unlink("/home/$usuario/.ssh/$usuario.pub");
    exec_script("cp /home/$usuario/.ssh/id_dsa.pub  /home/$usuario/.ssh/$usuario.pub
       smbclient //SLNAS2/chaves -c 'put $usuario.pub'");
   
}