const AWS = require('aws-sdk');
const { Client } = require('pg');
const s3 = new AWS.S3()

/**
 * HTTP get method to get one item by id from the documents table.
 */
exports.getByIdHandler = async (event) => {
  if (event.httpMethod !== 'GET') {
    throw new Error(`getMethod only accept GET method, you tried: ${event.httpMethod}`);
  }
  // All log statements are written to CloudWatch
  console.info('received:', event);

  // Get id from pathParameters from APIGateway because of `/{id}` at template.yml
  const id = event.pathParameters.id;
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
  let data = {};
  const res = await client.query(`SELECT location, status_id, detail -> 'file_type' AS file_type, detail -> 'text_output' AS text_output, detail -> 'image_output' AS image_output, detail -> 'error-info' AS error_info FROM public.documents WHERE document_id=$1`, [id]);
  await client.end();

  if (res.rows.length > 0) {
    data = res.rows[0];
    console.info('Record:', data);

    const document_key = data.location;
    document_url = await get_download_URL(process.env.DOCUMENT_BUCKET, document_key);
    data.document_url = document_url;

    const image_keys = data.image_output;
    data.image_urls = [];
    for (image_idx = 0; image_idx < image_keys.length; image_idx++) {
      image_url = await get_download_URL(process.env.PROCESSED_BUCKET, image_keys[image_idx]);
      data.image_urls.push(image_url);
    }
    
    const text_key = data.text_output[0];
    textUrl = await get_download_URL(process.env.PROCESSED_BUCKET, text_key);
    data.text_url = textUrl;
  }

  const response = {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET"
    },
    body: JSON.stringify(data)
  };

  // All log statements are written to CloudWatch
  console.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`);
  return response;
}

// Get signed URL from S3
const get_download_URL = async function (bucket, key, contentType) {
  const s3Params = {
    Bucket: bucket,
    Key: key,
    Expires: parseInt(process.env.DOWNLOAD_EXPIRATION_SECONDS)
  };

  const signedUrl = await s3.getSignedUrlPromise('getObject', s3Params);

  return signedUrl;
}