if((Test-Path $pwd/Superlogica/vagrant/.vagrant) -eq 0){
	mkdir Superlogica; mkdir Superlogica/vagrant; mkdir Superlogica/sdk;
	cd Superlogica/vagrant;
	vagrant box add desenv https://dl.dropbox.com/u/14741389/vagrantboxes/lucid64-lamp.box
	vagrant init desenv https://dl.dropbox.com/u/14741389/vagrantboxes/lucid64-lamp.box
} else {
	cd Superlogica/vagrant;
}
(new-object System.Net.WebClient).DownloadFile("https://raw.githubusercontent.com/Superlogica/framework/master/vagrant/templates/Vagrantfile", "$pwd/Vagrantfile"); 
Add-Content "$pwd/Vagrantfile" "config.vm.provision 'shell', inline: 'sudo ln -s /opt/VBoxGuestAdditions-4.3.10/lib/VBoxGuestAdditions /usr/lib/VBoxGuestAdditions;'";
Add-Content "$pwd/Vagrantfile" 'end'
vagrant plugin install vagrant-vbguest;
vagrant provision
$modo = $args[0];
(new-object System.Net.WebClient).DownloadFile("https://raw.githubusercontent.com/Superlogica/framework/master/vagrant/templates/Vagrantfile", "$pwd/Vagrantfile"); 
If ($modo -eq 'cloud-apps'){
	$sharedFolder = "$pwd/../sdk";
	Add-Content "$pwd/Vagrantfile" "config.vm.synced_folder '$sharedFolder' , '/home/apps'";
} 
Else 
{
	Add-Content "$pwd/Vagrantfile" "config.vm.synced_folder 'C:/git/cloud' , '/home/cloud'";
}
Add-Content "$pwd/Vagrantfile" "config.vm.provision 'shell', inline: 'cd /vagrant; sudo wget https://raw.githubusercontent.com/Superlogica/framework/master/vagrant/$modo --no-check-certificate; sudo bash $modo;'";
Add-Content "$pwd/Vagrantfile" 'end'
vagrant up
mkdir $pwd/../sdk/public/scripts/min;
mkdir $pwd/../sdk/session;