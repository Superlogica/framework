<?php

function tester_init() {
    exec_script("
	sudo cloud-init composer;
	sudo cloud-init phpunit;
   ");
}
