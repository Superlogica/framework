<?php
/*
Criado por : Emerson Silva
Data : 11/08/2016
Funcao : Efetuar/Restaurar o bloqueio de acessos aos servidores 
Testado e revisado por Jean Rodrigues
*/

function bloqueio_init($login=null,$modo=null){
// Valida os parametros recebidos
$login = strtolower($login);
$modo = strtolower($modo);
// Gera o help
if ($login == 'help'){
    echo "\n\n======> Bem-vindo ao HELP do cookbook bloqueio ! <======\n
    \nA estrutura do cookbook é : sudo cloud-init bloqueio login <modo>\n
    \nExemplo : sudo cloud-init bloqueio emerson\n
    \nExemplo 2 : sudo cloud-init bloqueio emerson liberar\n
    \nExemplo 3 : sudo cloud-init bloqueio all\n
    \nAcao : Esse cookbook pode bloquear ou liberar um usuario ou todos bloqueando o acesso às chaves publicas do usuário.\n\n";
    return;
}
// Processa todos usuarios
 $usuario = posix_getlogin();
 // Processa um usuario por vez e impede um auto bloqueio
if (($login != "all") and ($login != $usuario)){ 
    processa_bloqueio($login,$modo);
    return;
}
// Varre o diretorio home do servidor usando a classe directory para ver os usuarios criados
 $d = dir("/home/");
    while (false !== ($entry = $d->read())) {
       if (($entry != '.') and ($entry != '..') and ($entry != $usuario)){
       processa_bloqueio($entry,$modo);
       }	
    }
 $d->close();
}// Final do bloqueio_init
function processa_bloqueio($login,$modo){
    if(file_exists("/home/$login/.ssh/authorized_keys")){
        if (empty($modo)){
        @exec_script("sudo chmod 000 /home/$login/.ssh/ -R ;");
        echo "\nBloqueio do usuario $login feito com sucesso\n\n";
        }
        if ($modo == 'liberar'){
        @exec_script("sudo chmod 444 /home/$login/.ssh/ -R ;");
        echo "\nLiberacao do usuario $login feita com sucesso\n\n";
        }
    return;
    }
echo "\nUsuário inapto ou inexistente\n\n";
} // Final da processa_bloqueio 
