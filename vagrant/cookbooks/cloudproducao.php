<?php
function cloudproducao_init(){

exec_script("sudo cloud-init cloud
             cd /home; sudo git clone git@github.com:Superlogica/cloud.git
             sudo cloud-init cloud");
}
