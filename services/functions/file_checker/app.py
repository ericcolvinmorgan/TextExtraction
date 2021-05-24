import boto3
import botocore
import logging
import os
import poppler
import sys
from PIL import Image
from io import BytesIO

logger = logging.getLogger()

def lambda_handler(event, context):
    """ Lambda function which determines the type of an input file.

    Parameters
    ----------
    event: dict, required
        Input event to the Lambda function

    context: object, required
        Lambda Context runtime methods and attributes

    Returns
    ------
        dict: Object containing the document_id and associated type.
    """
    logger.setLevel(logging.getLevelName(os.getenv('LOG_LEVEL')))
    logger.info(event)
    file_type = "Invalid"

    try:
        s3 = boto3.client('s3')
        fileBlob = BytesIO(s3.get_object(Bucket=event['detail']['requestParameters']['bucketName'], Key=event['detail']['requestParameters']['key'])['Body'].read())

        try:
            image=Image.open(fileBlob)
            logger.info("Image file found")
            file_type = "Image"
        except IOError:
            #Attempt PDF Open
            fileBlob.seek(0)
            pdf = poppler.load_from_data(fileBlob.read())

            if pdf.pages > 0:
                logger.info("PDF file found")
                file_type = "PDF"
    
    except botocore.exceptions.ClientError as error:
        raise error

    except:
        e = sys.exc_info()
        logger.debug(e)
        logger.info("File type could not be determined.")

    return file_type

if __name__ == "__main__":
    from dotenv import load_dotenv, dotenv_values
    load_dotenv('./.env.dev')

    # event = {"detail": {"requestParameters": {"bucketName": "text-extraction-maindocumentbucket-a8qgfmjqltvw", "key": "f5471-5.tif"}}}
    # event = {"detail": {"requestParameters": {"bucketName": "text-extraction-maindocumentbucket-a8qgfmjqltvw", "key": "f5471.pdf"}}}
    # event = {"detail": {"requestParameters": {"bucketName": "text-extraction-maindocumentbucket-a8qgfmjqltvw", "key": "f5471output.box"}}}
    # event = {"detail": {"requestParameters": {"bucketName": "text-extraction-maindocumentbucket-a8qgfmjqltvw", "key": "invalid"}}}
    event = {"detail": {'requestParameters': {'bucketName': 'text-extraction-maindocumentbucket-a8qgfmjqltvw', 'Host': 'text-extraction-maindocumentbucket-a8qgfmjqltvw.s3.us-west-2.amazonaws.com', 'Expires': '1621802614', 'key': '28300777-5c02-4602-8620-218b0ab2abdb', 'Content-Type': 'application/pdf'}}}
    
    output = lambda_handler(event, [])
    print(output)