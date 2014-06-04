sudo mkdir Superlogica; sudo chmod -R 777 Superlogica; Superlogica sudo mkdir Superlogica/vagrant; sudo mkdir Superlogica/sdk;
cd Superlogica/vagrant;
vagrant box add desenv http://goo.gl/Y4aRr;
vagrant init desenv http://goo.gl/Y4aRr
sudo curl https://raw.githubusercontent.com/Superlogica/framework/master/vagrant/templates/Vagrantfile -o Vagrantfile
FILE_PATH_EX = PWD/Vagrantfile;
SHARED_FOLDER = PWD/Superlogica/+"sdk";
"config.vm.synced_folder 'SHARED_FOLDER' , '/home/apps'" >> FILE_PATH_EX;
'end' >> FILE_PATH_EX
vagrant up  
vagrant plugin install vagrant-vbguest;
vagrant ssh default -c "sudo ln -s /opt/VBoxGuestAdditions-4.3.10/lib/VBoxGuestAdditions /usr/lib/VBoxGuestAdditions;"
vagrant reload
vagrant ssh default -c 'sudo ./$1"
