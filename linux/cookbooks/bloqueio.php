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
 // Processa um usuario por vez e impede um auto bloqueio
if ($login != "all") { 
    processa_bloqueio($login,$modo);
    return;
}
// Varre o diretorio home do servidor usando a classe directory para ver os usuarios criados
 $d = dir("/home/");
    while (false !== ($entry = $d->read())) {
       if (($entry != '.') and ($entry != '..')){
       processa_bloqueio($entry,$modo);
       }	
    }
 $d->close();
}// Final do bloqueio_init
function processa_bloqueio($login,$modo){
// Valida se o login e usuário são os mesmos . Não deve ser processado caso seja o mesmo  
    if(file_exists("/home/$login/.ssh/authorized_keys") and (posix_getlogin() != $login)){
        if (empty($modo)){
        @exec_script("sudo chmod 000 -R /home/$login/.ssh/ -R ;");
        echo "\nBloqueio do usuario $login feito com sucesso\n\n";
        }
        if ($modo == 'liberar'){
        @exec_script("sudo chmod 500 -R /home/$login/.ssh/ -R ;");
        echo "\nLiberacao do usuario $login feita com sucesso\n\n";
        }
    return;
    }
echo "\nUsuário $login inapto para acao ou inexistente\n\n";

} // Final da processa_bloqueio 
