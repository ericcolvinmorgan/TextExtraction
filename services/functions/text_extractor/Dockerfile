FROM amazon/aws-lambda-python:3.8

#Move Layer Files
WORKDIR /tmp
RUN yum install -y unzip

# RUN yum install gcc openssl-devel bzip2-devel libffi-devel wget tar gzip make -y

COPY requirements.txt /tmp
RUN pip3.8 install --upgrade pip
RUN pip3.8 install -r /tmp/requirements.txt -t /opt/python/lib/python3.8/site-packages

# COPY tesslayer.zip /tmp
# RUN unzip tesslayer.zip
# RUN mv /tmp/bin /opt/
# RUN mv /tmp/lib /opt/

COPY /opencvlayer /tmp
RUN ls /tmp
# RUN unzip opencvlayer.zip
RUN mv /tmp/bin /opt/
RUN mv /tmp/lib /opt/
RUN cp -r /tmp/python /opt/

#Load Tessdata
RUN mkdir /opt/tessdata
RUN curl -L https://github.com/tesseract-ocr/tessdata/raw/master/eng.traineddata > /opt/tessdata/eng.traineddata

# RUN rm -rf /tmp/python/lib/python3.8/site-packages/pip
# RUN rm -rf /tmp/python/lib/python3.8/site-packages/pkg_resources
# RUN rm -rf /tmp/python/lib/python3.8/site-packages/__pycache__
# RUN rm -rf /tmp/python/lib/python3.8/site-packages/setuptools
# RUN mv /tmp/python/lib/python3.8/site-packages/* /var/lang/lib/python3.8/site-packages/
# RUN pip3 install opencv-python

#Move Project Files
COPY app.py __init__.py /var/task/

# Set the CMD to your handler (could also be done as a parameter override outside of the Dockerfile)
WORKDIR /var/task
CMD [ "app.lambda_handler" ]  
