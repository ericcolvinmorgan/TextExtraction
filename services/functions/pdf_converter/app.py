import logging
import poppler
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
        array: An array containing a list of image output locations.
    """
    logger.info(event) 
    logger.info(poppler.version())
    return []
