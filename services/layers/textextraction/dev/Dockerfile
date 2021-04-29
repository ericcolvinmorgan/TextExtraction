# Builds development dependencies using the previosuly created base image.
FROM textextraction-base

WORKDIR /tmp

ENV BUILD_DIRECTORY=/tmp/build
COPY ./dependencies/ ${BUILD_DIRECTORY}/
COPY ./build.sh .
RUN chmod +x ./build.sh
RUN ./build.sh

WORKDIR /tmp