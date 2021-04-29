const AWS = require('aws-sdk');
const { Client } = require('pg');

// Get the DynamoDB table name from environment variables
const tableName = process.env.SAMPLE_TABLE;

/**
 * A simple example includes a HTTP get method to get all items from a DynamoDB table.
 */
exports.getDocumentsHandler = async (event) => {
    if (event.httpMethod !== 'GET') {
        throw new Error(`getAllItems only accepts the GET method, you tried: ${event.httpMethod}`);
    }
    // All log statements are written to CloudWatch
    console.info('received:', event);

    var signer = new AWS.RDS.Signer({
        // configure options
        region: 'us-west-2',
        username: 'formgenerator-api-dbuser',
        hostname: 'form-extraction-dev.c9fpowuwlcrw.us-west-2.rds.amazonaws.com',
        port: 5432
    });
    var token = signer.getAuthToken({
        // these options are merged with those defined when creating the signer, overriding in the case of a duplicate option
        // credentials are not specified here or when creating the signer, so default credential provider will be used
        username: 'formgeneratorapidbuser' // overriding username
    });

    const client = new Client({
        user: 'formgeneratorapidbuser',
        host: 'form-extraction-dev.c9fpowuwlcrw.us-west-2.rds.amazonaws.com',
        database: 'postgres',
        password: token,
        port: 5432,
        ssl: { rejectUnauthorized: false }
        
    })

    await client.connect()
    const res = await client.query('SELECT $1::text as message, $1::text as itemname', ['Hello world!'])
    console.log(res.rows[0]) // Hello world!
    await client.end()

    // get all items from the table (only first 1MB data, you can use `LastEvaluatedKey` to get the rest of data)
    // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html#scan-property
    // https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_Scan.html
    var params = {
        TableName: tableName
    };

    const response = {
        statusCode: 200,
        body: JSON.stringify(params)
    };

    // All log statements are written to CloudWatch
    console.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`);
    return response;
}
