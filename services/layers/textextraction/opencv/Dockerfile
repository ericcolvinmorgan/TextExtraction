#Builds OpenCV using the previously created Tesseract image.
FROM textextraction-tesseract:latest

WORKDIR /tmp

ENV BUILD_DIRECTORY=/tmp/build
COPY ./dependencies/ ${BUILD_DIRECTORY}/
COPY ./build.sh .
RUN chmod +x ./build.sh
RUN ./build.sh

WORKDIR /tmp