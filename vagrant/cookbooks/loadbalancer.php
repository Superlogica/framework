<?php

function loadbalancer_init(){
    
    exec_script("
        sudo apt­get install haproxy;
    ");

    put_template("haproxy.cfg", "/etc/haproxy/haproxy.cfg");
    put_template("haproxy", "/etc/default/haproxy");


    exec_script("
        sudo service haproxy start;
        sudo ufw allow 2280;
    ");
    

}
