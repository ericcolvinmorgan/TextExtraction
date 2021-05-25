const fetch = require('node-fetch');
const fs = require('fs');

const postExample = async () =>
{
    const stats = fs.statSync('./pdf-sample.pdf');
    const fileSize = stats.size;
    const stream = fs.createReadStream('./pdf-sample.pdf');

    const endPoint = "https://lu6q09wrld.execute-api.us-west-2.amazonaws.com/Prod/documents";
    const postOptions = {         
        method: "POST",
        body: JSON.stringify({ name: 'PDF Sample', size: fileSize, fileType: 'application/pdf' })
    };

    const req = await fetch(endPoint, postOptions);
    const detail = await req.json();

    const putOptions = {         
        method: "PUT",
        headers: {
            "Content-length": fileSize,
            "Content-type": 'application/pdf'
        },
        body: stream
    };

    const postDetail = JSON.parse(detail);

    const s3Req = await fetch(postDetail.uploadURL, putOptions);
    console.log(s3Req.status);
    console.log(s3Req.headers);
}


const getExample = async () =>
{
    const endPoint = "https://lu6q09wrld.execute-api.us-west-2.amazonaws.com/Prod/documents/a5a5e613-1563-4e16-9f05-a7896302e62e";
    const requestOptions = {         
        method: "GET"
    };

    const req = await fetch(endPoint, requestOptions);
    const detail = await req.json();

    const textReq = await fetch(detail.text_url, requestOptions);
    const textDetail = await textReq.json();

    console.log('--- PAGE 1 TEXT ---');
    console.log(textDetail.pages[0].page_text.entry);
}

// postExample();
getExample();