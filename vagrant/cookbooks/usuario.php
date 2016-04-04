function usuario_init($usuario=''){
      
      if (!is_dir('/home/git/infra')){
          exec_script('sudo apt-get --yes --force-yes git-core
                       sudo mkdir /home/git
                       cd /home/git; sudo git clone git@github.com:Superlogica/infra.git'); 
      } else {
          exec_script('cd /home/git/infra; sudo git pull');       
      }
      
      
      if (!$usuario){
          $path = "/home/git/infra;;;;;;";
          $diretorio = dir($path);
          while($arquivo = $diretorio->read()){
             $usuarios[] = $arquivo;
          }
      } else {
          $usuarios[] = $usuario;
      }
      
      
      
    foreach ($usuarios as $usuario){
    
         exec_script("useradd -g usuarios -s /bin/bash -d /home/'$usuario' -m '$usuario'
                        mkdir /home/'$usuario'/.ssh
                      cp /home/git/infra/usuarios/cloud/$usuario/.ssh/public_key /home/$usuario/.ssh/authorized_keys");
         
    }  
     
}
