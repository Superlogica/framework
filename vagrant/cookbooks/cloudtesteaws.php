<?php
function cloudtesteaws_init(){
exec_script("sudo cloud-init cloud
             cd /home; sudo git clone git@github.com:Superlogica/cloud.git
             sudo cloud-init cloud
             sudo cloud-init cloudini cloudteste
             sudo cloud-init fb21
             sudo /home/cloud/conf/deploy.sh
             sudo rm /home/cloud/cloud.lock
             sudo chmod 777 /home/cloud-db -R");
}
