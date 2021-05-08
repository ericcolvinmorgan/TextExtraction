rm layer.zip
rm -rf ./layer
mkdir -p ./layer/share/tessdata
git clone https://github.com/tesseract-ocr/tessconfigs.git ./layer/share/tessdata/
curl -L https://github.com/tesseract-ocr/tessdata_best/raw/master/eng.traineddata > ./layer/share/tessdata/eng.traineddata
cd ./layer
zip -rq ../layer.zip .
