import { DefaultButton, PrimaryButton } from '@fluentui/react/lib/components/Button';
import { Panel } from '@fluentui/react/lib/components/Panel';
import { TextField } from '@fluentui/react/lib/components/TextField';
import React, { FC } from 'react';
import { useState } from 'react';
import { IPanelProps } from './Interfaces';

const UploadDocumentPanel: FC<IPanelProps> = (props) => {
    const [saveFileForm, setSaveFileForm] = useState({ name: '', file: null });

    const setIsOpen = props.setIsOpen;
    const onRenderFooterContent = React.useCallback(
        () => 
            (
                <div>
                    <PrimaryButton onClick={() => { console.log('HANDLE SAVE') }} styles={{ root: { marginRight: 8 } }}>Save</PrimaryButton>
                    <DefaultButton onClick={() => { setIsOpen(false) }}>Cancel</DefaultButton>
                </div>
            ),
        [setIsOpen]
    );

    const handleSaveFileFormChange = (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string | undefined) => {
        console.log(event.currentTarget.name);
        newValue = newValue === undefined ? '' : newValue;

        if (event.currentTarget.name === 'file') {
            //setSaveFileForm({ ...saveFileForm, [event.currentTarget.name]: event.target.fi })
        }
        else {
            setSaveFileForm({ ...saveFileForm, [event.currentTarget.name]: newValue })
        }
    }

    return (
        <div>
            <Panel
                id="panelSaveFile"
                isLightDismiss
                isOpen={props.isOpen}
                onDismiss={() => props.setIsOpen(false)}
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
                />
                <TextField label="Select File" readOnly defaultValue="Select File" iconProps={{ iconName: 'Download' }} onClick={() => { console.log('SELECT FILE') }} required />
            </Panel>
        </div>
    );
}

export default UploadDocumentPanel;