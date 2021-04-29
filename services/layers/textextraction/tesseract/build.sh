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
export LEPTONICA_BUILD_DIRECTORY=${BUILD_DIRECTORY}/leptonica
export TESSERACT_BUILD_DIRECTORY=${BUILD_DIRECTORY}/tesseract
export OPENCV_CONTRIB_BUILD_DIRECTORY=${BUILD_DIRECTORY}/opencv_contrib
export OPENCV_BUILD_DIRECTORY=${BUILD_DIRECTORY}/opencv
export PYTHON3_BUILD_DIRECTORY=${BUILD_DIRECTORY}/python3

# Load Environment Variables
source /etc/environment

# http://www.leptonica.org/source/README.html
echo "----- INSTALLING LEPTONICA -----"
cd ${LEPTONICA_BUILD_DIRECTORY}
./configure --prefix=${INSTALL_DIRECTORY}
make -s -j4 && make -s install

# https://tesseract-ocr.github.io/tessdoc/Compiling
echo "----- INSTALLING TESSERACT -----"
cd ${TESSERACT_BUILD_DIRECTORY}
./autogen.sh
LIBLEPT_HEADERSDIR=${INSTALL_DIRECTORY}/include ./configure --prefix=${INSTALL_DIRECTORY} --with-extra-libraries=${INSTALL_DIRECTORY}/lib
make -s -j4 && make -s install

echo "----- INSTALLING PYTHON38 -----"
cd ${PYTHON3_BUILD_DIRECTORY}
./configure --prefix=${INSTALL_DIRECTORY} --enable-optimizations
make -s -j4 && make -s install
${INSTALL_DIRECTORY}/bin/python3 -m pip install numpy

#Clean-Up Dependencies
# rm -rf ${BUILD_DIRECTORY}/*