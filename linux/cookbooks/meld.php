<?php

/**
 * Meld, Diff Tool Open Source do Git.
 * Cookbook de instalaчуo
 */
function meld_init() {

    exec_script("
        sudo apt-get update
        sudo apt-get install meld -y
        git config --global diff.tool meld
        git config --global difftool.prompt false
    ");

    if (is_dir("/usr/share/meld/")) {
        $meld_src = "/usr/share/meld/git-meld.pl";
    } elseif (is_dir("/usr/lib/meld/meld/")) {
        $meld_src = "/usr/lib/meld/meld/git-meld.pl";
    } else {
        $meld_src = null;
    }

    if ($meld_src) {
        put_template('git-meld.pl', $meld_src);
    }

    help();
}

/**
 * Helper do Meld
 */
function help() {
    exec_script("
        echo 'GIT MELD - Ferramenta de Diff Open Source para Git.\n';
        echo 'Para utilizar a ferramenta, navegue atщ a pasta do projeto e chame o meld junto ao Git:\n';
        echo ' cd /home/cloud; git meld ';
    ");
}



