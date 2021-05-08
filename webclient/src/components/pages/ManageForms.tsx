import { Breadcrumb, IBreadcrumbItem } from '@fluentui/react/lib/components/Breadcrumb';
import { CommandBar, ICommandBarItemProps } from '@fluentui/react/lib/components/CommandBar';
import { IStackStyles, Stack } from '@fluentui/react/lib/components/Stack';
import { FunctionComponent, useState } from 'react';
import DocumentsPanel from '../tables/DocumentsTable';
import UploadDocumentPanel from '../panels/UploadDocumentPanel';
import { Text } from '@fluentui/react';


const ManageForms: FunctionComponent = () => {
    const [isOpen, setIsOpen] = useState(false);

    const stackStyles: IStackStyles = {
        root: {
            margin: '0 auto',
            width: `1200px`
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
            // onClick: () => useIsOpen(true)
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
        </div>
    );
}

export default ManageForms;