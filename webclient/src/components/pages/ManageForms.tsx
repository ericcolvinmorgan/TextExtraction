// TODO - Need to lift update documents state and remove page refreshes, those are currently implemented for testing only.

import { Breadcrumb, IBreadcrumbItem } from '@fluentui/react/lib/components/Breadcrumb';
import { CommandBar, ICommandBarItemProps } from '@fluentui/react/lib/components/CommandBar';
import { IStackStyles, Stack } from '@fluentui/react/lib/components/Stack';
import React, { FunctionComponent, useState } from 'react';
import DocumentsPanel from '../tables/DocumentsTable';
import UploadDocumentPanel from '../panels/UploadDocumentPanel';
import { Spinner, Text } from '@fluentui/react';
import { FontWeights } from '@fluentui/react/lib/Styling';
import { useTheme } from '@fluentui/react/lib/Theme';
import { useId, useBoolean } from '@fluentui/react-hooks';
import { mergeStyleSets } from '@fluentui/react/lib/Styling';
import { TextField } from '@fluentui/react/lib/TextField';
import { useFetch } from '../../hooks/useFetch';
import { Dialog } from '@fluentui/react/lib/components/Dialog';
import { DialogType } from '@fluentui/react/lib/components/Dialog';
import { DialogFooter } from '@fluentui/react/lib/components/Dialog';
import { PrimaryButton } from '@fluentui/react/lib/components/Button';
import { DefaultButton } from '@fluentui/react/lib/components/Button';

const ManageForms: FunctionComponent = () => {
    const [wikiTopic, setWikiTopic] = useState('');
    const fetchResource = useFetch<any>("", { method: "GET" }, {});
    const [isOpen, setIsOpen] = useState(false);
    const [isWikiModalOpen, { setTrue: showWikiModal, setFalse: hideWikiModal }] = useBoolean(false);
    const [isCryptoModalOpen, { setTrue: showCryptoModal, setFalse: hideCryptoModal }] = useBoolean(false);
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

    const stackStyles: IStackStyles = {
        root: {
            margin: '0 auto',
            width: `1200px`,
            marginBottom: '50px'
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
            onClick: showWikiModal
        },
        {
            key: 'importCrypto',
            text: 'Extract Crypto Rates',
            iconProps: { iconName: 'AllCurrency' },
            onClick: showCryptoModal
        },
        {
            key: 'refreshDocuments',
            text: 'Refresh',
            iconProps: { iconName: 'Refresh' },
            onClick: () => window.location.reload()
        },
    ];

    const wikiModalBody = () => {
        if (fetchResource.loading) {
            return <Spinner label="Importing.  Please wait..." />
        }
        else {
            return (
                <div>
                    <div className={contentStyles.body}>                    
                        <Text>Enter the topic of the Wikipedia article from which to extract PDF references</Text>
                        <TextField label="Topic" onChange={(ev, val) => {
                                val = val === undefined ? '' : val;
                                setWikiTopic(val);
                            }}
                            required />
                    </div>
                    <DialogFooter>
                    <PrimaryButton onClick={async () => {
                        await fetchResource.sendRequest({}, `https://2m6qr0wvk7.execute-api.us-west-2.amazonaws.com/default/cs361-services?Type=Topic&Keyword=${wikiTopic}`);
                        setWikiTopic('');
                        hideWikiModal();
                        window.location.reload();
                    }} text="Import" />
                    <DefaultButton onClick={() => {
                        setWikiTopic('');
                        hideWikiModal();
                    }} text="Cancel" />
                </DialogFooter>
                </div>
            );
        }
    }

    const cryptoModalBody = () => {
        if (fetchResource.loading) {
            return <Spinner label="Importing.  Please wait..." />
        }
        else {
            return (
                <div>
                    <div className={contentStyles.body}>                    
                        <Text>Would you like to import the latest Crypto prices?</Text>
                    </div>
                    <DialogFooter>
                    <PrimaryButton onClick={async () => {
                        await fetchResource.sendRequest({}, "https://2m6qr0wvk7.execute-api.us-west-2.amazonaws.com/default/cs361-services?Type=Crypto");
                        hideCryptoModal();
                        window.location.reload();
                    }} text="Import" />
                    <DefaultButton onClick={hideCryptoModal} text="Cancel" />
                </DialogFooter>
                </div>
            );
        }
    }

    const labelId: string = useId('dialogLabel');
    const subTextId: string = useId('subTextLabel');

    const modalProps = React.useMemo(
        () => ({
            titleAriaId: labelId,
            subtitleAriaId: subTextId,
            isBlocking: false,
            styles: { main: { maxWidth: 450 } },
            dragOptions: undefined,
        }),
        [labelId, subTextId],
    );

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
                <Stack styles={{ root: { textAlign: "start" } }}>
                <Text variant={'xxLarge'}>New Features!</Text>
                        <Text>Two new import options have been added!  These imports all you to streamline importing documents from a standard source.  They help you save time by not having to download and organize these files manually.  Please note, the previous functionality to upload any file of your choice still exists and remains in the same location!</Text>
                        <li><Text>Extract Wikipedia PDFs/Images - Extract text from PDF references found in a wikipedia article on a given topic.</Text></li>
                        <li><Text>Extract Crypto Rates - Import and extract text from the Crypto rate service.</Text></li>
                    <br />
                    <Text variant={'xxLarge'}>Instructions</Text>
                    <Text>This page is used to manage your uploaded documents.  After uploading, PDF documents will be converted to image files, and data will be extracted from all documents.</Text>
                    <br />
                    <Text variant={'xLarge'}>Command Bar</Text>
                    <ul>
                        <li><Text>Click on the "New" button below to upload a new document.</Text></li>
                        <li><Text>Click on the "Extract Wikipedia PDFs/Images" button below to import and extract text from PDF references found in a wikipedia article on a given topic.</Text></li>
                        <li><Text>Click on the "Extract Crypto Rates" button below to import and extract text from the Crypto rate service.</Text></li>
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

            <Dialog
                hidden={!isWikiModalOpen}
                onDismiss={() => {
                    setWikiTopic('');
                    hideWikiModal()
                }}
                dialogContentProps={{
                    type: DialogType.largeHeader,
                    title: 'Confirm import',
                    closeButtonAriaLabel: 'Close'
                }}
                modalProps={modalProps}
            >
                {wikiModalBody()}
            </Dialog>

            <Dialog
                hidden={!isCryptoModalOpen}
                onDismiss={hideCryptoModal}
                dialogContentProps={{
                    type: DialogType.largeHeader,
                    title: 'Confirm import',
                    closeButtonAriaLabel: 'Close'
                }}
                modalProps={modalProps}
            >
                {cryptoModalBody()}
            </Dialog>
        </div>
    );
}

export default ManageForms;