DOCKER_ID=$(docker create textextraction-poppler:latest)
# docker cp ${DOCKER_ID}:/opt/lib64/ ./temp/staging
docker cp ${DOCKER_ID}:/opt/package ./temp
docker cp ${DOCKER_ID}:/opt/python/ ./temp/
docker rm -v ${DOCKER_ID}

cd temp
#cp ./staging/libpoppler-cpp.* ./lib
rm -rf ./staging

zip -mrq ../layer.zip ./*
cd .. && rm -rf temp