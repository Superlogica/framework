<?php

function cloudteste_init(){


exec_script("
			sudo cloud-init smartgit
			sudo cloud-init cloud
            sudo cloud-init fb25
            sudo cloud-init dev
            sudo cloud-init cloud-apps"
            );
}
