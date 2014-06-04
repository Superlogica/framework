mkdir Superlogica; mkdir Superlogica/vagrant; mkdir Superlogica/sdk;
cd Superlogica/vagrant;
vagrant box add desenv http://goo.gl/Y4aRr;
vagrant init desenv http://goo.gl/Y4aRr
(new-object System.Net.WebClient).DownloadFile("https://raw.githubusercontent.com/Superlogica/framework/master/vagrant/templates/Vagrantfile", "$pwd/Vagrantfile"); 
$sharedFolder = "$pwd/../sdk";
Add-Content "$pwd/Vagrantfile" "config.vm.synced_folder '$sharedFolder' , '/home/apps'";
Add-Content "$pwd/Vagrantfile" 'end'
vagrant up  
vagrant plugin install vagrant-vbguest;
vagrant ssh default -c "sudo ln -s /opt/VBoxGuestAdditions-4.3.10/lib/VBoxGuestAdditions /usr/lib/VBoxGuestAdditions;"
vagrant reload
vagrant ssh default -c "cd /vagrant; sudo wget https://raw.githubusercontent.com/Superlogica/framework/master/getkit.sh; sudo ./getkit.sh; sudo ./$args[1]"