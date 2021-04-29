#!/bin/bash
DEV_DEPENDENCY_DIRECTORY=${PWD}/dev/dependencies
POPPLER_DEPENDENCY_DIRECTORY=${PWD}/poppler/dependencies
TESSERACT_DEPENDENCY_DIRECTORY=${PWD}/tesseract/dependencies
OPENCV_DEPENDENCY_DIRECTORY=${PWD}/opencv/dependencies

rm -rf ${DEV_DEPENDENCY_DIRECTORY}
rm -rf ${POPPLER_DEPENDENCY_DIRECTORY}
rm -rf ${TESSERACT_DEPENDENCY_DIRECTORY}
rm -rf ${OPENCV_DEPENDENCY_DIRECTORY}

AUTOCONF_ARCHIVE_VERSION=2017.09.28
FREETYPE_VERSION=2.10.1
GPERF_VERSION=3.1
PIXMAN_VERSION=0.40.0
FONTCONFIG_VERSION=2.13.1
NASM_VERSION=2.15.05
LIBJPEG_VERSION=2.0.6
LCMS_VERSION=2.12
LIBPNG_VERSION=1.6.37
NSS_VERSION=3.63
OPENJPEG_VERSION=2.4.0
LIBTIFF_VERSION=4.2.0
GDK_PIXBUF_VERSION=2.42.4
CAIRO_VERSION=1.17.4
LIBXML2_VERSION=2.9.10
POPPLER_DATA_VERSION=0.4.10
POPPLER_VERSION=21.04.0
LEPTONICA_VERSION=1.80.0
TESSERACT_VERSION=4.1.1
OPENCV_CONTRIB_VERSION=4.5.2
OPENCV_VERSION=4.5.2
PYTHON3_VERSION=3.8.9

AUTOCONF_ARCHIVE_BUILD_DIRECTORY=${DEV_DEPENDENCY_DIRECTORY}/autoconf_archive
FREETYPE_BUILD_DIRECTORY=${DEV_DEPENDENCY_DIRECTORY}/freetype
GPERF_BUILD_DIRECTORY=${DEV_DEPENDENCY_DIRECTORY}/gperf
PIXMAN_BUILD_DIRECTORY=${DEV_DEPENDENCY_DIRECTORY}/pixman
FONTCONFIG_BUILD_DIRECTORY=${DEV_DEPENDENCY_DIRECTORY}/fontconfig
NASM_BUILD_DIRECTORY=${DEV_DEPENDENCY_DIRECTORY}/nasm
LIBJPEG_BUILD_DIRECTORY=${DEV_DEPENDENCY_DIRECTORY}/libjpeg
LCMS_BUILD_DIRECTORY=${DEV_DEPENDENCY_DIRECTORY}/lcms
LIBPNG_BUILD_DIRECTORY=${DEV_DEPENDENCY_DIRECTORY}/libpng
NSS_BUILD_DIRECTORY=${DEV_DEPENDENCY_DIRECTORY}/nss
OPENJPEG_BUILD_DIRECTORY=${DEV_DEPENDENCY_DIRECTORY}/openjpeg
LIBTIFF_BUILD_DIRECTORY=${DEV_DEPENDENCY_DIRECTORY}/libtiff
GDK_PIXBUF_BUILD_DIRECTORY=${DEV_DEPENDENCY_DIRECTORY}/pixbuf
CAIRO_BUILD_DIRECTORY=${DEV_DEPENDENCY_DIRECTORY}/cairo
LIBXML2_BUILD_DIRECTORY=${DEV_DEPENDENCY_DIRECTORY}/libxml2
POPPLER_DATA_BUILD_DIRECTORY=${POPPLER_DEPENDENCY_DIRECTORY}/poppler_data
POPPLER_BUILD_DIRECTORY=${POPPLER_DEPENDENCY_DIRECTORY}/poppler
LEPTONICA_BUILD_DIRECTORY=${TESSERACT_DEPENDENCY_DIRECTORY}/leptonica
TESSERACT_BUILD_DIRECTORY=${TESSERACT_DEPENDENCY_DIRECTORY}/tesseract
OPENCV_CONTRIB_BUILD_DIRECTORY=${OPENCV_DEPENDENCY_DIRECTORY}/opencv_contrib
OPENCV_BUILD_DIRECTORY=${OPENCV_DEPENDENCY_DIRECTORY}/opencv
PYTHON3_BUILD_DIRECTORY=${TESSERACT_DEPENDENCY_DIRECTORY}/python3

mkdir -p \
    ${DEV_DEPENDENCY_DIRECTORY} \
    ${TESSERACT_DEPENDENCY_DIRECTORY} \
    ${POPPLER_DEPENDENCY_DIRECTORY} \
    ${AUTOCONF_ARCHIVE_BUILD_DIRECTORY} \
    ${FREETYPE_BUILD_DIRECTORY} \
    ${GPERF_BUILD_DIRECTORY} \
    ${PIXMAN_BUILD_DIRECTORY} \
    ${FONTCONFIG_BUILD_DIRECTORY} \
    ${NASM_BUILD_DIRECTORY} \
    ${LIBJPEG_BUILD_DIRECTORY} \
    ${LCMS_BUILD_DIRECTORY} \
    ${LIBPNG_BUILD_DIRECTORY} \
    ${NSS_BUILD_DIRECTORY} \
    ${OPENJPEG_BUILD_DIRECTORY} \
    ${LIBTIFF_BUILD_DIRECTORY} \
    ${GDK_PIXBUF_BUILD_DIRECTORY} \
    ${CAIRO_BUILD_DIRECTORY} \
    ${LIBXML2_BUILD_DIRECTORY} \
    ${POPPLER_DATA_BUILD_DIRECTORY} \
    ${POPPLER_BUILD_DIRECTORY} \
    ${LEPTONICA_BUILD_DIRECTORY} \
    ${TESSERACT_BUILD_DIRECTORY} \
    ${OPENCV_CONTRIB_BUILD_DIRECTORY} \
    ${OPENCV_BUILD_DIRECTORY} \
    ${PYTHON3_BUILD_DIRECTORY}

