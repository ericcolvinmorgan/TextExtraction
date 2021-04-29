rm layer.zip
START_DIR=${PWD}
DOCKER_ID=$(docker run -it -d textextraction-tesseract:latest /bin/bash)
docker exec -it ${DOCKER_ID} sh -c 'mkdir -p /opt/package/lib'
docker exec -it ${DOCKER_ID} sh -c 'mkdir -p /opt/package/bin'
docker exec -it ${DOCKER_ID} sh -c "export LD_LIBRARY_PATH=\${LD_LIBRARY_PATH}:/opt/lib64 && ldd /opt/bin/tesseract | grep ""\"""=> /""\""" | awk '{print \$3}' | xargs -I '{}' cp -v '{}' /opt/package/lib"
docker exec -it ${DOCKER_ID} sh -c 'cp /opt/bin/tesseract /opt/package/bin/'

mkdir temp
docker cp ${DOCKER_ID}:/opt/package ./temp
docker stop ${DOCKER_ID}
docker rm -v ${DOCKER_ID}

cd temp && cd package
zip -mrq ${START_DIR}/layer.zip ./*
cd ${START_DIR}
rm -rf ${START_DIR}/temp
