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
export POPPLER_DATA_BUILD_DIRECTORY=${BUILD_DIRECTORY}/poppler_data
export POPPLER_BUILD_DIRECTORY=${BUILD_DIRECTORY}/poppler

# https://cbrunet.net/python-poppler/installation.html#installation
echo "----- INSTALLING POPPLER -----"
cd ${POPPLER_BUILD_DIRECTORY}
mkdir build
cd    build
cmake  -DCMAKE_BUILD_TYPE=Release   \
    -DCMAKE_INSTALL_PREFIX=${INSTALL_DIRECTORY} \
    -DENABLE_UNSTABLE_API_ABI_HEADERS=ON \
    -DBUILD_GTK_TESTS=OFF \
    -DBUILD_QT5_TESTS=OFF \
    -DBUILD_CPP_TESTS=OFF \
    -DENABLE_CPP=ON \
    -DENABLE_GLIB=OFF \
    -DENABLE_GOBJECT_INTROSPECTION=OFF \
    -DENABLE_GTK_DOC=OFF \
    -DENABLE_QT5=OFF \
    -DBUILD_SHARED_LIBS=ON \
    ..
make && make install

# https://www.linuxfromscratch.org/blfs/view/svn/general/poppler.html
echo "----- INSTALLING POPPLER DATA -----"
cd ${POPPLER_DATA_BUILD_DIRECTORY}
make prefix=${INSTALL_DIRECTORY} install

# Install Python Dependencies
echo "----- CREATING PYTHON ENV -----"
virtualenv ${INSTALL_DIRECTORY}/python/
source ${INSTALL_DIRECTORY}/python/bin/activate
pip3 install pillow
pip3 install python-poppler

#Clean-Up Dependencies
rm -rf ${BUILD_DIRECTORY}/*

#Create Package
export LD_LIBRARY_PATH=$LD_LIBRARY_PATH:/opt/lib
export LD_LIBRARY_PATH=$LD_LIBRARY_PATH:/opt/lib64

cd ${INSTALL_DIRECTORY}
mkdir package
mkdir package/lib
mkdir package/bin
ldd /opt/bin/pdftotext | grep "=> /" | awk '{print $3}' | xargs -I '{}' cp -v '{}' package/lib
ldd /opt/bin/pdftoppm | grep "=> /" | awk '{print $3}' | xargs -I '{}' cp -v '{}' package/lib
cp /opt/lib64/libpoppler-cpp* package/lib
cp /opt/bin/pdftotext package/bin
cp /opt/bin/pdftoppm package/bin