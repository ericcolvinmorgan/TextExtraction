import boto3
import json
import logging
import os
import psycopg2
import sys

logger = logging.getLogger()

#TODO - Move to RDS Proxy

def lambda_handler(event, context):
    """ Lambda function which updates a document entry in the
    database with processing information from state machine.

    Parameters
    ----------
    event: dict, required
        Input event to the Lambda function

    context: object, required
        Lambda Context runtime methods and attributes
    """
    
    logger.setLevel(logging.getLevelName(os.getenv('LOG_LEVEL')))
    ENDPOINT=os.environ['TEXTEXTRACTION_HOST']
    PORT=os.environ['TEXTEXTRACTION_PORT']
    USR=os.environ['TEXTEXTRACTION_USERNAME']
    REGION=os.environ['TEXTEXTRACTION_REGION']
    DBNAME=os.environ['TEXTEXTRACTION_DATABASE']

    logger.info('Generating Token')
    session = boto3.Session()
    client = session.client('rds')
    token = client.generate_db_auth_token(DBHostname=ENDPOINT, Port=PORT, DBUsername=USR, Region=REGION)
    
    
    # Build update detail
    document_id = event['detail']['requestParameters']['key']
    status_id = -1    
    type_id = -1
    detail = {}

    try:
        if event['file_type'] == 'PDF':
            type_id = 1
        elif event['file_type'] == 'Image':
            type_id = 2

        if 'error-info' not in event:
            status_id = 2
            
        detail = event

    except Exception as e:
        print("Unable to extract detail from event: {}".format(e))    

    # Insert Update Detail
    try:
        logger.info('Attempting DB Connection')
        with psycopg2.connect(host=ENDPOINT, port=PORT, database=DBNAME, user=USR, password=token) as conn:            
            logger.info('Executing SQL')
            with conn.cursor() as cur:
                cur.execute("""
                    UPDATE public.documents
                    SET status_id=%s, type_id=%s, location=%s, detail=%s
                    WHERE document_id=%s
                """, (status_id, type_id, document_id, json.dumps(detail), document_id, ))
        
        logger.info(query_results)
    except Exception as e:
        logger.info("Database connection failed due to {}".format(e))

    return []

if __name__ == "__main__":
    from dotenv import load_dotenv, dotenv_values
    load_dotenv('./.env.dev')

    lambda_handler([], [])