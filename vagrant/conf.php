<?php

//error_reporting(E_ALL ^ (E_NOTICE  | E_WARNING | E_COMPILE_WARNING | E_CORE_WARNING |E_USER_NOTICE));
if (version_compare(phpversion(), '5.4.0')>= 0) {
    error_reporting(E_ALL & ~ E_NOTICE & ~ E_DEPRECATED & ~ E_STRICT );
} else {
    error_reporting(E_ALL & ~ E_NOTICE & ~ E_DEPRECATED );
}
//error_reporting(6135);
set_time_limit(0);
$conf['tempo_inicio'] = time();
$conf['tempo_ultimo'] = time();
$conf["pular"]=0;
$conf["limitar"]=0;

$conf['basedir'] = realpath(dirname(__FILE__));

//só root 
if (posix_getuid()!=0){
   echo("\nSó o root pode fazer isto. Use sudo.\n\n");
   exit(3);
   
}

if (!extension_loaded('curl')){
    exec('sudo apt-get install php5-curl');
}

if (!is_file('/usr/sbin/cloud')){
   @exec("sudo ln -s {$conf['basedir']}/cloud /usr/sbin");
}


echo "\n";

//
// Biblioteca
//   

set_include_path(get_include_path() . PATH_SEPARATOR . '/usr/share/pear');

$filePathPear = stream_resolve_include_path('System.php');
if ($filePathPear  === false){
    @exec("cd /usr/share; sudo curl -O http://pear.php.net/go-pear.phar; sudo php -q /usr/share/go-pear.phar");
    @exec("sudo pear install MDB2; sudo pear install MDB2#mysql; sudo pear install MDB2#ibase");
}


set_include_path(get_include_path() . PATH_SEPARATOR . '/usr/share/pear');

//require_once 'MDB2.php';


//
// Diretorios 
//
$conf['firebird']['dir']='/home/cloud-db/';
$conf['firebird']['dir1']='/home/cloud-db/1/';
$conf['firebird']['bkpdir']='/cloud-db-bkp/';
$conf['server']['idfile'] = $conf['basedir']. '/id.ini';
$conf['server']['labelfile'] = $conf['basedir']. '/label.ini';
$conf['server']['masterfile'] = $conf['basedir']. '/master.lock';
$conf['server']['masterIam'] = $conf['basedir']. '/master.ini';
$conf['actions']['permitidasAntesDeIniciar'] = array('init','atualizar','end');


if (!is_dir($conf['firebird']['dir1'])){
  @exec("sudo mkdir -p {$conf['firebird']['dir1']}");
}

if (!is_dir($conf['firebird']['bkpdir'])){
   @exec("sudo mkdir -p {$conf['firebird']['bkpdir']}");
}


//
//
//
function _log($text){
   global $conf;
        $debugFile = $conf['basedir'].'/historico.txt';
        $file = @fopen($debugFile,"a");	
    	@fputs($file,"\n".'['.date("d/m/Y h:i:s") .'] '.$text);
    	@fclose($file);
        return true;
    }

//
// Fim das configuracoes
//

function report($msg, $log=true, $notificar=false){
   $msg = is_array($msg)? var_export($msg,true) : $msg; 
   echo "$msg\n";
   if ($log) { _log($msg); }
   if ($notificar){ notificarDev($msg); }
   
}
//
//
//

function utf8_decode_recursive( $param ){
    if ( is_array($param)){
        $result = array();
        foreach ($param as $key => $value){
            $result[$key] = utf8_decode_recursive($value);
        }
        return $result;
    }
    return utf8_decode($param);
}

function morra($msg, $notificar=false){
  $msg = is_array($msg)? var_export($msg,true) : $msg;
  _log("ERRO: $msg");
  echo "ERRO: ".$msg."\n";
  if ($notificar) notificarDev($msg);
  exit(1);
}




//
//
//
function getFirebirdConnection($db){
 
  if (!is_file($db)){
    morra("Erro: impossivel conectar no firebird, arquivo nao existe: $db");
  }
  $firebird = MDB2::factory("ibase://sysdba:masterkey@localhost/$db", array(
    'debug' => 2,
    'result_buffering' => false,
  ));

  if (PEAR::isError($firebird)) {
    morra('Impossivel conectar no firebird: '.$firebird->getMessage());
  }
  $firebird->setFetchMode(MDB2_FETCHMODE_ASSOC);
  return $firebird;
}

