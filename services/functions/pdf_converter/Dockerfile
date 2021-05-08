FROM textextraction-poppler:latest

ENV PACKAGE_DIRECTORY=/opt/package
COPY . /var/task/
RUN cp /opt/lib64/libpoppler-cpp.so.0 /var/task/
RUN cp -r ${PACKAGE_DIRECTORY}/* /var/task/

# Set the CMD to your handler (could also be done as a parameter override outside of the Dockerfile)
CMD [ "app.lambda_handler" ]  
