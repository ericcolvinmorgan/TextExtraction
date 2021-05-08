const AWS = require('aws-sdk');
const { Client } = require('pg');
const s3 = new AWS.S3()

exports.postItemHandler = async (event) => {
    if (event.httpMethod !== 'POST') {
        throw new Error(`postMethod only accepts the POST method, you tried: ${event.httpMethod} method.`);
    }
    // All log statements are written to CloudWatch
    console.info('received:', event);

    // Get id and name from the body of the request
    const body = JSON.parse(event.body);
    const fileName = body.name;
    const fileSize = body.size;
    const fileType = body.fileType;

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

    // Add entry to database
    console.info('Connecting To Database');
    await client.connect();
    const res = await client.query(
        'INSERT INTO public.documents(name, added_by, size, status_id, type_id, location) VALUES ($1, $2, $3, $4, $5, $6) RETURNING document_id',
        [fileName, '9eaadffa-d7c2-4359-ba37-427f39ced328', fileSize, 1, 0, '']
    );

    const documentId = res.rows[0].document_id;
    console.log(`${documentId} Added To Database`);
    await client.end();
    
    // Retrieve signed upload URL for document
    const uploadURL = await getUploadURL(documentId, fileType);
    
    const response = {
        statusCode: 200,
        body: JSON.stringify(uploadURL)
    };

    // All log statements are written to CloudWatch
    console.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`);
    return response;
}

const getUploadURL = async function(key, contentType) {
  
    // Get signed URL from S3
    const s3Params = {
      Bucket: process.env.DOCUMENT_BUCKET,
      Key: key,
      Expires: parseInt(process.env.UPLOAD_EXPIRATION_SECONDS),
      ContentType: contentType
    };

    const uploadURL = await s3.getSignedUrlPromise('putObject', s3Params);

    return JSON.stringify({
      uploadURL: uploadURL,
      key
    });
  }