# Download Packages
curl https://ftp.gnu.org/gnu/autoconf-archive/autoconf-archive-${AUTOCONF_ARCHIVE_VERSION}.tar.xz | tar xJC ${AUTOCONF_ARCHIVE_BUILD_DIRECTORY} --strip-components=1
curl -L https://download-mirror.savannah.gnu.org/releases/freetype/freetype-${FREETYPE_VERSION}.tar.xz | tar xJC ${FREETYPE_BUILD_DIRECTORY} --strip-components=1
curl -L http://ftp.gnu.org/pub/gnu/gperf/gperf-${GPERF_VERSION}.tar.gz | tar xzC ${GPERF_BUILD_DIRECTORY} --strip-components=1
curl https://www.cairographics.org/releases/pixman-${PIXMAN_VERSION}.tar.gz | tar xzC ${PIXMAN_BUILD_DIRECTORY} --strip-components=1
curl https://www.freedesktop.org/software/fontconfig/release/fontconfig-${FONTCONFIG_VERSION}.tar.gz | tar xzC ${FONTCONFIG_BUILD_DIRECTORY} --strip-components=1
curl https://www.nasm.us/pub/nasm/releasebuilds/2.15.05/nasm-${NASM_VERSION}.tar.xz | tar xJC ${NASM_BUILD_DIRECTORY} --strip-components=1
curl -L https://downloads.sourceforge.net/libjpeg-turbo/libjpeg-turbo-${LIBJPEG_VERSION}.tar.gz | tar xzC ${LIBJPEG_BUILD_DIRECTORY} --strip-components=1
curl -L https://sourceforge.net/projects/lcms/files/lcms/${LCMS_VERSION}/lcms2-${LCMS_VERSION}.tar.gz | tar xzC ${LCMS_BUILD_DIRECTORY} --strip-components=1
curl -L https://downloads.sourceforge.net/libpng/libpng-${LIBPNG_VERSION}.tar.xz | tar xJC ${LIBPNG_BUILD_DIRECTORY} --strip-components=1
curl -L https://archive.mozilla.org/pub/security/nss/releases/NSS_3_63_RTM/src/nss-${NSS_VERSION}.tar.gz | tar xzC ${NSS_BUILD_DIRECTORY} --strip-components=1
curl -L https://github.com/uclouvain/openjpeg/archive/v2.4.0/openjpeg-${OPENJPEG_VERSION}.tar.gz | tar xzC ${OPENJPEG_BUILD_DIRECTORY} --strip-components=1
curl https://download.osgeo.org/libtiff/tiff-${LIBTIFF_VERSION}.tar.gz | tar xzC ${LIBTIFF_BUILD_DIRECTORY} --strip-components=1
curl ftp://ftp.acc.umu.se/pub/gnome/sources/gdk-pixbuf/2.42/gdk-pixbuf-${GDK_PIXBUF_VERSION}.tar.xz | tar xJC ${GDK_PIXBUF_BUILD_DIRECTORY} --strip-components=1
curl ftp://xmlsoft.org/libxml2/libxml2-${LIBXML2_VERSION}.tar.gz | tar xzC ${LIBXML2_BUILD_DIRECTORY} --strip-components=1
curl -L http://www.linuxfromscratch.org/patches/blfs/svn/libxml2-2.9.10-security_fixes-1.patch > ${LIBXML2_BUILD_DIRECTORY}/libxml2-2.9.10-security_fixes-1.patch
curl https://poppler.freedesktop.org/poppler-data-${POPPLER_DATA_VERSION}.tar.gz | tar xzC ${POPPLER_DATA_BUILD_DIRECTORY} --strip-components=1
curl https://poppler.freedesktop.org/poppler-${POPPLER_VERSION}.tar.xz | tar xJC ${POPPLER_BUILD_DIRECTORY} --strip-components=1
curl -L https://github.com/DanBloomberg/leptonica/releases/download/${LEPTONICA_VERSION}/leptonica-${LEPTONICA_VERSION}.tar.gz | tar xzC ${LEPTONICA_BUILD_DIRECTORY} --strip-components=1
curl -L https://github.com/tesseract-ocr/tesseract/archive/${TESSERACT_VERSION}.tar.gz | tar xzC ${TESSERACT_BUILD_DIRECTORY} --strip-components=1
curl -L https://github.com/opencv/opencv_contrib/archive/${OPENCV_CONTRIB_VERSION}.tar.gz | tar xzC ${OPENCV_CONTRIB_BUILD_DIRECTORY} --strip-components=1
curl -L https://github.com/opencv/opencv/archive/${OPENCV_VERSION}.tar.gz | tar xzC ${OPENCV_BUILD_DIRECTORY} --strip-components=1
curl https://www.python.org/ftp/python/${PYTHON3_VERSION}/Python-${PYTHON3_VERSION}.tar.xz | tar xJC ${PYTHON3_BUILD_DIRECTORY} --strip-components=1
# #Requires libpng and Pixman
curl https://www.cairographics.org/snapshots/cairo-${CAIRO_VERSION}.tar.xz | tar xJC ${CAIRO_BUILD_DIRECTORY} --strip-components=1