//
//
//
function emProducao($licencaId, $verbose=false) {
    global $conf;
    
    $mysql= getCloudConnection();

    $query = "SELECT * FROM licencas WHERE  licenca = '$licencaId' AND status='0'";
    $licencas = $mysql->queryAll($query);
    foreach ($licencas as $licenca) {
        if ($verbose) report($licenca,false);
    }    
    foreach ($licencas as $licenca) {
	    if ($licenca['id_servidor'])
			return $licenca['id_servidor'];
    }
    return false;
}

function infoDesteServidor(){
   global $conf;
   
   $ip = IpDesteServidor();
   $mysql= getCloudConnection();
   
   $arLicencas = $mysql->queryAll("SELECT * FROM  servidores WHERE  `ip` =  '$ip'");
   foreach ($arLicencas as $_licenca){
     return $_licenca;
   }
   return false;

}

function servidores($label){
   global $conf;
   
   $mysql= getCloudConnection();
   
   $arServidores = $mysql->queryAll("SELECT * FROM  servidores WHERE `label` like '$label'");
   return  $arServidores;

}


function proximoIdServidor(){
   global $conf;
   
   $mysql= getCloudConnection();
   
   $arLicencas = $mysql->queryAll("SELECT max(id) as ultimo FROM  servidores");
   foreach ($arLicencas as $_licenca){
     return $_licenca['ultimo'] + 1;
   }
   return false;

}


function registrarEsteServidor($local=false){
     global $conf;
	 
	 if ($local){
		@file_put_contents($conf['server']['idfile'], '-1');
		return true;
	 }
	 
     $este = infoDesteServidor();
	 $label = tipoDesteServidor();
	 if($este!==false){
	      @unlink($conf['server']['idfile']);
	      @file_put_contents($conf['server']['idfile'], $este['id']);
		  $label .= $este[id];
		  $sql = "UPDATE `cloud`.`servidores` SET `label` = '$label' WHERE ID = '{$este['id']}'";
		  $mysql= getCloudConnection();											
		  $stm = $mysql->prepare($sql);
		  $stm->execute(); 		
		  report("SERVIDOR $label: {$este['ip']}"); 	
		  return true;
	 }
	 $ip = IpDesteServidor(); 
	 $proximoId = proximoIdServidor();
	 if($proximoId===false){
                  report("Registrar: FALHOU!!! Nao consegui encontrar um id para este servidor."); 
		  return false;
	 }
	 $label .= $proximoId;
 	 $sql = "INSERT INTO  `cloud`.`servidores` (`id` ,`ip` ,`senha` ,`label` ,`porta`)
											VALUES ($proximoId,  '$ip',  'masterkey',  '$label',  '3050')";
    $mysql= getCloudConnection();											
    $stm = $mysql->prepare($sql);
    $stm->execute(); 	
	@file_put_contents($conf['server']['idfile'], $proximoId);
	report("SERVIDOR $label: $ip"); 
	return true;
     
}

function IpDesteServidor() {
     preg_match_all('/inet addr: ?([^ ]+)/', `ifconfig`, $ips);
     return $ips[1][0];
 }
 
function licencasConectadas(){
    global $conf;
	$emUso =`sudo lsof +D {$conf['firebird']['dir']}`;
	$result = preg_match_all('/db\/(.+?).fdb/', $emUso, $licencas);
	if (!$result) return false;
	return $licencas[1];
} 
 
 
 function IpExternoDesteServidor() {
     $externalIP = @file_get_contents('http://icanhazip.com/');
     if ($externalIP) return $externalIP;
     $externalIP = file_get_contents('checkip.dyndns.org');
     preg_match_all('/Address: (.+?)</', `ifconfig`, $ips);
     return trim($ips[1][0]);
 }
 
  function IpExternoDoMaster() {
     global $conf;
     if (!is_file($conf['server']['masterfile'])){
	    return false;
	 }
     return trim(file_get_contents($conf['server']['masterfile']));
 }
 
  function isMaster() {
     global $conf;
     if (!is_file($conf['server']['masterIam'])){
	    return false;
	 }
     return trim(file_get_contents($conf['server']['masterIam']));
 }


function tipoDesteServidor(){
    global $conf;
   $return = trim(@file_get_contents($conf['server']['labelfile'])) ;
   return $return ? $return : 'server';
}

function idDesteServidor(){
    global $conf;
   if ($conf['serverId']) return $conf['serverId'];
   $conf['serverId'] = trim(@file_get_contents($conf['server']['idfile'])) ;
   return  $conf['serverId'] ;
}

function nomeDesteServidor(){
   return tipoDesteServidor().idDesteServidor();
}


