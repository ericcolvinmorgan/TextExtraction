import { IPaginationStyles } from '@fluentui/react-experiments/lib/components/Pagination';
import { Pagination } from '@fluentui/react-experiments/lib/components/Pagination';
import { DefaultButton, IconButton, PrimaryButton } from '@fluentui/react/lib/components/Button';
import { DetailsList, DetailsListLayoutMode, IColumn, SelectionMode } from '@fluentui/react/lib/components/DetailsList';
import { Persona } from '@fluentui/react/lib/components/Persona/Persona';
import { TooltipHost } from '@fluentui/react/lib/components/Tooltip';
import { FontWeights, mergeStyleSets } from '@fluentui/react/lib/Styling';
import { useId, useBoolean } from '@fluentui/react-hooks';
import React, { FunctionComponent, useCallback, useEffect, useRef, useState } from 'react';
import { useTheme } from '@fluentui/react/lib/utilities/ThemeProvider';
import { PersonaSize } from '@fluentui/react/lib/components/Persona';
import { Dialog, DialogFooter, DialogType, FontIcon } from '@fluentui/react';
import { useDeleteDocumentById, useGetDocumentById, useGetDocuments } from '../../api/documentsApi';
import { useHistory } from 'react-router-dom';
import { getDocumentsResponse } from '../../models/documents';

export interface IDocument {
    key: string;
    name: string;
    value: string;
    iconName: string;
    fileStatus: number;
    fileType: string;
    modifiedBy: string;
    dateModified: string;
    dateModifiedValue: number;
    dateExpiration: string;
    dateExpirationValue: number;    
    fileSize: string;
    fileSizeRaw: number;
}

