<?php
/*
Script revisado por : Emerson Silva 
Data : 04/08/2016 
Teste e validacao : Jean Rodrigues
*/

function chavepublica_init(){
	$parametro = !empty($GLOBALS['argv'][2]) ? $GLOBALS['argv'][2]  : null ;
	if (strtoupper($parametro) == 'HELP'){
		echo "\n\n======> Bem-vindo ao HELP do cookbook chavepublica ! <======\n
		      \nA estrutura do cookbook é : cloud-init chavepublica <parametro>\n
		      \nExemplo 1 : cloud-init chavepublica\n
		      \nExemplo 2 : cloud-init chavepublica force\n
		      \nServidor Padrao : SLNAS2\n\n<parametro>\n
		      \nFORCE =  Use parametro force para gerar novas chaves.\n
		        Exemplo: cloud-init chavepublica force\n
			Nota : Nao diferencia maiuscula de minuscula\n
			Acao : As chaves atuais serao apagadas , geradas novamente e enviadas ao servidor\n\n";
	}else{
	// Capta usuario logado no sistema
		$usuario = posix_getlogin();
		$caminho = "/home/$usuario/.ssh/";
	// Apaga os arquivos atuais
		if(((file_exists($caminho.$usuario.".pub")) and (strtoupper($parametro) == 'FORCE'))or(!file_exists($caminho.$usuario.".pub"))) {

			if(file_exists($caminho.$usuario)){
				unlink($caminho.$usuario);
			}
			if(file_exists($caminho.$usuario.".pub")){
				unlink($caminho.$usuario.".pub");
			}
			if(file_exists($caminho."id_rsa")){
				unlink($caminho."id_rsa");
			}
					echo "\n\nAperte ENTER no proximo passo e aguarde a resposta ...\n\n";  
					// Gerar chaves do tipo rsa - usar criptografia
					if(!file_exists($caminho."id_rsa.pub")){
					exec_script("ssh-keygen -t rsa -N ''");
					}else{
					unlink($caminho."id_rsa");
					unlink($caminho."id_rsa.pub");
					exec_script("ssh-keygen -t rsa -N ''");
					}
	// Renomeia os arquivos de chave
		(rename($caminho."id_rsa.pub",$caminho."$usuario.pub")) ? $mensagem = "\nChaves publicas e privadas geradas corretamente. Obrigado!\n" : $mensagem = "\nFalha na geracao da chave , tente novamente ou acione o suporte!\n";		
		echo $mensagem;
	// Gera copia local e envia ao servidor SLNAS2
		exec_script("cp /home/$usuario/.ssh/$usuario.pub $usuario.pub");
		exec_script("yes 2>/dev/null | smbclient //SLNAS2/chaves -c 'put $usuario.pub'");
		unlink($usuario.".pub");
}else{
	echo "\n\nAtencao : Chaves já existentes ! Nada foi alterado.\n";
}
}
}
