#Builds poppler using the previously created dev base image.
FROM textextraction-dev

WORKDIR /tmp

ENV BUILD_DIRECTORY=/tmp/build
COPY ./dependencies/ ${BUILD_DIRECTORY}/
COPY ./build.sh .
RUN chmod +x ./build.sh
RUN ./build.sh

WORKDIR /tmp