<?php
function exec_script($script){
    $comandos = explode("\n",$script);
	$result = '';
    foreach ($comandos as $comando){
	     $result .= `{$comando} 1>&2`;
	}	
	return $result;
}


function put_template($nome,$destino,$vars=false){
	

if (is_file("/tmp/cloud/templates/$nome")){
   @unlink("/tmp/cloud/templates/$nome");
}
exec_script("cd /tmp/cloud/; sudo wget https://raw.githubusercontent.com/Superlogica/framework/master/vagrant/templates/$nome --no-check-certificate;"); 
if (!is_file("/tmp/cloud/templates/$nome")){
    echo("\nTemplate '$nome' não encontrado.\n\n");
    exit(3);
}	
  $template = file_get_contents("/tmp/cloud/templates/$nome");
  if (is_array($vars)) $template = strtr($template, $vars);
  file_put_contents($destino, $template); 
}  
