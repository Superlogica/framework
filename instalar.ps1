mkdir Superlogica; mkdir Superlogica/vagrant; mkdir Superlogica/sdk;
cd Superlogica/vagrant;
vagrant box add desenv http://files.vagrantup.com/lucid32.box
vagrant init desenv http://files.vagrantup.com/lucid32.box
(new-object System.Net.WebClient).DownloadFile("https://raw.githubusercontent.com/Superlogica/framework/master/vagrant/templates/Vagrantfile", "$pwd/Vagrantfile"); 
$sharedFolder = "$pwd/../sdk";
Add-Content "$pwd/Vagrantfile" "config.vm.provision 'shell', inline: 'sudo ln -s /opt/VBoxGuestAdditions-4.3.10/lib/VBoxGuestAdditions /usr/lib/VBoxGuestAdditions;'";
Add-Content "$pwd/Vagrantfile" 'end'
vagrant plugin install vagrant-vbguest;
vagrant provision
(new-object System.Net.WebClient).DownloadFile("https://raw.githubusercontent.com/Superlogica/framework/master/vagrant/templates/Vagrantfile", "$pwd/Vagrantfile"); 
$sharedFolder = "$pwd/../sdk";
Add-Content "$pwd/Vagrantfile" "config.vm.synced_folder '$sharedFolder' , '/home/apps'";
Add-Content "$pwd/Vagrantfile" "config.vm.provision 'shell', inline: 'cd /vagrant; sudo wget https://raw.githubusercontent.com/Superlogica/framework/master/vagrant/cloud-apps --no-check-certificate; sudo bash cloud-apps;'";
Add-Content "$pwd/Vagrantfile" 'end'
vagrant up
mkdir $pwd/../sdk/public/scripts/min;
mkdir $pwd/../sdk/session;