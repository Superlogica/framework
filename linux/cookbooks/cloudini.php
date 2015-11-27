<?php

function cloudini_init($ambiente="cloud"){

        if ($ambiente == "cloud"){
           put_template("cloud.ini","/home/cloud/configs/cloud.ini");
        }
        if ($ambiente == "cloudteste"){
           put_template("cloudteste.ini","/home/cloud/configs/cloud.ini");
        }        
        
		
        if ($ambiente == "plataforma"){
            put_template("cloud-apps.ini","/home/plataforma/library/Application/Configs/cloud.ini");
        }    
}

