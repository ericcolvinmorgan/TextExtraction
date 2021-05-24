const https = require('https');
const http = require('http');

//const AWS = require('aws-sdk');
const fs = require('fs');

/**
 * Pass the data to send as `event.data`, and the request options as
 * `event.options`. For more information see the HTTPS module documentation
 * at https://nodejs.org/api/https.html.
 *
 * Will succeed with the response body.
 */

const getPDFFile = async (url) => {


    return new Promise((resolve) => {
        const fileName = `/tmp/4234dsf2dg34c.pdf`
        const stream = fs.createWriteStream(fileName);
        const reqCallback = (res) => {
            res.pipe(stream);
            res.on('end', () => {
                resolve(fileName);
            });
        };

        if (url.substring(0, 5) == 'https') {
            https.get(url, reqCallback);
        }
        else {
            http.get(url, reqCallback);
        }
    });
};

const addDocumentEntry = async (fileName, file) => {
    const stats = fs.statSync(file);
    const fileSize = stats.size;
    const stream = fs.createReadStream(file);

    const endPoint = "https://lu6q09wrld.execute-api.us-west-2.amazonaws.com/Prod/documents";
    const postData = JSON.stringify({ name: fileName, size: fileSize, fileType: 'application/pdf' });
    const postOptions = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': postData.length
        }
    };

    const response = await postPDFFile(endPoint, postOptions, postData);
    const detail = JSON.parse(response);

    const putOptions = {
        method: "PUT",
        headers: {
            "Content-Type": 'application/pdf',
            "Content-Length": fileSize
        }
    };

    const s3Req = await putPDFFile(detail.uploadURL, putOptions, stream);
    console.log(s3Req);
}

const postPDFFile = async (endpoint, options, requestData) => {
    return new Promise((resolve) => {
        const req = https.request(endpoint, options, res => {
            let data = '';
            res.on('data', chunk => { data += chunk });

            res.on('end', () => {
                resolve(JSON.parse(data));
            });
        });
        req.write(requestData);
        req.end();
    });
};

const putPDFFile = async (endpoint, options, fileStream) => {
    return new Promise(async (resolve) => {
        const req = https.request(endpoint, options, res => {
            resolve(res.statusCode);
        });

        for await (const chunk of fileStream) {
            req.write(chunk);
        }

        req.end();
    });
};

const getTopicPDFList = async (topic) => {
    const url = `https://btcatmlocator.herokuapp.com/api/scrape/${topic}`;

    return new Promise((resolve) => {
        https.get(url, res => {
            let data = '';
            res.on('data', chunk => { data += chunk });

            res.on('end', () => {
                resolve(data);
            });
        });
    });
};

const getLinkHeader = async (entry) => {
    const url = entry;

    return new Promise((resolve) => {
        const options = {
            method: 'HEAD'
        }

        let req;

        if (url.substring(0, 5) == 'https') {
            req = https.request(url, options, res => {
                resolve(res.headers);
            });
        }
        else {
            req = http.request(url, options, res => {
                resolve(res.headers);
            });
        }

        req.end();
    });
};

exports.handler = async (event, context) => {
    console.log('Received event:', JSON.stringify(event, null, 2));

    let statusCode = '400';
    let headers;
    let body;

    switch (event.queryStringParameters.Type) {
        case 'Topic':
            {
                const topicKeyword = event.queryStringParameters.Keyword
                const str = await getTopicPDFList(topicKeyword);
                const entries = JSON.parse(str);
                const pdfEntries = [];

                if (entries === 'No PDFs available') {
                    statusCode = '200';
                    headers = {
                        'Content-Type': 'application/json'
                    };
                    body = JSON.stringify({ entries: 0 });
                }
                else {
                    let entryNum = 0;
                    for (const entryIndex in entries) {
                        const entry = entries[entryIndex];
                        const entryHeader = await getLinkHeader(entry);
                        if (entryHeader["content-type"] === 'application/pdf' && Number.parseInt(entryHeader["content-length"]) < 300000) {
                            const entryFile = await getPDFFile(entry);
                            const entryDoc = await addDocumentEntry(`${topicKeyword} Import - File #${++entryNum}`, entryFile);
                        }
                    }

                    statusCode = '200';
                    headers = {
                        'Content-Type': 'application/json'
                    };
                    body = JSON.stringify({ entries: entryNum });
                }
            }
            break;

        case 'Crypto':
            {
                const entryFile = await getPDFFile('https://simple-list-api.herokuapp.com//lcrypto/prices/pdf/https%3A%2F%2Fcrypto-wiki.herokuapp.com%2Fapi%3Fsearch_term%3DList_of_cryptocurrencies%26url%3Don');
                await addDocumentEntry('Crypto Import', entryFile);

                statusCode = '200';
                headers = {
                    'Content-Type': 'application/json'
                };
                body = JSON.stringify({ entries: 1 });
            }
            break;
    }

    return {
        statusCode,
        headers,
        body
    };
};

const event = {
    "queryStringParameters": {
        "Keyword": "Seattle",
        "Type": "Crypto"
    }
}

exports.handler(event);