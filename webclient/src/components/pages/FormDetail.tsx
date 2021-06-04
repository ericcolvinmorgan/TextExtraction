// TODO - Need to lift update documents state and remove page refreshes, those are currently implemented for testing only.

import { Breadcrumb, IBreadcrumbItem } from '@fluentui/react/lib/components/Breadcrumb';
import { CommandBar, ICommandBarItemProps } from '@fluentui/react/lib/components/CommandBar';
import { IStackStyles, Stack } from '@fluentui/react/lib/components/Stack';
import { Slider } from '@fluentui/react/lib/components/Slider';
import { FunctionComponent, useEffect, useState, useRef } from 'react';
import { Spinner, Text } from '@fluentui/react';
import { useGetDocumentById } from '../../api/documentsApi';
import { useHistory, useParams } from 'react-router-dom';
import DocumentViewer from '../document_viewer/DocumentViewer';
import WordViewerPanel from '../panels/WordViewerPanel';

const FormDetail: FunctionComponent = () => {
    const { documentId }: any = useParams();
    const getDocumentById = useRef(useGetDocumentById('', new URLSearchParams([['getdocument', 'true']])));
    const [documentDetail, setDocumentDetail] = useState({} as any);
    const [isOpen, setIsOpen] = useState(false);
    const [selectedTextItem, setSelectedTextItem] = useState({} as any);
    const [thresholds, setThresholds] = useState({maxLow: 60, maxMedium: 80})
    const history = useHistory();

    useEffect(() => {
        if (!getDocumentById.current.loading)
            getDocumentById.current.sendRequest({}, `${process.env.REACT_APP_API_DOCUMENTS_ENDPOINT as string}/${documentId}`)
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
    }, [getDocumentById.current.endpoint, documentId]);

    const stackStyles: IStackStyles = {
        root: {
            margin: '0 auto',
            width: `1200px`,
            marginBottom: '10px'
        }
    };

    const commandBarStyles: IStackStyles = {
        root: {
            padding: '0'
        }
    };

    const handleBreakcrumbClick = (event: React.MouseEvent<HTMLElement, MouseEvent> | undefined, element: IBreadcrumbItem | undefined) => {
        if (event) {
            event.preventDefault();
        }

        if(element)
        {
            if(element.href)
                history.push(element.href);
        }
    }

    const breadcrumbItems: IBreadcrumbItem[] = [
        { text: 'Main', key: 'Main', href: '/', onClick: handleBreakcrumbClick},
        { text: 'Manage Documents', key: 'ManageDocument', href: '/ManageForms/', onClick: handleBreakcrumbClick},
        { text: 'Document Viewer', key: 'f1', isCurrentItem: true },
    ];

    const getItemDocument = async () => {
        const detail = await getDocumentById.current.sendRequest({}, `${process.env.REACT_APP_API_DOCUMENTS_ENDPOINT as string}/${documentId}`);
        const link = document.getElementById('downloadLink') as any;
        link.href = detail.text_url;
        link.click();
    }

    const items: ICommandBarItemProps[] = [
        {
            key: 'downloadDetail',
            text: 'Download',
            iconProps: { iconName: 'Download' },
            onClick: getItemDocument
        },
        // {
        //     key: 'confirmDetail',
        //     text: 'Confirm',
        //     iconProps: { iconName: 'Add' },
        //     onClick: () => window.location.reload()
        // },
        {
            key: 'refreshDocuments',
            text: 'Refresh',
            iconProps: { iconName: 'Refresh' },
            onClick: () => window.location.reload()
        },
    ];

    const displayDocument = () => {
        let documentDisplay = [];
        if (getDocumentById.current.loading) {
            documentDisplay.push(<div key={'document-page-loading'}>
                <Spinner label="Loading.  Please wait..." />
            </div>)
        }
        else {
            if (documentDetail.images && documentDetail.text) {
                for (let pageIndex = 0; pageIndex < documentDetail.text.page_count; pageIndex++) {
                    const textDetail = documentDetail.text.pages.find((page: any) => page.page_num === pageIndex + 1);
                    documentDisplay.push(<DocumentViewer key={`document-page-${pageIndex + 1}`} image={documentDetail.images[pageIndex]} text={textDetail} thresholds={thresholds} setisopen={setIsOpen} setselectedtextitem={setSelectedTextItem} />)
                }
            }
        }
        return <div>{documentDisplay}</div>
    }

    return (
        <div>
            {/* eslint-disable-next-line */}
            <a id="downloadLink" style={{ display: 'none' }}></a>
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
                        {/* <li><Text>Click on the "Confirm" button to confirm detail.</Text></li> */}
                        <li><Text>Click on the "Download" button to download out JSON.</Text></li>
                        <li><Text>Click on the "Refresh" button to refresh the screen.</Text></li>
                        <li><Text>Use the below sliders to configure your preference around confidence thresholds.</Text></li>
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
                <Stack horizontal styles={stackStyles}>
                    <Stack.Item grow>
                        <Stack>
                            <Slider
                                label="Max Low Confidence"
                                min={0}
                                max={thresholds.maxMedium}
                                value={thresholds.maxLow}
                                valueFormat={(value: number) => `${value}%`}
                                onChange={(value) => {setThresholds({maxLow: value, maxMedium: thresholds.maxMedium})}}
                                showValue
                            />

                        </Stack>
                    </Stack.Item>
                    <Stack.Item grow>
                        <Stack>
                            <Slider
                                label="Max Medium Confidence"
                                min={thresholds.maxLow}
                                max={100}
                                value={thresholds.maxMedium}
                                valueFormat={(value: number) => `${value}%`}
                                onChange={(value) => {setThresholds({maxLow: thresholds.maxLow, maxMedium: value})}}
                                showValue
                            />

                        </Stack>
                    </Stack.Item>
                </Stack>
                <div>{displayDocument()}</div>
            </Stack>
            <WordViewerPanel isOpen={isOpen} setIsOpen={setIsOpen} selectedtextitem={selectedTextItem}></WordViewerPanel>
        </div>
    );
}

export default FormDetail;