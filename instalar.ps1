mkdir Superlogica;
(new-object System.Net.WebClient).DownloadFile("https://github.com/Superlogica/framework/archive/master.zip", "$pwd/Superlogica/kit.zip"); unzip "$pwd/Superlogica/kit.zip" -d "$pwd/Superlogica/";
cd Superlogica
ren framework-master sdk
robocopy "$pwd/sdk/vagrant/"* "$pwd/vagrant" /e
cd vagrant; vagrant box add desenv http://goo.gl/Y4aRr; vagrant init desenv http://goo.gl/Y4aRr 
vagrant up  
vagrant ssh
