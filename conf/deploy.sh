#!/bin/bash
/usr/bin/sudo /bin/mkdir -p  /home/apps/var
/usr/bin/sudo /bin/chmod 777 /home/apps/var/ -R
/usr/bin/sudo /bin/mkdir -p  /home/apps/public/scripts/min
/usr/bin/sudo /bin/chmod 777 /home/apps/public/scripts/min -R

/usr/bin/sudo /bin/rm -f /home/apps/var/log/cache/* -Rf
/usr/bin/sudo /bin/rm -f /home/apps/public/scripts/min/* -Rf
/usr/bin/sudo /bin/ls /home/apps/ >> /tmp/ls_home_apps

for i in $(/bin/cat /tmp/ls_home_apps) ; do
   if [ $i != "conf" ] && [ $i != "public" ] && [ $i != "var" ] ; then

        if [ ! -d /home/apps/$i/Data ] ; then
                /usr/bin/sudo /bin/mkdir /home/apps/$i/Data
        fi
   fi
done
/usr/bin/sudo /usr/bin/find  /home/apps -name Data -exec /bin/chmod 777 -R {} \;
/usr/bin/sudo /bin/rm /tmp/ls_home_apps
