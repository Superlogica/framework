<?php
function jumpserver_init(){
  exec_script("
    sudo /opt/cloud-init/cloud-init-init localserver;
    sudo /opt/cloud-init/cloud-init-init aide;
    
  ");
    
 }
 