function executarRemotoSeNecessario($licenca, $comando){
        $info = getLicencaInfo($licenca);
		if (!$info) return null;
		if  ($info['server']['ip'] == IpDesteServidor()) return null;
		return executarRemoto($info['server']['ip'],'sudo cloud '.$comando,'root',true);
}


//
//
//
function getLicencaInfo($licencaId){
   global $conf;
   
   $mysql= getCloudConnection();
   
   $arqOriginal = $conf['firebird']['dir']."{$licencaId}.fdb";
   $arqDestino = $conf['firebird']['dir1']."{$licencaId}.fdb";
   $arLicencas = $mysql->queryAll("SELECT * FROM  `licencas` WHERE  `licenca` =  '$licencaId'");
   foreach ($arLicencas as $_licenca){
      $_licenca['arquivo'] = $_licenca['status'] == 0 ? $arqOriginal : $arqDestino;
      $_licenca['status_name'] =  $_licenca['status'] == 0 ? 'producao' : 'EM MANUTENCAO';      
      $_licenca['server'] =  getServerInfo($_licenca['id_servidor']); 
	  $_licenca['app_id'] =  $_licenca['app_id'];
     return $_licenca;
   }
   return false;
}

//
//
//
function getServerIP( $serverName){
   global $conf;
   $mysql= getCloudConnection();
   $servers = $mysql->queryAll("SELECT * FROM  `servidores` WHERE  `label` like  '$serverName'");
   foreach ($servers as $server){ 
      $server[$server['label']]= $server['ip'];
      return $server;
   }
   return false;  
    
}

//
//
//
function executarRemoto($ipServidor, $comando='', $user='root', $verbose=false){
		$verbose = $verbose ? '1>&2' : '';
		if ($comando){
			$cmd = "sudo ssh -t $user@$ipServidor '$comando' $verbose";
		} else {
			$cmd = "ssh -t $user@$ipServidor 1>&2";
		}
        
        exec($cmd, $lines, $error);  
            if ($error <> 0){
               report("Execusao remota em $ipServidor: FALHOU!!! $cmd"); 
               return false;
            } 
            return true;  
}

//
//
//

function exec_script($script){
    $comandos = explode("\n",$script);
	$result = '';
    foreach ($comandos as $comando){
	     $result .= `{$comando} 1>&2`;
	}	
	return $result;
}

function arquivoRemotoExisteNaPasta1($ipServidor,$licencaId){
   global $conf;
   $arqOrigem = $conf['firebird']['dir1']."{$licencaId}.fdb";
	$cmd = "sudo ssh ubuntu@$ipServidor 'sudo ls -lha $arqOrigem &> /dev/null'";
	exec($cmd, $lines, $error);  
	if ($error <> 0){
	   return false;
	} 
	return true;   
}


function getAllActions(){
  global $conf;
		$content = file_get_contents($conf['basedir'].'/actions.php');
		preg_match_all("/\/\*\*(.*?)(function )(.*?\(.*?\))/ms", $content, $matches, PREG_SET_ORDER);
		foreach($matches as $match) {
		        $function = trim($match[3]);
				$function = str_replace(array('_action', ')','$',';','{'),'',$function);
				$function = str_replace(array(',','('),' ',$function);
				$comentarios=trim($match[1]);
				$comentarios = str_replace(array('*', '/',"\n"),' ',$comentarios);	 
				$functions[] = array ( 'function' => trim($function), 'descricao' => trim($comentarios));
		}	
		return $functions;
}





function pad_exato($string,$tamanho){
   return substr(str_pad($string,$tamanho),0,$tamanho-1);
}







function getAppId($licenca){
    $firebird = getFirebirdConnection($licenca);   
    
    try{
        $result= $firebird->queryRow("SELECT first 1 * from EMPRESA");  
        if (!PEAR::isError($result)) 
            return 'financeiro';        
    }catch(Exception $e){        
    }
    
    try{
        $result= $firebird->queryRow("SELECT first 1 * from CONDOMINIO");
        if (!PEAR::isError($result))         
            return 'condor';
    }catch(Exception $e){        
    }
    
    morra("Não foi possível definir o applicativo da licenca: $licenca");     
}

