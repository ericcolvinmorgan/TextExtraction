#Builds tesseract using the latest aws lambda provided image.
FROM amazon/aws-lambda-python:3.8

WORKDIR /tmp

ENV BUILD_DIRECTORY=/tmp/build
COPY ./build.sh .
RUN chmod +x ./build.sh
RUN ./build.sh

WORKDIR /tmp