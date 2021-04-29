#!/bin/bash
source /etc/environment
set -e;

printf "\n----- DEFAULT ENVIRONMENT VARIABLES -----"
export BUILD_DIRECTORY="${BUILD_DIRECTORY}"
export INSTALL_DIRECTORY="${INSTALL_DIRECTORY}"
export PKG_CONFIG_PATH="${PKG_CONFIG_PATH}"
export PKG_CONFIG="${PKG_CONFIG}"
export PATH="${PATH}"
export LD_LIBRARY_PATH="${LD_LIBRARY_PATH}"
export CFLAGS="${CFLAGS}"
export CPPFLAGS="${CPPFLAGS}"
export LDFLAGS="${LDFLAGS}"

echo "BUILD DIRECTORY=${BUILD_DIRECTORY}"
echo "INSTALL DIRECTORY=${INSTALL_DIRECTORY}"
echo "PKG_CONFIG_PATH=${PKG_CONFIG_PATH}"
echo "PKG_CONFIG=${PKG_CONFIG}"
echo "PATH=${PATH}"
echo "LD_LIBRARY_PATH=${LD_LIBRARY_PATH}"
echo "CFLAGS=${CFLAGS}"
echo "CPPFLAGS=${CPPFLAGS}"
echo "LDFLAGS=${LDFLAGS}"

# Install Dependencies
export OPENCV_CONTRIB_BUILD_DIRECTORY=${BUILD_DIRECTORY}/opencv_contrib
export OPENCV_BUILD_DIRECTORY=${BUILD_DIRECTORY}/opencv

# Load Environment Variables
source /etc/environment

# https://docs.opencv.org/master/d7/d9f/tutorial_linux_install.html
# https://docs.opencv.org/master/db/d05/tutorial_config_reference.html
echo "----- INSTALLING OpenCV -----"
pip3 install numpy # Required for bindings
cd ${OPENCV_BUILD_DIRECTORY}
mkdir build && cd build
cmake -D CMAKE_BUILD_TYPE=RELEASE \
-D CMAKE_INSTALL_PREFIX=${INSTALL_DIRECTORY} \
-D OPENCV_GENERATE_PKGCONFIG=ON \
-D OPENCV_ENABLE_NONFREE=OFF \
-D OPENCV_EXTRA_MODULES_PATH=${OPENCV_CONTRIB_BUILD_DIRECTORY}/modules \
-D BUILD_EXAMPLES=OFF \
-D PYTHON3_EXECUTABLE=${INSTALL_DIRECTORY}/bin/python3.8 \
-D PYTHON3_INCLUDE_DIR=${INSTALL_DIRECTORY}/include/python3.8/ \
-D PYTHON3_LIBRARY=${INSTALL_DIRECTORY}/lib/libpython3.8.a \
-D PYTHON3_PACKAGES_PATH=${INSTALL_DIRECTORY}/lib/python3.8/site-packages/ \
-D BUILD_opencv_python3=ON ..
make -s -j4 && make -s install