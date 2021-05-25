export interface postDocumentRequest {
    name: string,
    size: number,
    fileType: string
}

export interface postDocumentResponse {
    uploadURL: string,
    key: string
}

export interface getDocumentsResponse {
    document_id: string, 
    name: string, 
    added_date: string, 
    expire_date: string, 
    added_by: string, 
    size: number, 
    status_id: number, 
    type_id: number
}