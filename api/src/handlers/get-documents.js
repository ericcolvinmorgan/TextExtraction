const AWS = require('aws-sdk');
const { Client } = require('pg');

/**
 * HTTP get method to retrieve all documents and their current processing status.
 */
exports.getDocumentsHandler = async (event) => {
    if (event.httpMethod !== 'GET') {
        throw new Error(`getAllItems only accepts the GET method, you tried: ${event.httpMethod}`);
    }
    // All log statements are written to CloudWatch
    console.info('received:', event);

    var signer = new AWS.RDS.Signer({
        // configure options
        region: process.env.TEXTEXTRACTION_REGION,
        username: process.env.TEXTEXTRACTION_USERNAME,
        hostname: process.env.TEXTEXTRACTION_HOST,
        port: parseInt(process.env.TEXTEXTRACTION_PORT)
    });

    var token = signer.getAuthToken();

    const client = new Client({
        user: process.env.TEXTEXTRACTION_USERNAME,
        host: process.env.TEXTEXTRACTION_HOST,
        database: process.env.TEXTEXTRACTION_DATABASE,
        password: token,
        port: parseInt(process.env.TEXTEXTRACTION_PORT),
        ssl: { rejectUnauthorized: false }        
    });

    await client.connect()
    const res = await client.query(`SELECT document_id, name, added_date, added_date + interval '1' day * 7 as expire_date, 
        added_by, size, status_id, type_id FROM public.documents 
        WHERE marked_for_removal = false AND added_date + interval '1' day * 7 > now() ORDER BY added_date DESC;`);
    await client.end()

    const response = {
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET"
        },
        body: JSON.stringify(res.rows)
    };

    // All log statements are written to CloudWatch
    console.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`);
    return response;
}
