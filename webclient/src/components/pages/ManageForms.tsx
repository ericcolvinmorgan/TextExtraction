// TODO - Need to lift update documents state and remove page refreshes, those are currently implemented for testing only.

import { Breadcrumb, IBreadcrumbItem } from '@fluentui/react/lib/components/Breadcrumb';
import { CommandBar, ICommandBarItemProps } from '@fluentui/react/lib/components/CommandBar';
import { IStackStyles, Stack } from '@fluentui/react/lib/components/Stack';
import { Modal } from '@fluentui/react/lib/components/Modal';
import React, { FunctionComponent, useState } from 'react';
import DocumentsPanel from '../tables/DocumentsTable';
import UploadDocumentPanel from '../panels/UploadDocumentPanel';
import { Text } from '@fluentui/react';
import { IconButton } from '@fluentui/react/lib/Button';
import { IButtonStyles } from '@fluentui/react/lib/Button';
import { FontWeights } from '@fluentui/react/lib/Styling';
import { useTheme } from '@fluentui/react/lib/Theme';
import { useBoolean } from '@fluentui/react-hooks';
import { mergeStyleSets } from '@fluentui/react/lib/Styling';
import { TextField } from '@fluentui/react/lib/TextField';

const ManageForms: FunctionComponent = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isModalOpen, { setTrue: showModal, setFalse: hideModal }] = useBoolean(false);
    const theme = useTheme();

    const contentStyles = mergeStyleSets({
        container: {
            display: 'flex',
            flexFlow: 'column nowrap',
            alignItems: 'stretch',
        },
        header: [
            theme.fonts.xLargePlus,
            {
                flex: '1 1 auto',
                borderTop: `4px solid ${theme.palette.themePrimary}`,
                color: theme.palette.neutralPrimary,
                display: 'flex',
                alignItems: 'center',
                fontWeight: FontWeights.semibold,
                padding: '12px 12px 14px 24px',
            },
        ],
        body: {
            flex: '4 4 auto',
            padding: '0 24px 24px 24px',
            overflowY: 'hidden',
            selectors: {
                p: { margin: '14px 0' },
                'p:first-child': { marginTop: 0 },
                'p:last-child': { marginBottom: 0 },
            },
        },
    });
    
    const iconButtonStyles: Partial<IButtonStyles> = {
        root: {
            color: theme.palette.neutralPrimary,
            marginLeft: 'auto',
            marginTop: '4px',
            marginRight: '2px',
        },
        rootHovered: {
            color: theme.palette.neutralDark,
        },
    };

    const stackStyles: IStackStyles = {
        root: {
            margin: '0 auto',
            width: `1200px`,
            marginBottom:'50px'
        }
    };

    const commandBarStyles: IStackStyles = {
        root: {
            padding: '0'
        }
    };

    const breadcrumbItems: IBreadcrumbItem[] = [
        { text: 'Main', key: 'Main', href: '/' },
        { text: 'Manage Documents', key: 'f1', isCurrentItem: true },
    ];

    const items: ICommandBarItemProps[] = [
        {
            key: 'newDocument',
            text: 'New',
            iconProps: { iconName: 'Add' },
            onClick: () => setIsOpen(true)
        },
        {
            key: 'importDocuments',
            text: 'Extract Wikipedia PDFs/Images',
            iconProps: { iconName: 'Import' },
            onClick: showModal
        },
        {
            key: 'refreshDocuments',
            text: 'Refresh',
            iconProps: { iconName: 'Refresh' },
            onClick: () => window.location.reload()
        },
    ];    

    return (
        <div>
            <Stack styles={stackStyles} horizontalAlign="start">
                {/* <Text variant="xLarge">Document Manager</Text> */}
                <Breadcrumb
                    items={breadcrumbItems}
                    maxDisplayedItems={10}
                    ariaLabel="Breadcrumb with items rendered as buttons"
                    overflowAriaLabel="More links"
                />
                <Stack styles={{ root: {textAlign: "start"}}}>
                    <Text variant={'xxLarge'}>Instructions</Text>
                    <Text>This page is used to manage your uploaded documents.  After uploading, PDF documents will be converted to image files, and data will be extracted from all documents.</Text>
                    <br />
                    <Text variant={'xLarge'}>Command Bar</Text>
                    <ul>
                    <li><Text>Click on the "New" button below to upload a new document.</Text></li>
                    <li><Text>Click on the "Extract Wikipedia PDFs/Images" button below to import and extract text from all images and PDFs found in a wikipedia article.</Text></li>
                    </ul>
                    
                    <Text variant={'xLarge'}>Table</Text>
                    <ul>
                    <li><Text>Columns below are resizable and can be expanded/shrunk as desired.</Text></li>
                    <li><Text>Columns can be reordered by clicking on the header.</Text></li>
                    <li><Text>The actions section contains buttons that can be clicked to trigger an action on that item.</Text>
                    <ul>
                        <li>View - View current document in a popup.</li>
                        <li>Download - Download document package including original document, converted images, and extracted text.</li>
                        <li>Delete - Permanently delete all document items (including converted images, and extracted data)</li>
                    </ul>
                    </li>
                    </ul>
                </Stack>
            </Stack>
            <Stack styles={stackStyles}>
                {/* <p>{JSON.stringify(saveFileForm)}</p> */}
                <CommandBar
                    items={items}
                    ariaLabel="Use left and right arrow keys to navigate between commands"
                    styles={commandBarStyles}
                />

                <DocumentsPanel></DocumentsPanel>
            </Stack>
            <UploadDocumentPanel isOpen={isOpen} setIsOpen={setIsOpen}></UploadDocumentPanel>

            <Modal
                isOpen={isModalOpen}
                onDismiss={hideModal}
                isBlocking={false}
                containerClassName={contentStyles.container}
            >
                <div className={contentStyles.header}>
                    <span>Extract Wikipedia Documents</span>
                    <IconButton
                        styles={iconButtonStyles}
                        iconProps={{ iconName: 'Cancel' }}
                        ariaLabel="Close popup modal"
                        onClick={hideModal}
                    />
                </div>
                <div className={contentStyles.body}>
                    <Text>Enter the address to the Wikipedia article from which to extract PDF references</Text>
                    <TextField label="Set Location" iconProps={{ iconName: 'Download' }} onClick={() => { console.log('Select Location') }} required />
                </div>
            </Modal>
        </div>
    );
}

export default ManageForms;