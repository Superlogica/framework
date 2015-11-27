<?php
function limparCachePHP(){
  // Pastas a serem mantidas após processo de exclusão
  // Será verificado dentro de cada pasta do sistema/versao e pular caso a pasta esteja neste array
  $manterPastas = array(
    'armazenamento'
  );

  $caminhoCache = realpath('/home/cloud/var/log/cache');
  if ( !is_dir($caminhoCache) )
    return -1;

  $iterator = new DirectoryIterator( $caminhoCache );
  foreach ( $iterator as $entry ) {
    if( $entry->isDot() || !$entry->isDir() )
      continue;

    $iterator2 = new DirectoryIterator( $entry->getPathname() );
    foreach ( $iterator2 as $entry2 ) {
      if( $entry2->isDot() || !$entry2->isDir() )
        continue;

      $iterator3 = new DirectoryIterator( $entry2->getPathname() );
      foreach ( $iterator3 as $entry3 ) {
        if( $entry3->isDot() )
          continue;

        $caminhoDirOuArquivo = $entry3->getPathname();
        if ( $entry3->isDir() && !in_array($entry3->getFilename(), $manterPastas))
          shell_exec("sudo rm -f $caminhoDirOuArquivo -Rf"); // Deleta a pasta recursivamente
        else if (is_file($caminhoDirOuArquivo))
          unlink($caminhoDirOuArquivo);

      }
    }

  }
}

/**
 * Atualiza o cloud ini
 */
function atualizarCloudIni_action() {
    global $conf;    

    if (is_dir("/home/cloud/")) {
        exec("sudo cp {$conf['basedir']}/templates/cloud.ini /home/cloud/configs/cloud.ini");
    }
    if (is_dir("/home/plataforma/")) {
        exec("sudo cp {$conf['basedir']}/templates/cloud-apps.ini /home/plataforma/library/Application/Configs/cloud.ini");
    }
    if (is_dir("/home/subadquirente/")) {
        exec("sudo cp {$conf['basedir']}/templates/cloud-subadquirente.ini /home/plataforma/library/Application/Configs/cloud.ini");
    }    
    
    
}

function deploy_action($null='') {
    $apps_disponiveis = array('cloud','apps','plataforma','subadquirente','condoworks');
        foreach($apps_disponiveis as $app){
            $home = "/home/$app";
            if (is_dir($home)) {
                echo "\n\nDeploy $app..\n";
                //exec_script("cd $home; sudo git reset --hard; sudo git pull;"); 
                echo "cd $home";
                //exec_script("cd $home; sudo git status"); 
                if ($app == "cloud"){
                    atualizarCloudIni_action();
                    limparCachePHP();
                }
                if (is_file("$home/conf/deploy.sh")){
                    exec_script("sudo chmod 777 $home/conf/deploy.sh; sudo $home/conf/deploy.sh $home");
                }
            }
        }        
//    if (is_dir("/home/plataforma")) {
//        exec_script("cd /home/plataforma; sudo git pull;"); // precisa testar sudo git reset --hard; 
//    }
    
    return true;
}

exec_script("
    sudo apt-get install -y mysql-server-5.5
");
        
//pacotes
exec_script("
    apt-get update && apt-get install -y apache2 libapache2-mod-php5 php5-mysql php5-mcrypt lynx lynx-cur php5-curl php5-dev php5-gd php5-mcrypt php5-memcache php5-memcached php5-mysql   
    sudo apt-get install phpmyadmin; 
    sudo echo 'Include /etc/phpmyadmin/apache.conf' >> /etc/apache2/apache2.conf;	
    sudo a2enmod ssl;
    sudo a2enmod rewrite;
    sudo apt-get -y install apachetop;
    sudo apt-get -y /home/apps/sessioninstall git-core;
    sudo chmod 444 /etc/init.d/postfix
    sudo cloud-init cloudini 'plataforma'
    sudo rm /etc/php5/conf.d/timezone.ini
    sudo mkdir /home/apps/session; sudo chmod -R 777 /home/apps/session");
	//fazer ioncube depois
   // cd /usr/local; sudo wget http://downloads2.ioncube.com/loader_downloads/ioncube_loaders_lin_x86-64.tar.gz; sudo tar xzf ioncube_loaders_lin_x86-64.tar.gz;
   // sudo cp {$conf['basedir']}/templates/ioncube.ini /etc/php5/apache2/conf.d/;  
//eaccelerator         
//exec_script("
//    cd /tmp; mkdir /tmp/eaccelerator; cd eaccelerator; wget -O /tmp/eaccelerator/eaccelerator.tar https://github.com/eaccelerator/eaccelerator/tarball/master;
//    cd /tmp/eaccelerator; tar --strip-components 1 -xf /tmp/eaccelerator/eaccelerator.tar; phpize; ./configure; make; make install;
//    rm -rf /tmp/eaccelerator;
//    sudo mkdir -p /var/cache/eaccelerator;
//    chmod 777 /var/cache/eaccelerator;
//    sudo cp {$conf['basedir']}/templates/eaccelerator.ini /etc/php5/conf.d/;
//");  

// exec_script("sudo ln -s /home/plataforma/public /home/apps/public");

//firewall
exec_script("
         sudo ufw reset
         sudo ufw allow ssh
         sudo ufw allow http
         sudo ufw allow https
         sudo ufw allow 3049
         sudo ufw enable");


//ativar app no apache
exec_script("sudo ln -s /home/apps/conf/apps.superlogica.net /etc/apache2/sites-enabled/002apps.conf");

deploy_action("apps");
apache_tunning();
//deploy_action("plataforma");
//apachetunning_action();
//_newrelic();
