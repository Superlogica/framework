<?php

function rabbitvcs_init(){

	exec_script("
		echo '------Rabbitvcs------'
		sudo apt-get update
		sudo apt-get install git
		sudo apt-get update
		sudo add-apt-repository ppa:rabbitvcs/ppa
		sudo apt-get update
		sudo apt-get install rabbitvcs-cli rabbitvcs-core rabbitvcs-gedit rabbitvcs-nautilus3
	");
}