function getUserId($licenca){
    $licencaId= basename($licenca,'.fdb');    
    
    if (strpos($licenca,'treinamento')!==false){
        return '-1';
    }    
    
    $administradora= getFirebirdConnection($licenca)->queryRow("select ST_ADMINISTRADORA_ADM from ADMINISTRADORA");        
    $registro= $administradora['st_administradora_adm'];
        
    if ($registro){
        $usuario= getSuperlogicaConnection()->queryRow("SELECT id_visitante_vis from VISITANTE WHERE ST_REGISTRO_VIS ='$registro'");        
    }    
    
    if (!$usuario['id_visitante_vis']){
        morra("Não foi possível encontrar o usuário vinculado a licença $licencaId registro $registro");
    }
    
    return $usuario['id_visitante_vis'];       
}

function alterarVencimento($licenca, $vencimento=''){
    global $conf;
    
    
    
    $mysql= getCloudConnection();
    
    if ($vencimento){
		$data= explode('/', $vencimento);
		$timeStamp= mktime(0, 0, 0, $data[1], $data[0], $data[2]);
		$vencimento= date('Y-m-d',$timeStamp);
	}
        
    $query = "UPDATE `licencas` set vencimento=".($vencimento ? "'$vencimento'" : 'null').", timestamp='$timeStamp' where licenca='$licenca'";
    
    $stm = $mysql->prepare($query);
    if (PEAR::isError($stm)) {
        morra('Impossivel executar: '.$stm->getMessage());
    }
    
    $result= $stm->execute()->result;
    
    report("Vencimento da licenca $licenca alterado para '$vencimento'");
    
    
    if (!$result){
        morra("Não foi possível alterar a data de vencimento da licenca $licenca.");
    }    
}


//
//
//
function getFirebirdInfo($server='localhost'){
    // get server version and implementation strings
    if (($service = ibase_service_attach($server, 'sysdba', 'masterkey')) != FALSE) {
        $server_info  = ibase_server_info($service,IBASE_SVC_SVR_DB_INFO);//, IBASE_SVC_GET_USERS ); 
        ibase_service_detach($service);
    }
    else {
        report(ibase_errmsg());
    }
   return $server_info;   
}

//
//
//
function dbShutDown($db, $shut= true ){
  $action = $shut ?  '-shut full -force 60': '-online normal' ;
  $cmd = "/usr/bin/gfix $action -user sysdba -password masterkey $db &> /dev/null"; 
  //report($cmd);
  exec($cmd, $lines, $error);
  if (($error <>0)){
     if ($shut)  report("Erro: Nao foi possivel dar shutdown!");  
	 return false;
  }
  sleep (1);
  return true;
}
//
//
//
function fbConfig($db){
  $cmd = "/usr/bin/gfix -write sync -user sysdba -password masterkey $db &> /dev/null"; 
  exec($cmd, $lines, $error);
  if (($error <>0)){
     report("Alerta: $error Impossivel configurar.");  
	 return false;
  }
  return true;
}

