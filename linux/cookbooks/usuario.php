<?php 
/*
Autor : Emerson Silva - 05/08/2016
Funcao : Criar usuarios em servidor e habilitar chave publica no servidor
Teste e revisao : Jean Rodrigues
*/

function usuario_init($login,$acao=null){
	// Valida os parametros recebidos
	$login = strtolower($login);
	$acao = !is_null($acao)?strtolower($acao):null;
	$parametro_invalido = (($acao != null) and ($acao != 'force'));
	if ($parametro_invalido or ($login == 'force')) {
		echo "\nParâmetro inválido ou login de usuário com formato errado/faltante !\n\n";
		exit(3);
	}
	// Gera o help
	if ($login == 'help'){
		echo "\n\n======> Bem-vindo ao HELP do cookbook usuarios ! <======\n
		      \nA estrutura do cookbook é : sudo cloud-init usuario\n
		      \nExemplo : sudo cloud-init emerson\n
		      \nTodos usuarios serao gerados com letras minusculas\n
		      \nNota:Somente usuarios com login formado por letras sem acentos , numeros ,'.' ,'-','_' sendo que \nesses caracteres não podem iniciar ou terminar o login . Outros caracteres não são aceitos!\nO login deve iniciar com letra e ter no minimo 3 digito para validação.\n
		      \nExemplos corretos : emerson.silva ou anderson\nExemplos incorretos : _emerson ou anderson@ ou emerson silva\n		
		      \nAcao : Ira gerar um novo usuario somente se ele for novo e se existir uma chavepublica gerada pelo cookbook chavepublica.\n\n";
	}else{
		// Validacao do usuario
		//Validacao da composicao do login e seus caracteres
		if (!(bool)preg_match("/[a-z]/",substr($login,0,1)) or ((bool)preg_match("/[ç:;?+=!@#$%&*><éáíóúÁÉÍÓÚ]/",$login))){
//		if (!(bool)preg_match("/[a-z]/",substr($login,0,1))){
			echo "\nCaracter invalido no inicio ou no meio do login\n\n";
			exit(3); 

		}
		if (!(bool)preg_match("/[a-z]{3,}[0-9\-_]?(\.{0,1}?)/",$login)){
			echo "\nRegra de formação do login inconsistente !\n\n";
			exit(3);
		}
		// Verifica se pasta existe no servidor local
		$caminho = "/home/$login/.ssh/";
		//Administra o parametro force para evitar erro
		if ((file_exists($caminho) and ($acao == 'force'))) {
				@unlink($caminho."$login.pub");
				@unlink($caminho."authorized_keys");
				captura_chave($caminho,$login);
				exit(3);
		}
		if (!file_exists($caminho)){
			exec_script("sudo useradd -g usuarios -s /bin/bash -m $login;");
			sleep(1);
			exec_script("sudo mkdir -m 0700 $caminho");
			echo "\nForam criadas as pastas necessarias ao processo\n\n";
				@unlink("$login.pub");
				captura_chave($caminho,$login);
				exit(3);
		}
	}
}// Encerra a funcao usuario_init
// Traz o arquivo do servidor externo para o local 
function captura_chave($caminho,$login){
	@exec_script("yes 2>/dev/null | smbclient //SLNAS2/chaves -c 'get $login.pub'");
	sleep(1);				
	@exec_script("cp $login.pub /home/$login/.ssh/$login.pub;");
	if (file_exists($caminho."$login.pub")){
		@exec_script("sudo cat /home/$login/.ssh/$login.pub >> /home/$login/.ssh/authorized_keys;
		sudo chmod +x /home/$login/.ssh/ -R ;");
		echo "\nArquivo gravado com sucesso no servidor\n\n";
		@unlink("$login.pub");
	}else{
		echo "\nNão tem arquivo no servidor ou rede instavel.Procure o suporte\n\n";
	}	
} // Encerra a funcao captura_chave
