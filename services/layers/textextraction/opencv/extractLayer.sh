rm layer.zip
START_DIR=${PWD}
DOCKER_ID=$(docker run -it -d textextraction-opencv:latest /bin/bash)

docker exec -it ${DOCKER_ID} sh -c 'mkdir -p /opt/package/lib'
docker exec -it ${DOCKER_ID} sh -c 'mkdir -p /opt/package/bin'
docker exec -it ${DOCKER_ID} sh -c 'mkdir -p /opt/package/python/lib/python3.8/site-packages'
docker exec -it ${DOCKER_ID} sh -c "ldd /opt/lib/python3.8/site-packages/cv2/python-3.8/cv2.cpython-38-x86_64-linux-gnu.so | grep ""\"""=> /""\""" | awk '{print \$3}' | xargs -I '{}' cp -v '{}' /opt/package/lib"
docker exec -it ${DOCKER_ID} sh -c "ldd /opt/bin/tesseract | grep ""\"""=> /""\""" | awk '{print \$3}' | xargs -I '{}' cp -v '{}' /opt/package/lib"
docker exec -it ${DOCKER_ID} sh -c 'cp /opt/bin/tesseract /opt/package/bin/'
docker exec -it ${DOCKER_ID} sh -c 'cp /opt/bin/opencv* /opt/package/bin/'
# docker exec -it ${DOCKER_ID} sh -c 'cp -r /opt/lib /opt/package/'
# docker exec -it ${DOCKER_ID} sh -c 'cp -r /opt/lib64 /opt/package/'
# docker exec -it ${DOCKER_ID} sh -c 'cp -r /opt/bin /opt/package/'
# docker exec -it ${DOCKER_ID} sh -c 'cp -r /opt/lib/python3.8/site-packages/cv2 /opt/package/python/'
docker exec -it ${DOCKER_ID} sh -c 'cp -r /opt/lib/python3.8/site-packages/cv2 /opt/package/python/lib/python3.8/site-packages'

mkdir temp
docker cp ${DOCKER_ID}:/opt/package ./temp
docker stop ${DOCKER_ID}
docker rm -v ${DOCKER_ID}

cd temp && cd package
# Replace config-3.8 with config for AWS Lambda environment
cp ../../aws-cv2-config-3.8.py ./python/lib/python3.8/site-packages/cv2/config-3.8.py

zip -mrq ${START_DIR}/layer.zip ./*
cd ${START_DIR}
rm -rf ${START_DIR}/temp