function firebird_tunning(){
    
    //http://www.slideshare.net/ibsurgeon/resolving-firebird-performance-problems
    global $conf;
    if (is_dir("/etc/firebird/2.1/")){
             exec_script("sudo  rm -Rf /etc/firebird/2.1/firebird.conf
             sudo cp {$conf['basedir']}/firebird/firebird.conf /etc/firebird/2.1/firebird.conf ");  
    }   
    if (is_dir("/etc/firebird/2.5/")){
             exec_script("sudo  rm -Rf /etc/firebird/2.5/firebird.conf
             sudo cp {$conf['basedir']}/firebird/firebird25.conf /etc/firebird/2.5/firebird.conf ");  
    }  
    
              exec_script("sudo  rm -Rf /etc/security/limits.conf
             sudo cp {$conf['basedir']}/templates/limits.conf /etc/security/limits.conf"); 
             // ATIVA APENAS UM CORE no SUPER SERVER
             // https://groups.yahoo.com/neo/groups/firebird-support/conversations/topics/105143
             // http://www.firebirdfaq.org/faq2/
             exec_script("echo 0 | sudo tee -a /sys/devices/system/cpu/cpu1/online");
             // DESATIVA PROTECAO TCP 
             // http://ubuntuforums.org/showthread.php?t=1204311
             exec_script("echo 0 | sudo tee -a /proc/sys/net/ipv4/tcp_syncookies
                          sudo sed -i s/#net.ipv4.tcp_syncookies=1/net.ipv4.tcp_syncookies=0/ /etc/sysctl.conf  
                        ");
    
    
}

function apache_tunning(){
    global $conf;

              exec_script("sudo  rm -Rf /etc/security/limits.conf
             sudo cp {$conf['basedir']}/templates/limits.conf /etc/security/limits.conf"); 
    
    
}




//
//
//
function retirarDaProducao($licencaId,$pararSeDerErro=true){
   global $conf;
   
   $mysql= getCloudConnection();
   
   //verifica se ja esta em producao
   $serverId = emProducao($licencaId);
   if ($serverId=== false){
     if ($pararSeDerErro) morra("Licenca $licencaId nao esta em producao em ***NENHUM*** servidor.");
	 else { report("$licencaId: FALHOU!! Ela nao esta em producao ***NESTE*** servidor."); return false; }
   }
   if ($serverId!= $conf['serverId']){
      report("$licencaId: FALHOU!! Ela nao esta em producao ***NESTE*** servidor.");
      //report(getLicencaInfo($licencaId));
      if ($pararSeDerErro) morra('Falhou!'); else return false;
   }
   $arqOriginal = $conf['firebird']['dir']."{$licencaId}.fdb";
   $arqDestino = $conf['firebird']['dir1']."{$licencaId}.fdb";
   //verifica se arquivo destino existe
   if (is_file($arqDestino)){
      if ($pararSeDerErro) morra("Impossivel continuar pois arquivo $arqDestino ja existe."); 
	  else { report("$licencaId: FALHOU!! Impossivel continuar pois arquivo $arqDestino ja existe."); return false; }
   }
   
   $appId= getAppId($arqOriginal);
   if ( removeLicencaNaListaDoUsuario($licencaId) === false ){
        if ($pararSeDerErro){
            morra("Impossivel remover licenca da lista de licencas dos usuarios.");
        } else {
            report("$licencaId: FALHOU!! Impossivel remover licenca da lista de licencas dos usuarios."); 
            return false;    
        }
   }
   //verifica se esta conectavel
   $firebird = getFirebirdConnection($conf['firebird']['dir']."{$licencaId}.fdb");
   //desconecta
   $firebird->disconnect();
   //retira da producao
   $query = "INSERT into `licencas` (licenca, id_servidor, status) VALUES  ('$licencaId',{$conf['serverId']},1)
             ON DUPLICATE KEY UPDATE status=1";
 
   $stm = $mysql->prepare($query);
   $result = $stm->execute()==1;
   if (!$result){
       adicionaLicencaNaListaDoUsuario($licencaId, $appId);
     if ($pararSeDerErro) morra('Nao foi possivel alterar o status da licenca.');
	 else { report("$licencaId: FALHOU!! Nao foi possivel alterar o status da licenca."); return false; }
   }
   // retira de shutDown, se por engano estivesse.
   dbShutDown($arqOriginal,false);
   //Força um shutDown e aguarda o processo terminar
   if (!dbShutDown($arqOriginal)){
     //volta status para em producao
		$query = "INSERT into `licencas` (licenca, id_servidor, status) VALUES  ('$licencaId',{$conf['serverId']},0) ON DUPLICATE KEY UPDATE status=0";
		$stm = $mysql->prepare($query);
		$result = $stm->execute()==1;  
                adicionaLicencaNaListaDoUsuario($licencaId, $appId);
        if ($pararSeDerErro) morra("$licencaId: FALHOU!!! Impossível dar shutdown. Ainda esta em producao.");		
        else return false;
   }
   //move 
   if(!rename($arqOriginal, $arqDestino)){
		//volta para producao
		dbShutDown($arqOriginal,false);
        $query = "INSERT into `licencas` (licenca, id_servidor, status) VALUES  ('$licencaId',{$conf['serverId']},0)  ON DUPLICATE KEY UPDATE status=0";
		$stm = $mysql->prepare($query);
		$result = $stm->execute()==1;     
        adicionaLicencaNaListaDoUsuario($licencaId, $appId);
     if ($pararSeDerErro) morra("$licencaId: FALHOU!!! Impossivel mover para pasta 1. Ainda esta em producao.");
	 else { report("$licencaId: FALHOU!!! Impossivel mover para pasta 1. Ainda esta em producao."); return false; }
   }
   report("$licencaId: nao esta mais em producao. Foi movida para $arqDestino.");
  return true;
}

function removeLicencaNaListaDoUsuario($licencaId){
    // Deleta todos acessos anteriores a licenca atual
    $mysql= getCloudConnection();
    $query="DELETE FROM `licencas_usuarios`
            WHERE licenca = '$licencaId'";
    $stm = $mysql->prepare($query);
    if ( PEAR::isError($stm) ){
        return false;
    }
    $stm->execute();
    return true;
}

function adicionaLicencaNaListaDoUsuario($licencaId, $appId){
    exec("wget -T 3 http://$licencaId.superlogica.net/$appId/atual/publico/colocaremproducao?filename=$licencaId -O /tmp/tmp.txt -q;");
}

//
//  
//

function random_password()
{

   $syllables = 3; $use_prefix = false;
   // Define function unless it is already exists
    if (!function_exists('ae_arr'))
    {
        // This function returns random array element
        function ae_arr(&$arr)
        {
            return $arr[rand(0, sizeof($arr)-1)];
        }
    }

    // 20 prefixes
    $prefix = array('aero', 'anti', 'auto',  'bio',
                    'cine', 'deca', 'dyna', 'eco',
                    'ergo', 'geo', 'gyno', 'hypo', 'kilo',
                    'mega', 'tera', 'mini', 'nano', 'duo');


    // 8 vowel sounds 
    $vowels = array('a', 'a', 'e', 'i', 'o', 'u'); // 'a' mais provavel

    // 20 random consonants 
    $consonants = array('w', 'r', 't', 'p', 's', 'd', 'f', 'g', 'h', 'j', 
                        'k', 'l', 'z', 'x', 'c', 'v', 'b', 'n', 'm', 'qu');

    $password = $use_prefix ? ae_arr($prefix):'';
    $password_suffix = rand(10,99);

    for($i=0; $i<$syllables; $i++)
    {
        // selecting random consonant
        $doubles = array('n', 'm', 't', 's');
        $c = ae_arr($consonants);
        if (in_array($c, $doubles)&&($i!=0)) { // maybe double it
            if (rand(0, 2) == 1) // 33% probability
                $c .= $c;
        }
        $password .= $c;
        //

        // selecting random vowel
        $password .= ae_arr($vowels);

        if ($i == $syllables - 1) // if suffix begin with vovel
            if (in_array($password_suffix[0], $vowels)) // add one more consonant 
                $password .= ae_arr($consonants);

    }

    // selecting random suffix
    $password .= $password_suffix;

    return $password;
}

//
//
//
function getServerInfo($serverId){
    global $conf;
    
    $mysql= getCloudConnection();
    
   $servers = $mysql->queryAll("SELECT * FROM  `servidores` WHERE  `id` =  '$serverId'");
   foreach ($servers as $server){ 
    //  $server['dbs']= getFirebirdInfo($server['ip']);
      return $server;
   }
   return false;  
}



function todasAsLicencasVencidas($dias=0){
global $conf;
   $mysql= getCloudConnection();
   $timestamp = mktime(0, 0, 0, date("m"), date("d")-$dias, date("Y"));
   $query = "SELECT licencas.licenca as licenca, ip, porta, senha, licencas.id_servidor as idservidor, app_id FROM `licencas` , servidores
			WHERE servidores.id = licencas.id_servidor 
			and status=0 
			and licencas.timestamp is not null
			and licencas.timestamp <> ''
			and licencas.timestamp < '$timestamp' ";
 return $mysql->queryAll($query);
	
}



//
//
//
function backup($licencaId,$server,$port=3050,$password='masterkey', $idservidor=-1, $emProducao=true, $compactar=true, $prefixo=''){
	global  $conf;
   $dia = strtolower(date('D').$prefixo); //DEVE SER A PRIMEIRA LINHA!!!	
   $gbkFile = $conf['firebird']['bkpdir']."$licencaId/$licencaId-".$dia.'.gbk';
   @mkdir($conf['firebird']['bkpdir']."$licencaId");
   $gzipFile = "$gbkFile.gz";
   $logFile = "$gbkFile.log";
   $fdbFile = $emProducao ? $conf['firebird']['dir'] : $conf['firebird']['dir1'];
   $fdbFile = $fdbFile.$licencaId.".fdb";
   $fdbFile = ($idservidor == $conf['serverId']) ? $fdbFile :  $server.'/'.$port.':'.$fdbFile;
   $gbkBin = (is_file("/usr/bin/gbak")) ? "/usr/bin/gbak" : "/usr/lib/firebird/2.1/bin/gbak";
   @unlink($logFile);	
	$cmd = "sudo $gbkBin -b -g -l -v $fdbFile $gbkFile -user sysdba -password $password -Y $logFile";
	exec($cmd, $lines, $error);  
	if ($error <> 0){
       report("********* BKP FALHOU $licencaId: $cmd"); return false;
	} 
	if (!$compactar){
	  report("BKP $licencaId (sem compactacao)"); return true;	
	}
	@unlink($gzipFile);
	if (!compress($gbkFile, $gzipFile)){
		report("********* BKP FALHOU $licencaId: ao compactar $gbkFile => $gzipFile"); return false;
	}
    @unlink($gbkFile);
	sleep(1);
    report("BKP $licencaId. Dia $dia"); return true;	
}







//
//
//
function check($licencaId,$server,$port=3050,$password='masterkey', $idservidor=-1){
global  $conf;
   @mkdir($conf['firebird']['dir'].'check'); 
   $fdbFile = $conf['firebird']['dir'].$licencaId.".fdb";
   $logFile = $conf['firebird']['dir'].'check/'.$licencaId.".log";
   $fdbFile = ($idservidor == $conf['serverId']) ? $fdbFile :  $server.'/'.$port.':'.$fdbFile;
    @unlink($logFile);	
        $gfixBin = (is_file("/usr/bin/gfix")) ? "/usr/bin/gfix" : "/usr/lib/firebird/2.1/bin/gfix";
	$cmd = "$gfixBin -validate -full -no_update $fdbFile -user sysdba -password $password &> $logFile";
	exec($cmd.$password, $lines, $error);  
	if ($error <> 0){
       report("$licencaId [ ** FALHOU ** ]"); return false;
	} 
    report("$licencaId [    OK    ]"); return true;	
}



//
//
//
function compress($srcName, $dstName)
	{
		$fp = @fopen($srcName, 'r');
		$zp = @gzopen($dstName, 'w');
		if ((!$zp)|| (!$fp)) {
			return false;
		}
		while(!feof($fp)){
			$data = fread ($fp, 4096);
			gzwrite($zp, $data);
		}
		fclose($fp);
		gzclose($zp);
		return true;
	}
	
function descompress($srcName, $dstName) {
        $fp = @fopen($dstName, "w") ;
        $zp = @gzopen($srcName, "r");

        if ((!$zp)|| (!$fp)) {
                return false;
        }
        while (!gzeof($zp))
        {
                $data = gzgets ($zp, 4096) ;
                fputs($fp, $data) ;
        }
        gzclose($zp) ;
        fclose($fp) ;
        return true;
    }	


//
//
//
function matarQuerysLentas(){
global $conf;

$mysql= getCloudConnection();

$processos = $mysql->queryAll("SHOW FULL PROCESSLIST");
	foreach ($processos as $processo){ 
	  $process_id = $processo["id"];
	  if (($processo["time"] > 10 ) && ( $processo["user"]!=='rdsadmin')){
	    if ($processo["command"]!=='Sleep') 
			report('Query lenta ('.$processo["time"].'s): '.$processo["command"].' '.$processo["info"] );
	  }
	  if (($processo["time"] > 30 ) && ( $processo["user"]!=='rdsadmin')){
			if ($processo["command"]!=='Sleep'){
				report('Kill ('.$processo["time"].'s): '.$processo["command"].' '.$processo["info"] );
				$sql="KILL {$process_id}";
				$stm = $mysql->prepare($sql);
				$result = $stm->execute()==1;
				if (!$result){
				  report('******** Nao foi possivel matar o proceso lento '.$processo["id"].': '.$processo["command"].' '.$processo["info"] );
				}
			}
	    }
          //kill sleep  
	  if (($processo["time"] > 25 ) && ( $processo["user"]!=='rdsadmin')){
				$sql="KILL {$process_id}";
				$stm = $mysql->prepare($sql);
				$result = $stm->execute()==1;
				if (!$result){
				  report('******** Nao foi possivel matar o proceso lento '.$processo["id"].': '.$processo["command"].' '.$processo["info"] );
				}

	    }            

    }
    
    
$mysql= getSuperlogicaConnection();

$processos = $mysql->queryAll("SHOW FULL PROCESSLIST");
	foreach ($processos as $processo){ 
	  $process_id = $processo["id"];
	  if (($processo["time"] > 10 ) && ( $processo["user"]!=='rdsadmin')){
	    if ($processo["command"]!=='Sleep') 
			report('Query lenta ('.$processo["time"].'s): '.$processo["command"].' '.$processo["info"] );
	  }
	  if (($processo["time"] > 30 ) && ( $processo["user"]!=='rdsadmin')){
			if ($processo["command"]!=='Sleep'){
				report('Kill ('.$processo["time"].'s): '.$processo["command"].' '.$processo["info"] );
				$sql="KILL {$process_id}";
				$stm = $mysql->prepare($sql);
				$result = $stm->execute()==1;
				if (!$result){
				  report('******** Nao foi possivel matar o proceso lento '.$processo["id"].': '.$processo["command"].' '.$processo["info"] );
				}
			}
	    }
          //kill sleep  
	  if (($processo["time"] > 25 ) && ( $processo["user"]!=='rdsadmin')){
				$sql="KILL {$process_id}";
				$stm = $mysql->prepare($sql);
				$result = $stm->execute()==1;
				if (!$result){
				  report('******** Nao foi possivel matar o proceso lento '.$processo["id"].': '.$processo["command"].' '.$processo["info"] );
				}

	    }            

    }    
    
    
    
    
}



 function dateDiff($time1, $time2='now', $precision = 5) {
    // If not numeric then convert texts to unix timestamps
    if (!is_int($time1)) {
      $time1 = strtotime($time1);
    }
    if (!is_int($time2)) {
      $time2 = strtotime($time2);
    }
 
    // If time1 is bigger than time2
    // Then swap time1 and time2
    if ($time1 > $time2) {
      $ttime = $time1;
      $time1 = $time2;
      $time2 = $ttime;
    }
 
    // Set up intervals and diffs arrays
    $intervals = array('year','month','day','hour','minute','second');
    $diffs = array();
 
    // Loop thru all intervals
    foreach ($intervals as $interval) {
      // Create temp time from time1 and interval
      $ttime = strtotime('+1 ' . $interval, $time1);
      // Set initial values
      $add = 1;
      $looped = 0;
      // Loop until temp time is smaller than time2
      while ($time2 >= $ttime) {
        // Create new temp time from time1 and interval
        $add++;
        $ttime = strtotime("+" . $add . " " . $interval, $time1);
        $looped++;
      }
 
      $time1 = strtotime("+" . $looped . " " . $interval, $time1);
      $diffs[$interval] = $looped;
    }
 
    $count = 0;
    $times = array();
    // Loop thru all diffs
    foreach ($diffs as $interval => $value) {
      // Break if we have needed precission
      if ($count >= $precision) {
	break;
      }
      // Add value and interval 
      // if value is bigger than 0
      if ($value > 0) {
	// Add s if value is not 1
	if ($value != 1) {
	  $interval .= "s";
	}
	// Add value and interval to times array
	$times[] = $value . " " . $interval;
	$count++;
      }
    }
    if (count($times)==0){
       return "menos de 1s"; 
    }
 
    // Return string with times
    return implode(", ", $times);
  }







function GeraCodigo($Texto) {
	$Texto = strtoupper($Texto);

	$STRA = 'MEU';
	$STRB = 'BOLETO';

	$Texto = strtoupper(md5($Texto));

	$t1 = substr($Texto, 0, 8);
	$t1 = strtoupper(md5($t1 . $STRA));
	$t1 = substr($t1, 24, 8);

	$t2 = substr($Texto, 8, 8);
	$t2 = strtoupper(md5($t2 . $STRB));
	$t2 = substr($t2, 16, 8);

	$t3 = substr($Texto, 16, 8);
	$t3 = strtoupper(md5($t3 . $STRB));
	$t3 = substr($t3, 8, 8);

	$t4 = substr($Texto, 24, 8);
	$t4 = strtoupper(md5($t4 . $STRA));
	$t4 = substr($t4, 0, 8);

	return $t1 . $t3 . $t2 . $t4;
}


//
//
//
class CLI {

private $argc,
        $argv = array(),
        $passed = array(),
        $out,
        $debugArg = 'd';

public function __construct(){
        $this->argc = $GLOBALS['argc'];
        $this->argv = $GLOBALS['argv'];
        for ($i = 1; $i < $this->argc; $i ++) {
            $this->passed[] = str_replace("-","",$this->argv[$i]);
        }
        $this->out = fopen("php://stdout", "w");
    }

public function userInput(&$var){
        $var = trim(fgets(STDIN));
    }

public function getArgs(){
        return $this->passed;
    }

public function getArgv() {
        return $this->argv;
    }

public function passed($arg) {
        return in_array($arg,$this->passed);
    }

public function setDebugArg($arg){
        $this->debugArg = $arg;
    }

public function output($str,$lineBreak = true){
        if($lineBreak){
            $str .= "\n";
        }
        fwrite($this->out,$str);
    }

public function debugOutput($str){
        if($this->passed($this->debugArg)){
            return $this->output($str,true);
        }
    }
    


}

idDesteServidor();


//
// Instancia da classe clientes
//
$cli = new CLI();

?>