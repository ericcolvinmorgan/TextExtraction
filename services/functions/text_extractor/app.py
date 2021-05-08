import boto3
import botocore
import json
import logging
import os
import pytesseract
import cv2
from io import BytesIO
from PIL import Image

logger = logging.getLogger()

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
        array: An array containing a list of text output locations.
    """

    from text_extraction_lib.document import Document, DocumentType, DocumentEncoder
    from text_extraction_lib.pagetextitem import PageTextItem, PageTextItemHierarchy
    from text_extraction_lib.page import Page

    logger.setLevel(logging.getLevelName(os.getenv('LOG_LEVEL')))
    logger.info(cv2.__version__)
    logger.info(pytesseract.get_tesseract_version())
    logger.info(event)

    output_bucket = os.getenv('PROCESSED_BUCKET')
    # Needs to be updated to match DB
    document_id = event['detail']['requestParameters']['key']

    #OUTPUTs:
    text = []

    s3 = boto3.client('s3')
    resource_bucket = ''
    images = []
    # images = ['../test_documents/output-3.tif']

    if(event['file_type'] == 'Image'):
        resource_bucket = os.getenv('DOCUMENT_BUCKET')
        images.append(document_id)
    elif(event['file_type'] == 'PDF'):
        resource_bucket = os.getenv('PROCESSED_BUCKET')
        images.extend(event['image_output'])
    else:
        raise 'Event file type is invalid'

    processed_document = Document(DocumentType.IMAGE)
    page_num = 1
    for image_path in images:
        
        logger.info(f'Processing Page {page_num}')
        file_blob = BytesIO(s3.get_object(Bucket=resource_bucket, Key=image_path)['Body'].read())
        image = Image.open(file_blob)
        # image = Image.open(image_path)

        processed_page = Page(page_num, image.height, image.width, image.info['dpi'][0], image.info['dpi'][1], pytesseract.image_to_string(image))
        processed_document.add_page(processed_page)

        data_output = pytesseract.image_to_data(image, output_type=pytesseract.Output().DICT)
        logger.info(f'Creating Page Entry')
        for index, entry in enumerate(data_output['text']):
            
            text_item_hierarchy = PageTextItem.tesseract_to_pagetext_hierarchy(data_output['level'][index])
            if(text_item_hierarchy != PageTextItemHierarchy.PAGE):
                page_text_item = PageTextItem(data_output['left'][index], 
                    data_output['top'][index], 
                    data_output['height'][index],
                    data_output['width'][index],
                    entry,
                    text_item_hierarchy,
                    data_output['conf'][index])
                
                processed_page.add_text_entry(page_text_item)

        logger.info(f'Page {page_num} Complete!')
        page_num += 1

    text_name = f'{document_id}/Text/output.json'
    text_output = s3.put_object(Bucket=output_bucket, Key=text_name, Body=json.dumps(processed_document.to_json(), cls=DocumentEncoder).encode('UTF-8'))
    text.append(text_name)

    event['text_output'] = text
    return event


if __name__ == "__main__":
    import sys
    sys.path.append('../../libs/python/') 

    from dotenv import load_dotenv, dotenv_values
    load_dotenv('./.env.dev')
    print(os.getenv('DOCUMENT_BUCKET'))
    print(os.getenv('PROCESSED_BUCKET'))


    #TEST EVENTS
    # event = {"id": "3bc0846e-fdf0-5265-e25f-4f0a91aff7fd", "detail": {"requestParameters": {"bucketName": "text-extraction-maindocumentbucket-a8qgfmjqltvw", "key": "f5471-5.tif"}}}
    # event = {"id": "3bc0846e-fdf0-5265-e25f-4f0a91aff7fd", "detail": {"requestParameters": {"bucketName": "text-extraction-maindocumentbucket-a8qgfmjqltvw", "key": "Form 5471_printed.pdf"}}}
    event = {"id": "3bc0846e-fdf0-5265-e25f-4f0a91aff7fd", "detail": {"requestParameters": {"bucketName": os.getenv('DOCUMENT_BUCKET'), "key": "Form 5471_test_data.pdf"}}}
    # event = {"id": "3bc0846e-fdf0-5265-e25f-4f0a91aff7fd", "detail": {"requestParameters": {"bucketName": "text-extraction-maindocumentbucket-a8qgfmjqltvw", "key": "f5471output.box"}}}
    output = lambda_handler(event, [])
    print(output)
