// TODO - Need to lift update documents state and remove page refreshes, those are currently implemented for testing only.

import { Breadcrumb, IBreadcrumbItem } from '@fluentui/react/lib/components/Breadcrumb';
import { CommandBar, ICommandBarItemProps } from '@fluentui/react/lib/components/CommandBar';
import { IStackStyles, Stack } from '@fluentui/react/lib/components/Stack';
import { FunctionComponent, useEffect, useState, useRef } from 'react';
import { Spinner, Text } from '@fluentui/react';
import { useTheme } from '@fluentui/react/lib/Theme';
import { useGetDocumentById } from '../../api/documentsApi';
import { useParams } from 'react-router-dom';
import { useFetch } from '../../hooks/useFetch';
import DocumentViewer from '../document_viewer/DocumentViewer';

const FormDetail: FunctionComponent = () => {
    const { documentId }: any = useParams();
    const getDocumentById = useGetDocumentById('', new URLSearchParams([['getdocument', 'true']]));
    const [documentDetail, setDocumentDetail] = useState({} as any);
    const [isOpen, setIsOpen] = useState(false);
    const [selectedTextItem, setSelectedTextItem] = useState({} as any);
    const theme = useTheme();

    useEffect(() => {
        if (!getDocumentById.loading)
            getDocumentById.sendRequest({}, `${process.env.REACT_APP_API_DOCUMENTS_ENDPOINT as string}/${documentId}`)
                .then(data => {
                    const options: any = {
                        method: "GET"
                    };
                    fetch(data.text_url, options)
                        .then(response => response.json())
                        .then(text => {
                            setDocumentDetail({ images: data.image_urls, text });
                        });
                })
                .catch(error => {
                    console.log(error);
                });
    }, [getDocumentById.endpoint]);

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
        { text: 'Manage Documents', key: 'ManageDocument', href: '/ManageForms/' },
        { text: 'Document Viewer', key: 'f1', isCurrentItem: true },
    ];

    const items: ICommandBarItemProps[] = [
        {
            key: 'confirmDetail',
            text: 'Confirm',
            iconProps: { iconName: 'Add' },
            onClick: () => window.location.reload()
        },
        {
            key: 'refreshDocuments',
            text: 'Refresh',
            iconProps: { iconName: 'Refresh' },
            onClick: () => window.location.reload()
        },
    ];

    const displayDocument = () => {
        let documentDisplay = [];
        if (getDocumentById.loading) {
            documentDisplay.push(<div key={'document-page-loading'}>
                <Spinner label="Loading.  Please wait..." />
            </div>)
        }
        else {
            if (documentDetail.images && documentDetail.text) {
                console.log(documentDetail);
                
                for(let pageIndex = 0; pageIndex < documentDetail.text.page_count; pageIndex++)
                {
                    const textDetail = documentDetail.text.pages.find((page:any) => page.page_num == pageIndex + 1);
                    console.log(`PAGE INDEX: ${pageIndex} TEXT: ${textDetail.page_num}`);
                    documentDisplay.push(<DocumentViewer key={`document-page-${pageIndex + 1}`} image={documentDetail.images[pageIndex]} text={textDetail} setSelectedTextItem={setSelectedTextItem} />)
                }
            }
        }
        return <div>{documentDisplay}</div>
    }

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
                    <Text variant={'xxLarge'}>Instructions</Text>
                    <Text>This page is used to view data extracted from documents.</Text>
                    <br />
                    <Text variant={'xLarge'}>Command Bar</Text>
                    <ul>
                        <li><Text>Click on the "Confirm" button to confirm detail.</Text></li>
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
                <div>{JSON.stringify(selectedTextItem)}</div>
                <div>{displayDocument()}</div>
            </Stack>
        </div>
    );
}

export default FormDetail;