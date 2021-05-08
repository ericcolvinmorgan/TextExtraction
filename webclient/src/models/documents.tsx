export interface postDocumentRequest {
    name: string,
    size: number,
    fileType: string
}

export interface postDocumentResponse {
    uploadURL: string,
    key: string
}