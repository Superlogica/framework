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
	
if(!is_dir("/tmp/cloud/templates/")){
   mkdir("/tmp/cloud/templates/");	
}

if (is_file($destino)){
   @unlink($destino);
}

if (is_file("/tmp/cloud/templates/$nome")){
   @unlink("/tmp/cloud/templates/$nome");
}
exec_script("cd /tmp/cloud/templates/; sudo wget https://raw.githubusercontent.com/Superlogica/framework/master/vagrant/templates/$nome --no-check-certificate;"); 
$nome = basename($nome);
if (!is_file("/tmp/cloud/templates/$nome")){
    echo("\nTemplate '$nome' não encontrado.\n\n");
    exit(3);
}	
  $template = file_get_contents("/tmp/cloud/templates/$nome");
  if (is_array($vars)) $template = strtr($template, $vars);
  file_put_contents($destino, $template); 
}  


/**
  * re-Iniciar o firebird.
  *
  */

function firebirdrestart(){
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