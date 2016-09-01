<?php
/*
Script revisado por : Emerson Silva 
Data : 04/08/2016 
Teste e validacao : Jean Rodrigues
*/
function chavepublica_init($parametro=null){
$parametro = strtolower($parametro);
    if ($parametro == 'help'){
        echo "\n\n======> Bem-vindo ao HELP do cookbook chavepublica ! <======\n
	\nA estrutura do cookbook é : cloud-init chavepublica <parametro>\n
	\nExemplo 1 : cloud-init chavepublica\n
	\nExemplo 2 : cloud-init chavepublica force\n
	\nFORCE =  Use parametro force para gerar novas chaves.\n
	Exemplo: cloud-init chavepublica force\n
	Nota : Nao diferencia maiuscula de minuscula\n
	Acao : As chaves atuais serao apagadas , geradas novamente e enviadas ao servidor\n\n";
	return;
	}
// Capta usuario logado no sistema
$usuario = posix_getlogin();
$caminho = "/home/$usuario/.ssh/";
// Apaga os arquivos atuais
    if(((file_exists($caminho.$usuario.".pub")) and ($parametro == 'force'))or(!file_exists($caminho.$usuario.".pub"))) {
        @unlink($caminho.$usuario);
		@unlink($caminho.$usuario.".pub");
		@unlink($caminho."id_rsa");
		echo "\n\nAperte ENTER no proximo passo e aguarde a resposta ...\n\n";  
		// Gerar chaves do tipo rsa - usar criptografia
            if(!file_exists($caminho."id_rsa.pub")){
        	    exec_script("ssh-keygen -t rsa -N ''");
            }else{
            	@unlink($caminho."id_rsa");
            	@unlink($caminho."id_rsa.pub");
            	exec_script("ssh-keygen -t rsa -N ''");
        	}
	// Renomeia os arquivos de chave
	echo (rename($caminho."id_rsa.pub",$caminho."$usuario.pub")) ? "\nChaves publicas e privadas
	geradas corretamente\nSua chave publica esta em : $caminho$usuario.pub\n\n" : "\nFalha na geracao
	na chave , tente novamente ou acione o suporte!\n";
	exec_script("sudo rm -rf chavepublica.php.*;");
	@unlink($usuario.".pub");
	return;
    }
	echo "\n\nAtencao : Chaves já existentes ! Nada foi alterado.\n";
}
