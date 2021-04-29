# AWS Lambda Text Extraction Layers
## Description
The scripts in this directory help download and compile the needed dependencies for the text extraction services.  Projects are compiled in the amazon/aws-lambda-python:3.8 image. 

## Instructions
To use, from the services/layers/textextraction path first download all current targeted dependencies utilized by the subsequent image builds by running the `./fetchDependencies.sh` script.  You can change versions as desired in this script.  The commands given will also redirect all relevant STDOUT and STDERR to an output.txt file for future reference.

#### Base Image
Next, we will build a base image that contains a number of base build tool dependencies for subsequent builds.
    cd ./base
    docker build . -t textextraction-base --progress=plain 2>&1 | tee output.txt

#### Development Dependencies Image
We will then build a dev image that contains a number of dev dependencies used by the indiviudal builds.
    cd ../dev
    docker build . -t textextraction-dev --progress=plain 2>&1 | tee output.txt

#### OpenCV, Tesseract, Poppler
Finally, we will build our individual components.  For each component, we'll build our container, compile the applicable software, and extract our needed files into a layer.zip file.

**Poppler**
Command:
    cd ../poppler
    docker build . -t textextraction-poppler:latest --progress=plain 2>&1 | tee output.txt
    ./extractLayer.sh

**Tesseract**
Command:
    cd ../tesseract
    docker build . -t textextraction-tesseract:latest --progress=plain 2>&1 | tee output.txt
    ./extractLayer.sh

Depending on how you're copying file you may find you're receiving the following error when you try to run commands against pytesseract:

> TesseractNotFoundError()

Assuming everything is in the correct path if you try to run the program directly you'll likely see a message saying `/opt/bin/tesseract: Permission denied`.  Simply `chmod +x /opt/bin/tesseract` to address this issue and pytesseract should work again.  Other potential issues you'll see with pytesseract is an error message thrown when you do not have your language files imported correctly.  You'll need to download those and configure following the instructions [here](https://tesseract-ocr.github.io/tessdoc/Command-Line-Usage.html).

**OpenCV/Tesseract**
If you look at the Dockerfile for this layer, you'll notice I'm pulling from the previous Tesseract image.  I've included these together for my convenience, so adjust to pull from the dev image if you prefer just to build OpenCV.  This folder also contains a file called `aws-cv2-config-3.8.py` file.  You'll need to update the path in this file for cv2 to be imported correctly otherwise you'll likely receive the following error:

> 'ERROR: recursion is detected during loading of "cv2" binary extensions. Check OpenCV installation.'

Command:
    cd ../opencv
    docker build . -t textextraction-opencv:latest --progress=plain 2>&1 | tee output.txt
    ./extractLayer.sh

#### Testing
There are a number of functions in this project that consume these layers.  I've created Dockerfiles that create containers against the `amazon/aws-lambda-*` images and copy the applicable layer and latest code into the container for testing directly against a similar environment to which I am deploying.  Testing can then be accomplished as follows:

Command:
    docker build . -t [NEW IMAGE NAME]:latest
    docker run -p 9000:8080 [NEW IMAGE NAME]:latest
    curl -XPOST "http://localhost:9000/2015-03-31/functions/function/invocations" -d '{}'

You can also spin up and run these environments directly to bash using the following:
    docker run -it --entrypoint /bin/bash [IMAGE NAME]:latest

 #### Helpful Links
[AWS - How To Create a Lambda Layer Using a Simulated Environment](https://aws.amazon.com/premiumsupport/knowledge-center/lambda-layer-simulated-docker/)
[AWS - Testing Lambda Container Images Locally](https://docs.aws.amazon.com/lambda/latest/dg/images-test.html)
[Tesseract Documentation](https://tesseract-ocr.github.io/tessdoc/)
