import logging
logger = logging.getLogger()
logger.setLevel(logging.INFO)

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
    logger.info(event)
    return {"document_id": 0, "file_type": "PDF"}
