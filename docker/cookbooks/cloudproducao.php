<?php
function cloudproducao_init(){

exec_script("sudo dev-init cloud
             cd /home; sudo git clone git@github.com:Superlogica/cloud.git
             sudo dev-init cloud
             sudo dev-init cloudini cloudteste");
}
