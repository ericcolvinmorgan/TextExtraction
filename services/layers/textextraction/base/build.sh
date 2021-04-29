#!/bin/bash
set -e;

# BUILD_DIRECTORY set in Dockerfile.
INSTALL_DIRECTORY=/opt
echo "BUILD_DIRECTORY='${BUILD_DIRECTORY}'" >> /etc/environment
echo "INSTALL_DIRECTORY='${INSTALL_DIRECTORY}'" >> /etc/environment

printf "\n----- START BUILD -----"
printf "\nBUILD DIRECTORY=${BUILD_DIRECTORY}"
printf "\nINSTALL DIRECTORY=${INSTALL_DIRECTORY}"

printf "\n----- CREATING INSTALL DIRECTORY -----"
mkdir -p \
    ${INSTALL_DIRECTORY}/bin \
    ${INSTALL_DIRECTORY}/include \
    ${INSTALL_DIRECTORY}/lib \
    ${INSTALL_DIRECTORY}/lib64 \
    ${INSTALL_DIRECTORY}/share

# Install Dev Dependencies
cd /tmp
printf "\n----- INSTALLING DEV DEPENDENCIES -----"
yum -y update
yum -y upgrade
yum -y groupinstall "Development Tools"
yum -y install libuuid-devel openssl-devel gcc72 gcc72-c++ python3-devel \
    make autoconf aclocal automake libtool 

# Install CMake
printf "\n----- INSTALLING CMAKE -----"
mkdir -p ${BUILD_DIRECTORY}/cmake \
    && cd ${BUILD_DIRECTORY}/cmake \
    && curl -Ls https://github.com/Kitware/CMake/releases/download/v3.20.1/cmake-3.20.1.tar.gz \
    | tar xzC ${BUILD_DIRECTORY}/cmake --strip-components=1 \
    && ./bootstrap --prefix=/usr/local \
    && make \
    && make install

# Configure Default Compiler Variables
PKG_CONFIG_PATH="${INSTALL_DIRECTORY}/lib64/pkgconfig:${INSTALL_DIRECTORY}/lib/pkgconfig"
PKG_CONFIG="/usr/bin/pkg-config"
PATH="${INSTALL_DIRECTORY}/bin:${PATH}"
LD_LIBRARY_PATH="${INSTALL_DIRECTORY}/lib64:${INSTALL_DIRECTORY}/lib"
CFLAGS=""
CPPFLAGS="-I${INSTALL_DIRECTORY}/include  -I/usr/include"
LDFLAGS="-L${INSTALL_DIRECTORY}/lib64 -L${INSTALL_DIRECTORY}/lib"

echo "PKG_CONFIG_PATH='${PKG_CONFIG_PATH}'" >> /etc/environment
echo "PKG_CONFIG='${PKG_CONFIG}'" >> /etc/environment
echo "PATH='${PATH}'" >> /etc/environment
echo "LD_LIBRARY_PATH='${LD_LIBRARY_PATH}'" >> /etc/environment
echo "CFLAGS='${CFLAGS}'" >> /etc/environment
echo "CPPFLAGS='${CPPFLAGS}'" >> /etc/environment
echo "LDFLAGS='${LDFLAGS}'" >> /etc/environment

printf "\n----- DEFAULT ENVIRONMENT VARIABLES -----"
echo "PKG_CONFIG_PATH=${PKG_CONFIG_PATH}"
echo "PKG_CONFIG=${PKG_CONFIG}"
echo "PATH=${PATH}"
echo "LD_LIBRARY_PATH=${LD_LIBRARY_PATH}"
echo "CFLAGS=${CFLAGS}"
echo "CPPFLAGS=${CPPFLAGS}"
echo "LDFLAGS=${LDFLAGS}"

#Clean-Up Dependencies
rm -rf ${BUILD_DIRECTORY}/*