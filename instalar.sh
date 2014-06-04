sudo mkdir Superlogica; sudo chmod -R 777 Superlogica; sudo mkdir Superlogica/vagrant; sudo mkdir Superlogica/sdk;
cd Superlogica/vagrant;
vagrant box add desenv http://goo.gl/Y4aRr;
vagrant init desenv http://goo.gl/Y4aRr
sudo curl https://raw.githubusercontent.com/Superlogica/framework/master/vagrant/templates/Vagrantfile -o Vagrantfile
SHARED_FOLDER = "$(PWD)/../sdk";
echo "config.vm.synced_folder '${PWD}/../sdk' , '/home/apps'" >> Vagrantfile;
echo 'end' >> Vagrantfile
vagrant up  
vagrant plugin install vagrant-vbguest;
vagrant ssh default -c "sudo ln -s /opt/VBoxGuestAdditions-4.3.10/lib/VBoxGuestAdditions /usr/lib/VBoxGuestAdditions;"
vagrant reload
vagrant ssh default -c 'sudo ./$1"
