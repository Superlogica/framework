<?php

function tester_action() {
    exec_script("
	sudo cloud-init composer;
	sudo cloud-init phpunit;
   ");
}
