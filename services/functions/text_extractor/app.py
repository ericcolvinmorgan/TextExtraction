import boto3
import botocore
import csv
import cv2
import json
import logging
import os
import pytesseract
import queue
import shutil
import subprocess
import time

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
    images = []

    resource_bucket = ''

    if(event['file_type'] == 'Image'):
        resource_bucket = os.getenv('DOCUMENT_BUCKET')
        images.append(document_id)
    elif(event['file_type'] == 'PDF'):
        resource_bucket = os.getenv('PROCESSED_BUCKET')
        images.extend(event['image_output'])
    else:
        raise 'Event file type is invalid'

    start = time.time()
    total_images = len(images)
    num_processes = 1

    if(total_images > 1):
        os.environ['OMP_THREAD_LIMIT'] = '1'
        num_processes = os.environ['NUMBER_PROCESSES']
    
    logger.info(f'Starting Execution: {num_processes} max processes')

    processes = queue.deque(maxlen=num_processes)
    page_num = 1
    processed_document = Document(DocumentType.IMAGE)
    processing_path = '/tmp/extraction/'

    for image_index, image_key in enumerate(images):

        #Stage image for processing
        image_path = stage_file(resource_bucket, image_key, processing_path)

        processes.append([subprocess.Popen(["tesseract", image_path, image_path, "tsv", "txt"]), image_path, page_num])
        logger.info(f'Processing Page {page_num}')
        page_num += 1
        
        # Wait for current tasks to complete
        while (len(processes) == num_processes or image_index == (total_images - 1)) and len(processes) > 0:
            item: [subprocess.Popen, str, int] = processes.popleft()
            result = item[0].poll()
            if(result == None):
                processes.append(item)
            else:
                # Processing has completed, collect results
                image = Image.open(item[1])
                page_text = ''
                with open(f'{item[1]}.txt') as text_results:
                    page_text = ''.join(text_results.readlines())

                processed_page = Page(item[2], image.height, image.width, image.info['dpi'][0], image.info['dpi'][1], page_text)
                processed_document.add_page(processed_page)

                with open(f'{item[1]}.tsv') as tsv_results:
                    tsv_dict = csv.DictReader(tsv_results, delimiter='\t')
                    for row in (item for item in tsv_dict):
                        text_item_hierarchy = PageTextItem.tesseract_to_pagetext_hierarchy(int(row['level']))
                        if(text_item_hierarchy != PageTextItemHierarchy.PAGE):
                            page_text_item = PageTextItem(int(row['left']), 
                                int(row['top']), 
                                int(row['height']),
                                int(row['width']),
                                row['text'],
                                text_item_hierarchy,
                                int(row['conf']))
                            
                            processed_page.add_text_entry(page_text_item)

                # Clean Up Temp Files
                os.remove(item[1])
                os.remove(f'{item[1]}.tsv')
                os.remove(f'{item[1]}.txt')

                logger.info(f'Page {item[2]}, {item[1]} Complete!')

    end = time.time()
    logger.info(f'OCR Complete: {total_images} compelted in {end - start} seconds')

    text_name = f'{document_id}/Text/output.json'
    s3 = boto3.client('s3')
    text_output = s3.put_object(Bucket=output_bucket, Key=text_name, Body=json.dumps(processed_document.to_json(), cls=DocumentEncoder).encode('UTF-8'))
    text.append(text_name)

    event['text_output'] = text
    return event

def stage_file(bucket, key, path):
    
    os.makedirs(path, exist_ok=True)
    file_path = os.path.join(path, os.path.basename(key))

    if(os.environ['ENVIRONMENT'] == 'DEV'):
        shutil.copyfile(key, file_path)
    else:
        s3 = boto3.client('s3')
        s3.download_file(bucket, key, file_path)

    return file_path



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
    event = {"id": "3bc0846e-fdf0-5265-e25f-4f0a91aff7fd", 
        "file_type": "PDF", "image_output": [
        "../test_documents/output-1.tif",
        "../test_documents/output-2.tif",
        "../test_documents/output-3.tif",
        "../test_documents/output-4.tif",
        "../test_documents/output-5.tif",
        "../test_documents/output-6.tif"
        ],
        "detail": {"requestParameters": {"bucketName": os.getenv('DOCUMENT_BUCKET'), "key": "Form 5471_test_data.pdf"}}}
    # event = {"id": "3bc0846e-fdf0-5265-e25f-4f0a91aff7fd", "detail": {"requestParameters": {"bucketName": "text-extraction-maindocumentbucket-a8qgfmjqltvw", "key": "f5471output.box"}}}
    output = lambda_handler(event, [])
    print(output)
