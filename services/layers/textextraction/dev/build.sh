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

# Install Common Dependencies
export AUTOCONF_ARCHIVE_BUILD_DIRECTORY=${BUILD_DIRECTORY}/autoconf_archive
export FREETYPE_BUILD_DIRECTORY=${BUILD_DIRECTORY}/freetype
export GPERF_BUILD_DIRECTORY=${BUILD_DIRECTORY}/gperf
export PIXMAN_BUILD_DIRECTORY=${BUILD_DIRECTORY}/pixman
export FONTCONFIG_BUILD_DIRECTORY=${BUILD_DIRECTORY}/fontconfig
export NASM_BUILD_DIRECTORY=${BUILD_DIRECTORY}/nasm
export LIBJPEG_BUILD_DIRECTORY=${BUILD_DIRECTORY}/libjpeg
export LCMS_BUILD_DIRECTORY=${BUILD_DIRECTORY}/lcms
export LIBPNG_BUILD_DIRECTORY=${BUILD_DIRECTORY}/libpng
export NSS_BUILD_DIRECTORY=${BUILD_DIRECTORY}/nss
export OPENJPEG_BUILD_DIRECTORY=${BUILD_DIRECTORY}/openjpeg
export LIBTIFF_BUILD_DIRECTORY=${BUILD_DIRECTORY}/libtiff
export GDK_PIXBUF_BUILD_DIRECTORY=${BUILD_DIRECTORY}/pixbuf
export CAIRO_BUILD_DIRECTORY=${BUILD_DIRECTORY}/cairo
export LIBXML2_BUILD_DIRECTORY=${BUILD_DIRECTORY}/libxml2
export POPPLER_DATA_BUILD_DIRECTORY=${BUILD_DIRECTORY}/poppler
export POPPLER_BUILD_DIRECTORY=${BUILD_DIRECTORY}/poppler
export LEPTONICA_BUILD_DIRECTORY=${BUILD_DIRECTORY}/leptonica
export TESSERACT_BUILD_DIRECTORY=${BUILD_DIRECTORY}/tesseract
export OPENCV_CONTRIB_BUILD_DIRECTORY=${BUILD_DIRECTORY}/opencv_contrib
export OPENCV_BUILD_DIRECTORY=${BUILD_DIRECTORY}/opencv
 
cd ${AUTOCONF_ARCHIVE_BUILD_DIRECTORY}
./configure --prefix=${INSTALL_DIRECTORY}
make && make install

# https://www.linuxfromscratch.org/blfs/view/svn/general/freetype2.html
# FontConfig Dep
cd ${FREETYPE_BUILD_DIRECTORY}
sed -ri "s:.*(AUX_MODULES.*valid):\1:" modules.cfg
sed -r "s:.*(#.*SUBPIXEL_RENDERING) .*:\1:" -i include/freetype/config/ftoption.h
./configure --prefix=${INSTALL_DIRECTORY} --with-sysroot=${INSTALL_DIRECTORY} --disable-static
make && make install

# GPERF
cd ${GPERF_BUILD_DIRECTORY}
./configure --prefix=${INSTALL_DIRECTORY}
make && make install

# https://linuxfromscratch.org/blfs/view/svn/general/libxml2.html
cd ${LIBXML2_BUILD_DIRECTORY}
patch -p1 -i ./libxml2-2.9.10-security_fixes-1.patch
sed -i '/if Py/{s/Py/(Py/;s/)/))/}' python/{types.c,libxml.c}
sed -i 's/test.test/#&/' python/tests/tstLastError.py
./configure --prefix=${INSTALL_DIRECTORY}    \
            --disable-static \
            --with-history   \
            --with-python=/usr/bin/python3
make && make install

# https://cgit.freedesktop.org/pixman/tree/INSTALL
cd ${PIXMAN_BUILD_DIRECTORY}
./configure --prefix=${INSTALL_DIRECTORY} --disable-static
make && make install

# # https://www.linuxfromscratch.org/blfs/view/svn/general/fontconfig.html
cd ${FONTCONFIG_BUILD_DIRECTORY}
export FONTCONFIG_PATH=${INSTALL_DIRECTORY}
./configure \
    --sysconfdir=${INSTALL_DIRECTORY}/etc \
    --localstatedir=${INSTALL_DIRECTORY}/var \
    --prefix=${INSTALL_DIRECTORY} \
    --disable-docs \
    --enable-libxml2
make && make install

# https://www.linuxfromscratch.org/blfs/view/svn/general/nasm.html
# libjpeg Dep
cd ${NASM_BUILD_DIRECTORY}
./configure --prefix=${INSTALL_DIRECTORY}
make && make install

cd ${LIBJPEG_BUILD_DIRECTORY}
mkdir build
cd build
cmake -DCMAKE_INSTALL_PREFIX=${INSTALL_DIRECTORY} \
    -DCMAKE_PREFIX_PATH=${INSTALL_DIRECTORY} \
    -DCMAKE_INSTALL_DEFAULT_LIBDIR=${INSTALL_DIRECTORY}/lib  \
    -DCMAKE_BUILD_TYPE=RELEASE  \
    -DENABLE_STATIC=FALSE       \
    ..
make && make install

# https://www.linuxfromscratch.org/blfs/view/svn/general/lcms2.html
cd ${LCMS_BUILD_DIRECTORY}
./configure --prefix=${INSTALL_DIRECTORY} --disable-static
make && make install

# https://www.linuxfromscratch.org/blfs/view/svn/general/libpng.html
cd ${LIBPNG_BUILD_DIRECTORY}
./configure --prefix=${INSTALL_DIRECTORY} --disable-static
make && make install

# https://www.linuxfromscratch.org/blfs/view/svn/general/openjpeg2.html
cd ${OPENJPEG_BUILD_DIRECTORY}
mkdir build
cd build
cmake -DCMAKE_BUILD_TYPE=Release \
    -DCMAKE_INSTALL_PREFIX=${INSTALL_DIRECTORY} \
    -DBUILD_STATIC_LIBS=OFF ..
make && make install

# https://www.linuxfromscratch.org/blfs/view/svn/general/libtiff.html
cd ${LIBTIFF_BUILD_DIRECTORY}
mkdir libtiff-build
cd libtiff-build
cmake -DCMAKE_BUILD_TYPE=Release \
    -DCMAKE_INSTALL_PREFIX=${INSTALL_DIRECTORY} \
    ..
make && make install

# https://www.linuxfromscratch.org/blfs/view/svn/x/cairo.html
cd ${CAIRO_BUILD_DIRECTORY}
./configure --prefix=${INSTALL_DIRECTORY} --disable-static --enable-tee
make && make install

# Install Python Dependencies
printf "\n----- INSTALLING PYTHON DEPENDENCIES -----"
pip3 install virtualenv --no-input

#Clean-Up Dependencies
rm -rf ${BUILD_DIRECTORY}/*