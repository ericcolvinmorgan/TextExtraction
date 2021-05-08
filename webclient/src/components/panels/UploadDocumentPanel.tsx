import { DefaultButton, PrimaryButton } from '@fluentui/react/lib/components/Button';
import { Panel } from '@fluentui/react/lib/components/Panel';
import { TextField } from '@fluentui/react/lib/components/TextField';
import React, { FC, useEffect } from 'react';
import { useState } from 'react';
import { IPanelProps } from './Interfaces';
import { usePostDocument, useUploadDocument } from '../../api/documentsApi'
import { postDocumentRequest } from '../../models/documents';
import { Spinner } from '@fluentui/react/lib/components/Spinner';

const UploadDocumentPanel: FC<IPanelProps> = (props) => {
    const [saveFileForm, setSaveFileForm] = useState({ fileName: '', file: null });
    const postDocument = usePostDocument({} as postDocumentRequest);
    const uploadDocument = useUploadDocument("", new Blob());

    const setIsOpen = props.setIsOpen;

    const handleSaveFileFormChange = (event: React.FormEvent<any>, newValue?: string | undefined) => {
        console.log(event.currentTarget.name);
        newValue = newValue === undefined ? '' : newValue;

        if (event.currentTarget.name === 'file') {
            setSaveFileForm({ ...saveFileForm, [event.currentTarget.name]: event.currentTarget.files[0] })
        }
        else {
            setSaveFileForm({ ...saveFileForm, [event.currentTarget.name]: newValue })
        }
    }

    const handleUploadClick = React.useCallback(
        async () => {
            if (saveFileForm.file == null || saveFileForm.fileName == '') {

            }
            else {
                const file: File = saveFileForm.file!;
                const blob: Blob = file as Blob;
                const postResponse = JSON.parse(await postDocument.sendRequest({ body: JSON.stringify({ name: saveFileForm.fileName, size: file.size, fileType: file.type }) }));
                console.log(postResponse);
                await uploadDocument.sendRequest({ body: blob }, postResponse.uploadURL)
                console.log(uploadDocument.response);
                setSaveFileForm({ fileName: '', file: null });
                setIsOpen(false);
            }

        }, [postDocument, saveFileForm, setIsOpen, uploadDocument]);

    const onRenderFooterContent = React.useCallback(
        () => {
            if (postDocument.loading || uploadDocument.loading) {
                return (<div>
                    <Spinner label="Uploading.  Please wait..." />
                  </div>)
            }
            else {
                return (
                    <div>
                        <PrimaryButton onClick={() => { handleUploadClick(); }} styles={{ root: { marginRight: 8 } }}>Upload</PrimaryButton>
                        <DefaultButton onClick={() => { setIsOpen(false); setSaveFileForm({ fileName: '', file: null }); }}>Cancel</DefaultButton>
                    </div>)
            }
        },
        [setIsOpen, handleUploadClick, postDocument.loading, uploadDocument.loading]
    );

    return (
        <div>
            <Panel
                id="panelSaveFile"
                isLightDismiss
                isOpen={props.isOpen}
                onDismiss={() => {
                    props.setIsOpen(false);
                    setSaveFileForm({ fileName: '', file: null });
                }}
                headerText="Upload File"
                closeButtonAriaLabel="Close"
                onRenderFooterContent={onRenderFooterContent}
                isFooterAtBottom={true}
            >
                <TextField
                    label="File Name"
                    onGetErrorMessage={(value: string): string => {
                        return value.length > 50 ? `Length must be less than 50. Actual length is ${value.length}.` : '';
                    }}
                    validateOnLoad={false}
                    name="fileName"
                    onChange={handleSaveFileFormChange}
                    required
                    styles={{ root: { marginBottom: 8 } }}
                />
                {/* <TextField label="Select File" readOnly defaultValue="Select File" iconProps={{ iconName: 'Download' }} onClick={() => { console.log('SELECT FILE') }} required /> */}
                <div><input name="file" type="file" onChange={handleSaveFileFormChange}></input></div>
            </Panel>
        </div>
    );
}

export default UploadDocumentPanel;