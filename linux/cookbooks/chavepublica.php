<?php
function chavepublica_init(){
    
    $usuario = `echo \$SUDO_USER`;
    
    if (!is_file("`/home/$usuario/id_dsa.pub`")){
   
     exec_script("
     su $usuario
     ssh-keygen -t dsa -N '';
     cp /home/$usuario/.ssh/id_dsa.pub $usuario.pub;
     smbclient //SLNAS2/chaves -c 'put $usuario.pub'");
     
    }  
    
    exec_script("cp /home/$usuario/.ssh/id_dsa.pub  /home/$usuario/.ssh/$usuario.pub
       smbclient //SLNAS2/chaves -c 'put $usuario.pub'");
   
}