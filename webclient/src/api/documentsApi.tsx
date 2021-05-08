import { useFetch } from '../hooks/useFetch';
import { postDocumentRequest, postDocumentResponse } from '../models/documents';

// Posts a request to upload a file to the documents endpoint.  
// A signed S3 token will be returned indicating to where a file may be uploaded.
export const usePostDocument = (requestData: postDocumentRequest) => {
    const url = process.env.REACT_APP_API_DOCUMENTS_ENDPOINT as string;
    const options = {
        method: "POST",
        body: JSON.stringify(requestData)
    }

    return useFetch<postDocumentResponse>(url, options, {uploadURL:"Test"} as postDocumentResponse);
}

// Uploads a document to a provided S3 signed URL 
export const useUploadDocument = (signedUrl: string, blobData: Blob) => {
    const options = {
        method: "PUT",
        body: blobData
    }
    
    return useFetch<any>(signedUrl, options, {});
}