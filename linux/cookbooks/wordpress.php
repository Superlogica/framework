<?php
/**
 * Instalação e Configuração do Ambiente Seguro do Wordpress
 * @author  Matheus Scarpato Fidelis
 * @email   matheus.scarpato@superlogica.com
 * @date    19/10/2016
 */

/**
* Init Method
* @return none
*/
function wordpress_init($arg) {
  $project_folder = "/home/wp";
  if (is_dir($project_folder)) {
    php7();
    apache_tunning();
    apache_restart();
    exec_script("sudo chmod 777 {$project_folder} -R");
    exec_script("sudo rm -r /var/www/html/");
    exec_script("sudo ln -s $project_folder /var/www/html");
  } else {
    echo "Primeiro clone o projeto do Wordpress em /home/wp";
  }
}

/**
* Instalando o Ambiente de PHP7 para o Wordpress
* @return none
*/
function php7() {
  $pacotes = array(
    "php7.0-cli", "php7.0-fpm", "php7.0-mysql",
    "php7.0-intl", "php7.0-xdebug", "php7.0-recode",
    "php7.0-mcrypt", "php7.0-memcache", "php7.0-memcached",
    "php7.0-imagick", "php7.0-curl", "php7.0-xsl",
    "php7.0-dev", "php7.0-tidy", "php7.0-xmlrpc",
    "php7.0-gd", "php7.0-pspell", "libapache2-mod-php7.0",
    "php7.0-interbase", "php-apc", "php-pear",
    "apache2", "apachetop");

  instalar($pacotes);

  exec_script("
    sudo phpenmod mcrypt;
    sudo phpenmod interbase;
    sudo a2enmod ssl;
    sudo a2enmod rewrite;
  ");

  exec_script("sudo cloud-init varnish");
  exec_script("sudo cloud-init phpini");
}
