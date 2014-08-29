<?php

/**
  * executa um script no shell
  *
  */
function exec_script($script){
    $comandos = explode("\n",$script);
	$result = '';
    foreach ($comandos as $comando){
	     $result .= `{$comando} 1>&2`;
	}	
	return $result;
}

/**
  * copia um template e substitui variaveis
  *
  */  
function put_template($nome,$destino,$vars=false){
$basenome = basename($nome);	
if(!is_dir("/opt/cloud-init/cloud/templates/")){
   mkdir("/opt/cloud-init/cloud/templates/");	
   exec_script("sudo chmod -R 777 /opt/cloud-init/cloud/templates");
}

if (is_file($destino)){
   @unlink($destino);
}

if (is_file("/opt/cloud-init/cloud/templates/$basenome")){
   @unlink("/opt/cloud-init/cloud/templates/$basenome");
}
exec_script("cd /opt/cloud-init/cloud/templates/; sudo wget https://raw.githubusercontent.com/Superlogica/framework/master/vagrant/templates/$nome --no-check-certificate;"); 

if (!is_file("/opt/cloud-init/cloud/templates/$basenome")){
    echo("\nTemplate '$nome' não encontrado.\n\n");
    exit(3);
}	
  $template = file_get_contents("/opt/cloud-init/cloud/templates/$basenome");
  if (is_array($vars)) $template = strtr($template, $vars);
  file_put_contents($destino, $template); 
}  


/**
  * re-Iniciar o firebird.
  *
  */

function firebird_restart(){
 if (is_file("/etc/init.d/firebird2.5-superclassic")){   
   exec("sudo /etc/init.d/firebird2.5-superclassic restart 1>&2");
   return true;
 }
 if (is_file("/etc/init.d/firebird2.1-super")){   
   exec("sudo /etc/init.d/firebird2.1-super restart 1>&2");
   return true;
 } 
 if (is_file("/etc/init.d/firebird2.5-super")){   
   exec("sudo /etc/init.d/firebird2.5-super restart 1>&2");
   return true;
 }
 
 return false;

}


function firebird_tunning($usar_um_core=false){
    
    //http://www.slideshare.net/ibsurgeon/resolving-firebird-performance-problems
    if (is_dir("/etc/firebird/2.1/")){
             put_template("firebird/firebird.conf","/etc/firebird/2.1/firebird.conf"); 
    }   
    if (is_dir("/etc/firebird/2.5/")){
             put_template("firebird/firebird25.conf","/etc/firebird/2.5/firebird.conf"); 
    }  

     put_template("limits.conf","/etc/security/limits.conf"); 
     // ATIVA APENAS UM CORE no SUPER SERVER
     // https://groups.yahoo.com/neo/groups/firebird-support/conversations/topics/105143
     // http://www.firebirdfaq.org/faq2/
     if ($usar_um_core){
        exec_script("echo 0 | sudo tee -a /sys/devices/system/cpu/cpu1/online");
     }     
// DESATIVA PROTECAO TCP 
     // http://ubuntuforums.org/showthread.php?t=1204311
     exec_script("echo 0 | sudo tee -a /proc/sys/net/ipv4/tcp_syncookies
                  sudo sed -i s/#net.ipv4.tcp_syncookies=1/net.ipv4.tcp_syncookies=0/ /etc/sysctl.conf  
                ");
    
    
}


function apache_tunning(){
    put_template("limits.conf","/etc/security/limits.conf"); 
    apache_restart();
    
}

function apache_restart(){
    exec("sudo /etc/init.d/apache2 restart 1>&2");
    if (is_file("/etc/init.d/hhvm")){
        exec("sudo /etc/init.d/hhvm restart 1>&2");
    }
    if (is_file("/etc/init.d/varnish")){
        exec("sudo /etc/init.d/varnish restart 1>&2");
    }    
    return true;
}


function time_zone(){
    put_template("timezone","/etc/timezone"); 
    exec_script("sudo apt-get -y -q install tz-brasil"
              . "sudo chmod 444 /etc/init.d/postfix");
    
}
