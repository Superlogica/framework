<?php
function jumpserver_init(){
  exec_script("
    sudo cloud-init localserver;
    sudo cloud-init aide;
    
  ");
    
 }

