import logging
import pytesseract
import cv2
#from PIL import Image

logger = logging.getLogger()
logger.setLevel(logging.INFO)

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
    logger.info(cv2.__version__)
    logger.info(pytesseract.get_tesseract_version())
    logger.info(event)
    logger.info("TESTING")
    return []
