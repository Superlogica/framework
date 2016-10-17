FROM ubuntu:16.04
MAINTAINER Matheus Fidelis <matheus.scarpato@superlogica.com>

ADD ./setPass.sh /home/setPass.sh

RUN apt-get update && apt-get install -qy libncurses5-dev bzip2 curl gcc g++ make libicu-dev wget curl sudo lsb-release --force-yes

RUN mkdir -p /home/firebird && \
    cd /home/firebird && \
    curl -o firebird-source.tar.bz2 -L \
        "http://downloads.sourceforge.net/project/firebird/firebird/2.5.5-Release/Firebird-2.5.5.26952-0.tar.bz2" && \
    tar --strip=1 -xf firebird-source.tar.bz2 && \
    ./configure \
        --prefix=${PREFIX} --with-fbbin=${PREFIX}/bin --with-fbsbin=${PREFIX}/bin --with-fblib=${PREFIX}/lib \
        --with-fbinclude=${PREFIX}/include --with-fbdoc=${PREFIX}/doc --with-fbudf=${PREFIX}/UDF \
        --with-fbsample=${PREFIX}/examples --with-fbsample-db=${PREFIX}/examples/empbuild --with-fbhelp=${PREFIX}/help \
        --with-fbintl=${PREFIX}/intl --with-fbmisc=${PREFIX}/misc --with-fbplugins=${PREFIX} \
        --with-fblog=/var/firebird/log --with-fbglock=/var/firebird/run \
        --with-fbconf=/var/firebird/etc --with-fbmsg=${PREFIX} \
        --with-fbsecure-db=/var/firebird/system --with-system-icu &&\
    make && \
    make silent_install && \
    cd / && \
    rm -rf /home/firebird && \
    rm -rf ${PREFIX}/*/.debug && \
    apt-get purge -qy --auto-remove libncurses5-dev bzip2 curl gcc g++ make libicu-dev && \
    apt-get clean -q && \
    rm -rf /var/lib/apt/lists/* && \
    /home/setPass.sh && \
    rm -f /home/setPass.sh


RUN mkdir /home/cloud /home/cloud-db /home/apps /home/framework /home/plataforma /home/session /home/cloud-admin /home/subadquirente
RUN cd /opt; rm -rf /opt/cloud-init; mkdir /opt/cloud-init; chmod 777 /opt/cloud-init/;cd /opt/cloud-init;  wget https://raw.githubusercontent.com/Superlogica/framework/master/linux/cloud-init-init --no-check-certificate;  chmod 777 /opt/cloud-init/cloud-init-init;
RUN  /opt/cloud-init/cloud-init-init cloudteste;