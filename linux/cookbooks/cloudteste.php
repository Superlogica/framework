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
            sudo cloud-init fb25
            sudo cloud-init dev
            sudo cloud-init cloud-apps
            sudo cloud-init mysql-apps"
            );
}
