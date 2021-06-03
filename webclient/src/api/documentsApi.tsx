import { useFetch } from '../hooks/useFetch';
import { getDocumentsResponse, postDocumentRequest, postDocumentResponse } from '../models/documents';

// Posts a request to upload a file to the documents endpoint.  
// A signed S3 token will be returned indicating to where a file may be uploaded.
export const usePostDocument = (requestData: postDocumentRequest) => {
    const url = process.env.REACT_APP_API_DOCUMENTS_ENDPOINT as string;
    const options = {
        method: "POST",
        body: JSON.stringify(requestData)
    }

    return useFetch<postDocumentResponse>(url, options, {} as postDocumentResponse);
}

// Uploads a document to a provided S3 signed URL 
export const useUploadDocument = (signedUrl: string, blobData: Blob) => {
    const options = {
        method: "PUT",
        body: blobData
    }
    
    return useFetch<any>(signedUrl, options, {});
}

// Posts a request to upload a file to the documents endpoint.  
// A signed S3 token will be returned indicating to where a file may be uploaded.
export const useGetDocuments = (params: URLSearchParams) => {
    const url = new URL(process.env.REACT_APP_API_DOCUMENTS_ENDPOINT as string);
    url.search = new URLSearchParams(params).toString();
    
    const options = {
        method: "GET",
    }

    return useFetch<getDocumentsResponse[]>(url.toString(), options, [] as getDocumentsResponse[]);
}

// Posts a request to upload a file to the documents endpoint.  
// A signed S3 token will be returned indicating to where a file may be uploaded.
export const useGetDocumentById = (id: string, params: URLSearchParams) => {
    const url = new URL(`${process.env.REACT_APP_API_DOCUMENTS_ENDPOINT as string}/${id}`);
    url.search = new URLSearchParams(params).toString();
    
    const options = {
        method: "GET",
    }

    return useFetch<any>(url.toString(), options, [])
}

// Posts a request to upload a file to the documents endpoint.  
// A signed S3 token will be returned indicating to where a file may be uploaded.
export const useDeleteDocumentById = (id: string, params: URLSearchParams) => {
    const url = new URL(`${process.env.REACT_APP_API_DOCUMENTS_ENDPOINT as string}/${id}`);
    url.search = new URLSearchParams(params).toString();
    
    const options = {
        method: "DELETE",
    }

    return useFetch<any>(url.toString(), options, [])
}