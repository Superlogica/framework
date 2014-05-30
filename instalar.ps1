mkdir Superlogica;
(new-object System.Net.WebClient).DownloadFile("https://github.com/Superlogica/framework/archive/master.zip", "$pwd/Superlogica/kit.zip"); unzip "$pwd/Superlogica/kit.zip" -d "$pwd/Superlogica/";
cd Superlogica
$dirBase = "$pwd\"
ren framework-master sdk
robocopy "$pwd/sdk/vagrant/"* "$pwd/vagrant" /e
cd vagrant; ls;
vagrant box add desenv http://goo.gl/Y4aRr;
vagrant init desenv http://goo.gl/Y4aRr
copy "$pwd/templates\Vagrantfile" "$pwd\Vagrantfile"
$caminhoArquivo = "$pwd\Vagrantfile";
$sharedFolder = $dirBase+"sdk";
Add-Content $caminhoArquivo "config.vm.synced_folder '$sharedFolder' , '/home/apps'";
Add-Content $caminhoArquivo 'end'
vagrant up  
vagrant plugin install vagrant-vbguest;
vagrant ssh; 
sudo ln -s /opt/VBoxGuestAdditions-4.3.10/lib/VBoxGuestAdditions /usr/lib/VBoxGuestAdditions; exit;
vagrant reload