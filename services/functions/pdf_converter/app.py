import boto3
import botocore
import json
import logging
import os
import poppler
from io import BytesIO
from PIL import Image

logger = logging.getLogger()
logger.setLevel(logging.getLevelName(os.getenv('LOG_LEVEL')))

if __name__ == "__main__":
    import sys
    sys.path.append('../../libs/python/') 

    from dotenv import load_dotenv, dotenv_values
    load_dotenv('./.env.dev')
    print(os.getenv('DOCUMENT_BUCKET'))
    print(os.getenv('PROCESSED_BUCKET'))

from text_extraction_lib.document import Document, DocumentType, DocumentEncoder
from text_extraction_lib.pagetextitem import PageTextItem, PageTextItemHierarchy
from text_extraction_lib.page import Page
    
s3 = boto3.client('s3')

def lambda_handler(event, context):
    """ Lambda function which converts PDFs to images.

    Parameters
    ----------
    event: dict, required
        Input event to the Lambda function

    context: object, required
        Lambda Context runtime methods and attributes

    Returns
    ------
        event: Document event updated with relevant image locations.
    """

    logger.info(event) 
    logger.info(poppler.version())

    output_bucket = os.getenv('PROCESSED_BUCKET')
    # Needs to be updated to match DB
    document_id = event['id']

    #OUTPUTs:
    text = []

    fileBlob = BytesIO(s3.get_object(Bucket=event['detail']['requestParameters']['bucketName'], Key=event['detail']['requestParameters']['key'])['Body'].read())
    pdf = poppler.load_from_data(fileBlob.read())

    has_text, processed_document = extract_text(pdf)

    if(has_text):
        event['text_source'] = 'PDF'
        image_extension = "jpeg"
        text_name = f'{document_id}/Text/output.json'
        s3.put_object(Bucket=output_bucket, Key=text_name, Body=json.dumps(processed_document.to_json(), cls=DocumentEncoder).encode('UTF-8'))
        text.append(text_name)
    else:
        event['text_source'] = 'OCR'
        image_extension = "tiff"

    images = extract_images(document_id, pdf, image_extension)

    event['image_output'] = images
    event['text_output'] = text

    return event

def extract_text(pdf):
    has_text = False
    processed_document = Document(DocumentType.PDF)
    for page_index in range(0, pdf.pages):
        page = pdf.create_page(page_index)
        page_num = page_index + 1
        page_rect = page.page_rect()
        page_text = page.text()
        
        # Poppler produces the text dimensions in points.  In typography there are 72 points in an inch, thus the hardcoded 72 for DPI., 
        # https://en.wikipedia.org/wiki/Point_(typography)
        # We will need to manually handle converting/matching the text coordinates to image resolution.        
        processed_page = Page(page_num, page_rect.height, page_rect.width, 72, 72, page_text)
        processed_document.add_page(processed_page)
        if(len(page_text) > 5):
            has_text = True
            text_list = page.text_list()
            for text_entry in text_list:
                page_text_item = PageTextItem(text_entry.bbox.x, 
                    text_entry.bbox.y, 
                    text_entry.bbox.height,
                    text_entry.bbox.width,
                    text_entry.text,
                    PageTextItemHierarchy.WORD)
                processed_page.add_text_entry(page_text_item)
                for char_index, char in enumerate(text_entry.text):
                    char_box = text_entry.char_bbox(char_index)
                    page_text_char = PageTextItem(char_box.x, 
                        char_box.y, 
                        char_box.height,
                        char_box.width,
                        char,
                        PageTextItemHierarchy.CHARACTER)
                    page_text_item.add_child(page_text_char)
    return has_text, processed_document

def extract_images(document_id, pdf, image_extension):
    # Save image for further processing if no text read, or for reference if text extracted.
    images = []

    for page_num in range(1, pdf.pages + 1):
        page = pdf.create_page(page_num - 1)
        
        #Extract Page Image
        page_renderer = poppler.pagerenderer.PageRenderer()
        
        # https://tesseract-ocr.github.io/tessdoc/ImproveQuality.html#:~:text=Tesseract%20works%20best%20on%20images,more%20information%20see%20the%20FAQ., 
        # Tesseract works best on images which have a DPI of at least 300 dpi.
        page_image = page_renderer.render_page(page, 300., 300.)

        raw_image = Image.frombytes("RGBA", (page_image.width, page_image.height),
            page_image.data,
            "raw",
            str(page_image.format)
        )

        image_stream = BytesIO()
        if(image_extension == "jpeg"):
            rgb_image = raw_image.convert('RGB')
            rgb_image.save(image_stream, format=image_extension, resolution=300, software='Text Extractor')
            image_name = f'{document_id}/Viewer/page-{page_num}.{image_extension}'
        else:
            raw_image.save(image_stream, format=image_extension, resolution=300, software='Text Extractor')
            image_name = f'{document_id}/Raw/page-{page_num}.{image_extension}'
        
        image_stream.seek(0)        
        output_bucket = os.getenv('PROCESSED_BUCKET')
        s3.put_object(Bucket=output_bucket, Key=image_name, Body=image_stream)
        
        images.append(image_name)

    return images

if __name__ == "__main__":

    #TEST EVENTS
    # event = {"id": "3bc0846e-fdf0-5265-e25f-4f0a91aff7fd", "detail": {"requestParameters": {"bucketName": "text-extraction-maindocumentbucket-a8qgfmjqltvw", "key": "f5471-5.tif"}}}
    # event = {"id": "3bc0846e-fdf0-5265-e25f-4f0a91aff7fd", "detail": {"requestParameters": {"bucketName": "text-extraction-maindocumentbucket-a8qgfmjqltvw", "key": "Form 5471_printed.pdf"}}}
    event = {"id": "3bc0846e-fdf0-5265-e25f-4f0a91aff7fd", "detail": {"requestParameters": {"bucketName": os.getenv('DOCUMENT_BUCKET'), "key": "Form 5471_test_data.pdf"}}}
    # event = {"id": "3bc0846e-fdf0-5265-e25f-4f0a91aff7fd", "detail": {"requestParameters": {"bucketName": "text-extraction-maindocumentbucket-a8qgfmjqltvw", "key": "f5471output.box"}}}
    output = lambda_handler(event, [])
    print(output)