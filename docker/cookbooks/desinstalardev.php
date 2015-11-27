<?php

function desinstalardev_init(){


exec_script("sudo apt-get purge php5
             sudo apt-get purge apache2
             sudo apt-get purge firebird2.5-superclassic
");




}
