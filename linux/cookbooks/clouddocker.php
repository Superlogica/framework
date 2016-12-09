<?php

function cloudteste_init(){


exec_script("
						cd /home/cloud
						git config core.fileMode false
						cd /home/framework
						git config core.fileMode false
						cd /home/apps
						git config core.fileMode false
						cd /home/plataforma
						git config core.fileMode false
						
						sudo cloud-init cloud

						sudo chmod 777 -R /etc/php5
						sudo chmod 777 -R /etc/apache2
						sudo chmod 777 -R /home/cloud
						sudo chmod 777 -R /home/cloud-db

            echo '-------------PROCESSO FINALIZADO-------------'
            echo '---- CLOUD ACESSE http://localhost:3059/ ----'
            echo '----- APPS ACESSE http://localhost:8080/ ----'"
            );
}
