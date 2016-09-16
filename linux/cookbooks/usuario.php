<?php
/*
Autor : Emerson Silva - 05/08/2016
Funcao : Criar usuarios em servidor e habilitar chave publica no servidor
Teste e revisao : Jean Rodrigues, Matheus Fidelis
*/
function usuario_init($login,$grupo="usuarios",$acao=null){
// Valida os parametros recebidos
$login = strtolower($login);
// Nao inverter ordem da acao e grupo abaixo	
$acao = ($grupo == "force") ? "force"  :strtolower($acao);
$grupo = ($grupo == "force") ? "usuarios" :  strtolower($grupo);
$parametro_invalido = (($acao != null) and ($acao != 'force'));
    if ($parametro_invalido or ($login == 'force')) {
        echo "\nParâmetro inválido ou login de usuário com formato errado/faltante !\n\n";
	exit(3);
	}
    // Gera o help
    if ($login == 'help'){
        echo "\n\n======> Bem-vindo ao HELP do cookbook usuarios ! <======\n
        \nA estrutura do cookbook é : sudo cloud-init usuario login <grupo> <modo>
        \nExemplo 2 : sudo cloud-init usuario emerson
	    \nExemplo 3 : (Gerando um usuario para o grupo suporte) : sudo cloud-init usuario emerson suporte
	    \nExemplo 4 (Removendo um usuário em definitivo - use em caso de desligamento) : sudo cloud-init usuario emerson excluir
	    \nTodos usuarios serao gerados com letras minusculas
	    \nNota:Somente usuarios com login formado por letras sem acentos , numeros ,'.' ,'-','_' sendo que \nesses caracteres não podem iniciar ou terminar o login . Outros caracteres nÃ£o sÃ£o aceitos!\n\nO login deve iniciar com letra e ter no minimo 3 digito para validação.\n\nGrupo de usuario padrao : usuarios
	    \nExemplos corretos : emerson.silva ou anderson\nExemplos incorretos : _emerson ou anderson@ ou emerson silva
	    \nAcao : Ira gerar um novo usuario somente se ele for novo e se existir uma chavepublica gerada pelo cookbook chavepublica.\n\n";
	return;
	}
        //Configura o shell restrito
	configuraLShell();
	copySudoers();
	// Insere apenas um usuario
	processa_usuario($login,$grupo,$acao);
}// Encerra a funcao usuario_init
// Traz o arquivo do servidor externo para o local 
function captura_chave($caminho,$login){
	put_template("publickeys/$login.pub","/home/$login/.ssh/$login.pub");  
	if (file_exists($caminho."$login.pub")){
        @exec_script("sudo cat /home/$login/.ssh/$login.pub >> /home/$login/.ssh/authorized_keys;
		sudo chmod 500 /home/$login/.ssh/ -R ;
		sudo chown -R $login:$grupo /home/$login/.ssh/ ;");
	echo "\nArquivo gravado com sucesso no servidor\n\n";
	@unlink("$login.pub");
	}else{
    	echo "\nNão tem arquivo no servidor ou rede instavel.Procure o suporte\n\n";
	}	
} // Encerra a funcao captura_chave
// Funcao para processamento dos usuarios
function processa_usuario($login,$grupo,$acao,$todos=false){
	// Valida usuario logado
	if (posix_getlogin() == $login){
		echo "\nUsuario logado - processo não permitido\n\n";
		exit(3);
	}
	// Excluir usuario do servidor especificando o grupo ou não como parametro 
	if ((strtolower($grupo)=='excluir') or (strtolower($acao)=='excluir')) {
		exec_script("sudo userdel -r $login;");
		exit(3);
	} 
	// Verifica se existe grupo
	if (!stristr(file_get_contents("/etc/group"),"$grupo:")){
		@exec_script("sudo groupadd $grupo;");
	}
	//Valida primeiro caracter do login
	if (!(bool)preg_match("/^[a-z]{1}[a-z0-9._\-]{1,}[^\][}{|\/Ã§:;,?+=!@#$%&*°ºª À-Úà-ú]$/",$login)){
		echo "\nTamanho / caracter invalido no uso do login do usuario, revise e tente novamente\n\n";
		exit(3); 
	}
	// Verifica se pasta .ssh  existe no servidor local
	$caminho = "/home/$login/.ssh/";
	if ((file_exists($caminho) and (is_writable($caminho)))) {
		@unlink($caminho."$login.pub");
		@unlink($caminho."authorized_keys");
		captura_chave($caminho,$login);
	}
	// Se nao ha usuÃ¡rio , criamos um novo no Linux e sua pasta .ssh		
	if (!file_exists($caminho)){
		exec_script("sudo useradd -g $grupo -s /usr/bin/lshell -m $login;");
		exec_script("sudo adduser $login sudo");
		sleep(1);
		exec_script("sudo mkdir -m 500 $caminho");
		echo "\nForam criadas as pastas necessarias ao processo\n\n";
		@unlink("$login.pub");
		captura_chave($caminho,$login);
                geraParDeChavesRSA($caminho, $login, $acao);
	}
} // Final da processa_usuario

//Instala o Lshell e atualiza o template para a versão mais recente
function configuraLShell() {
    exec_script("apt-get update; apt-get install lshell -y");
    if ((file_exists("/etc/lshell.conf") AND (is_writable("/etc/lshell.conf")))) {
    	@unlink("/etc/lshell.conf");
    }
    put_template("lshell.conf", "/etc/lshell.conf");
}

//Gera um par de chaves RSA para o usuário local da maquina
function geraParDeChavesRSA($caminho, $login, $acao) {
    //Caso já existam chaves, e a ação for "Force", as chaves existentes vão ser excluídas
    if ((file_exists("{$caminho}id_rsa") AND ( is_writable("{$caminho}id_rsa")))) {
        if ($acao === "force") {
            @unlink("{$caminho}id_rsa");
            @unlink("{$caminho}id_rsa.pub");
        } else {
            return false;
        }
    }
    //Gera a chave RSA já na home do usuário
    exec_script("chmod 770 {$caminho}; sudo -u {$login} ssh-keygen -t rsa -f {$caminho}id_rsa -N '' ; chmod 500 /home/{$login}/.ssh/");
}

//Copia o arquivo sudoers do servidor. Não foi possivel utilizar o put_template, pois o arquivo
// sudoers do Linux tem edição restrita exclusivamente pelo visudo de forma segura no Ubuntu.
function copySudoers() {
	exec_script("
		cd /opt/cloud-init/cloud/templates/;
		chmod 777 /opt/cloud-init/cloud/templates/;
		wget https://raw.githubusercontent.com/Superlogica/framework/master/linux/templates/sudoers;
		sudo bash -c 'cat sudoers | (EDITOR='tee' visudo)'"
		);
}
