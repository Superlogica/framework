<?php
function cloudtesteaws_init(){
exec_script("sudo dev-init cloud
             cd /home; sudo git clone git@github.com:Superlogica/cloud.git
             sudo dev-init cloud
             sudo dev-init cloudini cloudteste
             sudo dev-init fb21
             sudo /home/cloud/conf/deploy.sh
             sudo rm /home/cloud/cloud.lock
             sudo mkdir /home/cloud-db
             sudo chmod 777 /home/cloud-db -R");
}