const DocumentsTable: FunctionComponent = () => {
    const history = useHistory();
    const [isConfirmDeleteOpen, { setTrue: showConfirmDelete, setFalse: hideConfirmDelete }] = useBoolean(false);
    const [items, updateItems] = useState([] as IDocument[]);
    const [deleteItem, updateDeleteItem] = useState({} as IDocument);
    const getDocuments = useRef(useGetDocuments(new URLSearchParams([['pageSize', '10']])));
    const getDocumentById = useGetDocumentById('', new URLSearchParams([['getdocument', 'true']]));
    const deleteDocumentById = useDeleteDocumentById('', new URLSearchParams());

    const theme = useTheme();

    const updateDocumentItems = useCallback((documents: getDocumentsResponse[]) => {
        const updatedItems: IDocument[] = [];
        for (var i = 0; i < documents.length; i++) {
            const fileDate = new Date(documents[i].added_date);
            const fileExpiration = new Date(documents[i].expire_date);

            let fileType = 'Unknown';
            let fileIcon = 'Unknown';

            switch (documents[i].type_id) {
                case -1:
                    fileType = 'Invalid';
                    fileIcon = '';
                    break;

                case 1:
                    fileType = fileIcon = 'PDF';
                    break;

                case 2:
                    fileType = 'Image';
                    fileIcon = 'FileImage';
                    break;
            }

            let fileName = documents[i].name;
            fileName = fileName.charAt(0).toUpperCase() + fileName.slice(1).concat(` - ${fileType}`);

            let userName = "Test User";
            userName = userName
                .split(' ')
                .map((name: string) => name.charAt(0).toUpperCase() + name.slice(1))
                .join(' ');

            userName = userName
                .split(' ')
                .map((name: string) => name.charAt(0).toUpperCase() + name.slice(1))
                .join(' ');

            updatedItems.push({
                key: documents[i].document_id,
                name: fileName,
                value: fileName,
                iconName: fileIcon,
                fileStatus: documents[i].status_id,
                fileType: fileType,
                modifiedBy: userName,
                dateModified: fileDate.toLocaleDateString() + ' ' + fileDate.toLocaleTimeString(),
                dateModifiedValue: fileDate.valueOf(),
                dateExpiration: fileExpiration.toLocaleDateString() + ' ' + fileExpiration.toLocaleTimeString(),
                dateExpirationValue: fileExpiration.valueOf(),
                fileSize: documents[i].size.toString(),
                fileSizeRaw: documents[i].size,
            });
        }
        updateItems(updatedItems);
    }, []);

    useEffect(() => {
        getDocuments.current.sendRequest({}).then(response => {
            updateDocumentItems(response);
        });
    }, [getDocuments.current.endpoint, updateDocumentItems]);

    const promptToDelete = (item: any) => {
        updateDeleteItem(item);
        showConfirmDelete();
    }

    const confirmDelete = async () => {
        await deleteDocumentById.sendRequest({}, `${process.env.REACT_APP_API_DOCUMENTS_ENDPOINT as string}/${deleteItem.key}`);
        await getDocuments.current.sendRequest({});
        hideConfirmDelete();
    }

    const getItemDocument = async (item: any) => {
        const detail = await getDocumentById.sendRequest({}, `${process.env.REACT_APP_API_DOCUMENTS_ENDPOINT as string}/${item.key}`);
        // const link = document.getElementById('downloadLink') as any;
        // link.href = detail.document_url;
        // link.click();
        window.open(detail.document_url);
        console.log(detail);
        hideConfirmDelete();
    }

    const getItemOutput = async (item: any) => {
        // const detail = await getDocumentById.sendRequest({}, `${process.env.REACT_APP_API_DOCUMENTS_ENDPOINT as string}/${item.key}`);
        // const link = document.getElementById('downloadLink') as any;
        // link.href = detail.text_url;
        // link.click();
        // console.log(detail);
        // hideConfirmDelete();

        history.push(`/ManageForms/${item.key}`);

    }

    const closeDelete = () => {
        updateDeleteItem({} as IDocument);
        hideConfirmDelete();
    }

    const getKey = (item: any, index?: number): string => {
        return item.key;
    }

    const onColumnClick = (ev: React.MouseEvent<HTMLElement>, column: IColumn): void => {
        console.log(`${column.key} Clicked - Implement Column Sorting`);
    }

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

    const classNames = mergeStyleSets({
        fileIconHeaderIcon: {
            padding: 0,
            fontSize: '16px',
        },
        fileIconCell: {
            textAlign: 'center',
            selectors: {
                '&:before': {
                    content: '.',
                    display: 'inline-block',
                    verticalAlign: 'middle',
                    height: '100%',
                    width: '0px',
                    visibility: 'hidden',
                },
            },
        },
        fileIconImg: {
            verticalAlign: 'middle',
            maxHeight: '16px',
            maxWidth: '16px',
        },
        controlWrapper: {
            display: 'flex',
            flexWrap: 'wrap',
        },
        exampleToggle: {
            display: 'inline-block',
            marginBottom: '10px',
            marginRight: '30px',
        },
        selectionDetails: {
            marginBottom: '20px',
        },
    });

    const columns: IColumn[] = [
        {
            key: 'column1',
            name: 'File Type',
            className: classNames.fileIconCell,
            iconClassName: classNames.fileIconHeaderIcon,
            ariaLabel: 'Column operations for File type, Press to sort on File type',
            iconName: 'Page',
            isIconOnly: true,
            fieldName: 'name',
            minWidth: 16,
            maxWidth: 16,
            onColumnClick: onColumnClick,
            onRender: (item: IDocument) => (
                <TooltipHost content={`${item.fileType} file`}>
                    <FontIcon aria-label={`${item.fileType} file icon`} iconName={item.iconName} />
                    {/* <img src={item.iconName} className={classNames.fileIconImg} alt={`${item.fileType} file icon`} /> */}
                </TooltipHost>
            ),
        },
        {
            key: 'column2',
            name: 'Name',
            fieldName: 'name',
            minWidth: 150,
            maxWidth: 300,
            isRowHeader: true,
            isResizable: true,
            isSorted: true,
            isSortedDescending: false,
            sortAscendingAriaLabel: 'Sorted A to Z',
            sortDescendingAriaLabel: 'Sorted Z to A',
            onColumnClick: onColumnClick,
            data: 'string',
            isPadded: true,
        },
        {
            key: 'column3',
            name: 'Date Modified',
            fieldName: 'dateModifiedValue',
            minWidth: 120,
            maxWidth: 120,
            isResizable: true,
            onColumnClick: onColumnClick,
            data: 'number',
            onRender: (item: IDocument) => {
                return <span>{item.dateModified}</span>;
            },
            isPadded: true,
        },
        {
            key: 'column4',
            name: 'Expiration Date',
            fieldName: 'dateExpirationValue',
            minWidth: 120,
            maxWidth: 120,
            isResizable: true,
            onColumnClick: onColumnClick,
            data: 'number',
            onRender: (item: IDocument) => {
                return <span>{item.dateExpiration}</span>;
            },
            isPadded: true,
        },
        {
            key: 'column5',
            name: 'Modified By',
            fieldName: 'modifiedBy',
            minWidth: 70,
            maxWidth: 120,
            isResizable: true,
            data: 'string',
            onColumnClick: onColumnClick,
            onRender: (item: IDocument) => {
                return <div>
                    <Persona text={item.modifiedBy} size={PersonaSize.size24} />
                </div>;
            },
            isPadded: true,
        },
        {
            key: 'column6',
            name: 'File Size',
            fieldName: 'fileSizeRaw',
            minWidth: 70,
            maxWidth: 90,
            isResizable: true,
            data: 'number',
            onColumnClick: onColumnClick,
            onRender: (item: IDocument) => {
                return <span>{item.fileSize}</span>;
            },
            isPadded: false
        },
        {
            key: 'column7',
            name: 'File Status',
            fieldName: 'fileStatus',
            minWidth: 70,
            maxWidth: 90,
            isResizable: true,
            data: 'number',
            onColumnClick: onColumnClick,
            onRender: (item: IDocument) => {
                switch (item.fileStatus) {
                    case 1:
                        return <span>Processing</span>;

                    case 2:
                        return <span>Completed</span>;

                    default:
                        return <span>Error</span>;

                }
            },
            isPadded: false
        },
        {
            key: 'column8',
            name: 'Actions',
            minWidth: 70,
            maxWidth: 90,
            isResizable: false,
            onColumnClick: onColumnClick,
            onRender: (item: IDocument) => {
                if (item.fileStatus === 2 && item.fileType !== 'Invalid') {
                    return <div>
                        <IconButton iconProps={{ iconName: 'DocumentSearch' }} onClick={() => { getItemOutput(item); }} />
                        <IconButton iconProps={{ iconName: 'Download' }} onClick={() => { getItemDocument(item); }} />
                        <IconButton iconProps={{ iconName: 'Delete' }} onClick={() => { promptToDelete(item); }} />
                    </div>;
                }
                else {
                    return <div>
                        <IconButton iconProps={{ iconName: 'Delete' }} onClick={() => { promptToDelete(item); }} />
                    </div>;
                }
            },
            isPadded: false
        },
    ];

    const paginationStyles: IPaginationStyles = {
        root: {
            textAlign: 'left',
            alignItems: 'start'
        },
        comboBox: {}, pageNumber: { color: 'inherit !important', textDecoration: 'inherit !important' }, previousNextPage: {}, previousNextPageDisabled: {}, visibleItemLabel: {}
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
            {/* eslint-disable-next-line */}
            <a id="downloadLink" style={{ display: 'none' }}></a>
            <DetailsList
                items={items}
                compact={true}
                columns={columns}
                selectionMode={SelectionMode.none}
                getKey={getKey}
                setKey="none"
                layoutMode={DetailsListLayoutMode.justified}
                isHeaderVisible={true}
            />
            <Pagination pageCount={1}
                styles={paginationStyles}
                selectedPageIndex={0}
                format={'buttons'}
                numberOfPageButton={5}
                firstPageIconProps={{ iconName: 'DoubleChevronLeft' }}
                previousPageIconProps={{ iconName: 'ChevronLeft' }}
                nextPageIconProps={{ iconName: 'ChevronRight' }}
                lastPageIconProps={{ iconName: 'DoubleChevronRight' }}
            />
            <Dialog
                hidden={!isConfirmDeleteOpen}
                onDismiss={hideConfirmDelete}
                dialogContentProps={{
                    type: DialogType.largeHeader,
                    title: 'Confirm delete',
                    closeButtonAriaLabel: 'Close',
                    subText: 'Are you sure you would like to delete the following file (All generated images and data extractions will also be deleted):',
                }}
                modalProps={modalProps}
            >
                <div className={contentStyles.body}>
                    <p>{deleteItem.name}</p>
                </div>
                <DialogFooter>
                    <PrimaryButton onClick={confirmDelete} text="Delete" />
                    <DefaultButton onClick={closeDelete} text="Cancel" />
                </DialogFooter>
            </Dialog>
        </div>
    );
}

export default DocumentsTable;