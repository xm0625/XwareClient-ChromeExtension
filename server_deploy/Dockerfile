FROM debian
MAINTAINER xm0625

RUN apt-get update && \
    apt-get install -y python2.7 \
                       python2.7-dev \
                       ca-certificates \
    # 用完包管理器后安排打扫卫生可以显著的减少镜像大小
    && apt-get clean \
    && apt-get autoclean \
    && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/* \
    && ln -s /usr/bin/python2.7 /bin/python \
    && mkdir -p /baseDir

COPY ./server_deploy/* /baseDir

WORKDIR /baseDir
CMD ["/bin/python", "-u","./xserver.py"]
