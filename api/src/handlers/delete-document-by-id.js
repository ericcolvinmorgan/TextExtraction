const AWS = require('aws-sdk');
const { Client } = require('pg');

/**
 * HTTP get method to get one item by id from the documents table.
 */
exports.deleteByIdHandler = async (event) => {
  if (event.httpMethod !== 'DELETE') {
    throw new Error(`deleteMethod only accept DELETE method, you tried: ${event.httpMethod}`);
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

  await client.connect();
  await client.query(`UPDATE public.documents SET marked_for_removal=true WHERE document_id=$1`, [id]);
  await client.end();

  const response = {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "DELETE"
    },
    body: JSON.stringify(id)
  };

  // All log statements are written to CloudWatch
  console.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`);
  return response;
}
