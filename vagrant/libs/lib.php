<?
function exec_script($script){
    $comandos = explode("\n",$script);
	$result = '';
    foreach ($comandos as $comando){
	     $result .= `{$comando} 1>&2`;
	}	
	return $result;
}
