<?php



/**
  * Envia um arquivo ou pasta para \/\/slnas\/temp\/servidor-ID, se em vez de arquivo for passado uma licenca ele faz um bkp, restaura e envia para slnas.
  */
function upload_action($arquivo) {
    //se licenca
	if (!is_file($arquivo)){
	       $serverId = emProducao($arquivo); 
		   if ($serverId!==false){
			    return backupRestoreUpload($arquivo);
		   } 
	}
	//se arquivo
	return copiarArquivoParaSuperlogicaCampinas($arquivo);
}


/**
  * Ativa e desativa o proxy do cron.
  */
function proxycron_action($active=true){
    if ($active){ 
         exec_script("sudo a2enmod proxy
                 sudo a2enmod proxy_http");
    } else {
        exec_script("sudo a2dismod proxy_http
                 sudo a2dismod proxy");
    }
    apacherestart_action();
}

/**
  * Mostra as 100 ultimas linhas do log de acesso e 50 de erros do apache. No singular (apachelog) da um follow no log de acesso.
  */
function apachelogs_action($active=true){
   echo "*************** log de acesso ***************";
   exec_script("tail /var/log/apache2/other_vhosts_access.log -n 150");
   echo "*************** log de erro ***************";
   exec_script("tail /var/log/apache2/error.log -n 50");
}

/**
  * Follow log de acesso do apache. No plural (apachelogS) lista logs de erro e acessos.
  */
function apachelog_action($active=true){
   exec_script("tail -f /var/log/apache2/other_vhosts_access.log");

}


/**
  * executa o apachetop
  */
function apachetop_action($active=true){
   exec_script("sudo apachetop -f /var/log/apache2/other_vhosts_access.log");

}




/**
 *  Instala o apache pagespeed
 */
function pagespeed_action(){
    
          global $conf;
       exec_script(" cd /tmp; https://dl-ssl.google.com/dl/linux/direct/mod-pagespeed-beta_current_i386.deb
        sudo dpkg -i /tmp/mod-pagespeed*.deb
        sudo rm /tmp/mod-pagespeed*.deb");
       apacherestart_action();  
    
}


/**
  * Atualiza o cloud ini
  */
function atualizarCloudIni_action(){
        global $conf;

        if (is_dir("/home/cloud/")){
	   exec("sudo cp {$conf['basedir']}/templates/cloud.ini /home/cloud/configs/cloud.ini");
        }
        if (is_dir("/home/plataforma/")){
	   exec("sudo cp {$conf['basedir']}/templates/cloud-apps.ini /home/plataforma/library/Application/Configs/cloud.ini");
        }        
}

/**
  * Mostra o status do servidor firebird
  *
  */
function status_action(){
	global $conf;
        echo "Links: ".trim(`lsof -P | grep 3050 | wc -l`)."\n"; 
	echo "Conexoes travadas: ".trim(`sudo lsof -a -u firebird | grep can | wc -l`)."\n";
	$conectados = trim( `sudo lsof +D {$conf['firebird']['dir']} | wc -l`);
	if ($conectados > 0) $conectados--;
	echo "Licencas conectadas: $conectados\n";	
	echo "Licencas em producao: ".trim( shell_exec("sudo ls -lh {$conf['firebird']['dir']}/*.fdb | wc -l")) ."\n";
	echo "Licencas fora de producao (no diretório 1 - DEVERIA SER ZERO): ".trim( shell_exec("sudo ls -lh {$conf['firebird']['dir1']}/*.fdb | wc -l")) ."\n";
	echo "Licencas treinamento: ".trim( @shell_exec("sudo ls -lh {$conf['firebird']['dir']}/treinamento-*.fdb | wc -l")) ."\n";	
}





/**
  * Inicia o sweep: cloud sweep licenca rodar ou desativa o auto sweep: cloud sweep licenca
  *
  */
function sweep_action($licenca , $rodar=""){
    
 $retorno = executarRemotoSeNecessario($licenca, "sweep $licenca $rodar");
  if ($retorno!==null) return $retorno;    
    
   global  $conf;
   @mkdir($conf['firebird']['dir'].'s'); 
   $fdbFile = $conf['firebird']['dir'].$licenca.".fdb";
    @unlink($logFile);	
        $gfixBin = (is_file("/usr/bin/gfix")) ? "/usr/bin/gfix" : "/usr/lib/firebird/2.1/bin/gfix";
        $rodar= ($rodar=='rodar')? 'sweep' : "-h 0";
	$cmd = "$gfixBin -h 0 $fdbFile -user sysdba -password masterkey";
	exec($cmd, $lines, $error);  
	if ($error <> 0){
       report("$licenca [ ** FALHOU ** ]"); return false;
	} 
    report("$licenca [    OK    ]"); return true;	
}



/**
  * Inicializa um servidor. cloud init TIPO <SUBTIPO>. Ex.: init firebird. IMPORTANTE: O segundo parametro é opcional e pode ser: master, modelo e local. Use o segundo parametro como "master" apenas para transformar em um servidor que controla os demais, "modelo" para maquinas de imagens e local para nao registrar. É possivel criar um servidor novo do zero, assim sudo cloud init remoto IP TIPO <SUBTIPO>
  *
  */
function init_action(){
	  global $conf;
	  require_once 'init.php';
      $parans = func_get_args(); 
	  $functionName = $parans[0].'_init';
	  $master = $parans[1]=='master';
	  $modelo = $parans[1]=='modelo';
	  $local = $parans[1]=='local';
	  if ($parans[0]=='remoto'){
	     if (!$parans[1]){
			echo "Informe o ip do novo servidor.\n";
			exit(5);		    
		 }
		 array_shift($parans);
	     return call_user_func_array('remoto_init',$parans);
	    }
	  if (!function_exists($functionName)){
			echo "Tipo de servidor '{$parans[0]}' não existe.\n";
			exit(5);
	    }
    todos($modelo ? $parans[0].'-modelo' : $parans[0],$local);
    //executa a action
	array_shift($parans); array_shift($parans);
	call_user_func_array($functionName,$parans);	
	if ($master){
	     master();
	}
}


/**
  * Encerra o master. Ex.: end master
  *
  */
function end_action(){
	  global $conf;
	  require_once 'init.php';
      $parans = func_get_args(); 
	  $functionName = $parans[0].'_end';
		if (!function_exists($functionName)){
			echo "Tipo de servidor '{$parans[0]}' não existe.\n";
			exit(5);
		}
    //executa a action
	array_shift($parans); 
	call_user_func_array($functionName,$parans);	
}

/**
  * Atualiza este aplicativo com a versão mais recente.
  *
  */
function atualizar_action(){
    global $conf;
    exec("cd {$conf['basedir']}; sudo git reset --hard; sudo git pull");
}
/**
  * Iniciar o ISQL.
  *
  */

function isql_action($licenca, $arquivo=''){
global $conf;
  if($arquivo) $arquivo = "-i $arquivo";
  echo "\nConectando $licenca...\n\n";
  $licencas = todasAsLicencasEmProducaoNoServidor('', '',$licenca); 
  foreach ($licencas as $licenca){
	   exec("isql-fb -u sysdba -p masterkey $arquivo {$licenca['ip']}:{$conf['firebird']['dir']}{$licenca['licenca']}.fdb 1>&2");
  }
  return false;

}


/**
  * re-Iniciar o firebird.
  *
  */

function firebirdrestart_action(){
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




/**
  * Conecta Mysql. Parametro: cloud, apps ou producao
  *
  */

function mysql_action($server=''){
    
switch ($server) {
    case 'cloud':
            $senha="";
            $host="";
            $usuario="";
        break;
    case 'apps':
            $senha="";
            $host="";
            $usuario="";
        break;    

    default:
            $senha="";
            $host="";        
            $usuario="";
        break;
}
    
    exec('');
 


}






/**
  * Ajusta o firebird para aguentar muitas conexoes
  *
  */

function firebirdtunning_action(){
 firebird_tunning();
 firebirdrestart_action();
 return true;

}

function apachetunning_action(){
 apache_tunning();
 apacherestart_action();
 return true;

}


/**
  * Atualiza o php ini, util nos servidores apache
  *
  */
function phpiniupdate_action(){
    global $conf;
        if (version_compare(phpversion(), '5.4.0')>= 0) {
            $ini = "php-5-4.ini";
        } else{
            $ini = "superlogica.ini";
        }    
    exec("sudo rm /etc/php5/apache2/conf.d/superlogica.ini");
    exec("sudo rm /etc/php5/apache2/conf.d/php-5-4.ini");
    exec("sudo cp {$conf['basedir']}/templates/$ini /etc/php5/apache2/conf.d/");
    apacherestart_action();
    
}


/**
  * re-Iniciar o apache.
  *
  */

function apacherestart_action(){
exec("sudo /etc/init.d/apache2 restart 1>&2");
 return true;

}

/**
  * deploy em um application.
  *
  */

function deploy_action($app="cloud"){
  $home = "/home/$app";   
  exec_script("sudo bash $home/conf/deploy.sh $home");
  if (is_dir("/home/plataforma")){
      exec_script("cd /home/plataforma; sudo git pull;"); 
  }
 return true;

}




/**
  * Acessa um servidor. VAZIO para acessar servidor master
  *
  */
function conectar_action($servidor=''){
    if ($servidor){
	    return executarRemoto_action($servidor);
	}
	return executarRemoto(IpExternoDoMaster(),'', 'ubuntu', true);
}



/**
  * Executa um comando no cloud remoto passe o nome do servidor, o comando e os parametros. Exemplo: executarRemoto firebirdX retirarDeProducao licenca.
  */
function executarRemoto_action(){
	  global $conf;

      $parans = func_get_args(); 
	  $serverName = $parans[0];
	  array_shift($parans);	  
	  $serversIp = getServerIP($serverName);
	  if (($serversIp==false) && (count($serversIp)<>1)){
			report("Exec Remota FALHOU!!! $serverName não é um servidor válido.");
			return false;
	  } else{
			$ipServidor = $serversIp[$serverName];
			if (!$ipServidor){
			report("Exec Remota FALHOU!!! $serverName: use o label exato do servidor. Use firebird100 (e não 100)");
			return false;		
			}
		}  
      $parans = trim(implode(' ',$parans));
      $parans = $parans ? 'cloud '.$parans : '';
      return executarRemoto($ipServidor,$parans, 'root', true);
}




/**
  *  Arquiva uma licenca. Use para sustituir o excluir. A licenca tem que estar na pasta 1.
  * 
  */
function arquivar_action($licenca){
	global  $conf;
   $dia = strtolower(date('d-M-y--H-i-s')); 	
   @mkdir($conf['firebird']['bkpdir']);
   @mkdir($conf['firebird']['bkpdir']."$licenca");
   @mkdir($conf['firebird']['bkpdir']."$licenca/arquivo");
   $gzipFile = $conf['firebird']['bkpdir'].$licenca.'/arquivo/'.$licenca.'-'.$dia.'.fdb.gz';
   $fdbFile = $conf['firebird']['dir1'].$licenca.".fdb";
   
    if (!is_file($fdbFile)){
       report("********* ARQ FALHOU $licenca: nao existe neste servidor ou esta em producao."); 
	   return false;	   
	}   

	@unlink($gzipFile);
	if (!compress($fdbFile, $gzipFile)){
		report("********* ARQ FALHOU $licenca: ao compactar $fdbFile => $gzipFile"); return false;
	}
    @unlink($fdbFile);
    report("ARQ $licenca: em $gzipFile"); return true;	
}


/**
  * Lista os servidores. Permite usar o coringa %. 
  */
function servidores_action($label ='%'){
    global $conf;
	$servidores = servidores($label);
	  foreach ($servidores as $servidor){
		   echo $servidor['label']."\n";
	  }
	  return false;
}


/**
  * Coloca em producao uma base enviada pelo SLServerUtils.exe. Informe o id do usuario no sladmin e um nome para a licenca.
  */
function migrar_action($id,$licenca){
   if (!$id) {
       report("Informe o id do usuário.");
      return false;     
   }
   if (!$licenca) {
       report("Informe a licenca.");
      return false;     
   }   
   $serverId = emProducao($licenca); 
   if ($serverId!==false){
      report("********* MIGRAR FALHOU $licenca: ja esta em producao em $serverId.");
      return false;
   } 
    $fdbFile = "/home/cloud-db/1/$licenca.fdb";
    if (is_file($fdbFile)){
       report("********* Migrar FALHOU $licenca: JA existe neste servidor."); 
	   return false;	   
	}  
    $cmd = "sudo scp superlogica.com:/home/backups/temp/{$id}__* $fdbFile.gz";	
   exec($cmd, $lines, $error);
	if ($error <> 0){
	   report("********* Migrar FALHOU $licenca: nao foi possivel copiar arquivo. $cmd"); 
	   @unlink("$fdbFile.gz");
	   return false;
	}   
	$cmd = "sudo gzip -d $fdbFile.gz";	 
   exec($cmd, $lines, $error);
	if ($error <> 0){
	   report("********* Migrar FALHOU $licenca: falhou ao descompactar. $cmd"); 
	   @unlink("$fdbFile.gz");
	   @unlink("$fdbFile");
	   return false;
	}  
    if (!colocarEmProducao($licenca)){
	   return false;
	}
	$cmd = "sudo ssh root@superlogica.com 'sudo rm /home/backups/temp/$id*'";
	exec($cmd, $lines, $error);
	
}


/**
  * Use em conjunto com outras funcoes. Le um arquivo com as licencas (uma por linha). Exemplo: todasDoArquivo ARQUIVO COMANDO PARAMETROS
  */
function todasDoArquivo_action(){
    $parans = func_get_args();
	$functionName = $parans[1].'_action';
	if (!function_exists($functionName)){
	    morra($parans[1].' nao é um comando válido. Use: cloud todasDoArquivo ARQUIVO COMANDO');
	}
	$arquivo = $parans[0];   
	if (!$arquivo){
	    morra($arquivo.' nao é um arquivo válido. Use: cloud todasDoArquivo ARQUIVO COMANDO');
	}	
	if (!is_file($arquivo)){
	    morra($arquivo.' nao existe. Use: cloud todasDoArquivo ARQUIVO COMANDO');
	}		
  $licencas = file($arquivo);
  array_shift($parans);
  foreach ($licencas as $licenca){
       $licenca = trim($licenca);
	   if ($licenca){
		   $parans[0] = $licenca;
			call_user_func_array($functionName,$parans);
		} 
  }
  return false;
}






/**
  * Use em conjunto com outras funcoes. Exemplo: todasEmProducao backupComTeste 
  */
function todasEmProducao_action(){
    $parans = func_get_args();
	$functionName = $parans[0].'_action';
	if (!function_exists($functionName)){
	    morra($parans[0].' nao é um comando válido. Use: cloud todasEmProducao COMANDO');
	}
  $licencas = todasAsLicencasEmProducao();
  foreach ($licencas as $licenca){
	   $parans[0] = $licenca['licenca'];
		call_user_func_array($functionName,$parans);
  }
  return false;
}

/**
  * Use em conjunto com outras funcoes. Exemplo: todasEmProducao backupComTeste 
  */
function todasConectadasNesteServidor_action(){
    global $conf;
    $parans = func_get_args();
	$functionName = $parans[0].'_action';
	if (!function_exists($functionName)){
	    morra($parans[0].' nao é um comando válido. Use: cloud todasEmProducao COMANDO');
	}
	 $licencas = licencasConectadas();
	 if (!is_array($licencas)) return false;
	  foreach ($licencas as $licenca){
		   $parans[0] = $licenca;
			call_user_func_array($functionName,$parans);
	  }
	  return false;
}

/**
  * SOMENTE LOCAL!!! Use em conjunto com outras funcoes.Exemplo: todasEmProducao naoConectadas backupComTeste 
  */
function naoConectadas_action(){
    global $conf;
        $parans = func_get_args();
        $licenca = $parans[0];
	$functionName = $parans[1].'_action';
	if (!function_exists($functionName)){
	    morra($parans[1].' nao é um comando válido. Use: cloud SELECIONADOR naoConectadas COMANDO');
	}
	 $licencas = licencasConectadas();
	 if (is_array($licencas)) {
            if (in_array($licenca, $licencas)) {
                report($licenca.': ******************** esta conectada **********************.',false);
                return false;
            }   
         }
         array_shift($parans);
	 $parans[0] = $licenca;
	 return call_user_func_array($functionName,$parans);
}



/**
  * Pula primeiros XXXX itens.
  */
function pular_action(){
    global $conf;
        $parans = func_get_args();
        $licenca = $parans[0];
        $quantidade = $parans[1];
	$functionName = $parans[2].'_action';
	if (!function_exists($functionName)){
	    morra($parans[2].' nao é um comando válido. Use: cloud SELECIONADOR pular 8 COMANDO');
	}
 	 $conf["pular"]++; 
         if ($conf["pular"] <=$quantidade) return false;
         array_shift($parans);
         array_shift($parans);
	 $parans[0] = $licenca;
	 return call_user_func_array($functionName,$parans);
}





/**
 * Imprime o tempo gasto do inicio do script e da ultima vez que foi checado.
 */
function tempo_action(){
    global $conf;
    report("Tempo de execusao: Desde do inico: ".  dateDiff($conf['tempo_inicio'],'now',6) . ", ultima checagem:". dateDiff($conf['tempo_ultimo'],'now',6) , false);
    $conf['tempo_ultimo'] = time();
    
    
    
        $parans = func_get_args();
	$functionName = $parans[1].'_action';
        $param0 = $parans[0];
	if (!function_exists($functionName)){
	    morra($parans[1].' nao é um comando válido. Use: cloud COMANDOs tempo COMANDOs');
	}
         array_shift($parans);
         $parans[0]= $param0;
	 return call_user_func_array($functionName,$parans);

}


/**
  * Envia as notificações por e-mail de cobranças de uma licenca
  *
  */

function processarTesteConsistencia_action($licenca, $qtdDias=45){
	echo $licenca .": ";
	$info = getLicencaInfo($licenca);
	$appid = $info['app_id'];

	exec("wget -T 120 http://$licenca.superlogica.net/$appid/atual/cron/processartestedeconsistencia?filename=$licenca -O /tmp/tmp.txt -q;");  
	echo "\n";
	return true;
}
/**
  * migra
  *
  */
function migrarauth_action($licenca){
echo $licenca .": ";
$info = getLicencaInfo($licenca);
$appid = $info['app_id'];
exec("wget http://$licenca.superlogica.net/$appid/atual/cron/migrarauth?filename=$licenca -O /tmp/tmp.txt -q;");  
echo "\n";
return true;

}

