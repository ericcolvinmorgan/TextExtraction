import { IPaginationStyles } from '@fluentui/react-experiments/lib/components/Pagination';
import { Pagination } from '@fluentui/react-experiments/lib/components/Pagination';
import { DefaultButton, IButtonStyles, IconButton, PrimaryButton } from '@fluentui/react/lib/components/Button';
import { DetailsList, DetailsListLayoutMode, IColumn, SelectionMode } from '@fluentui/react/lib/components/DetailsList';
import { Modal } from '@fluentui/react/lib/components/Modal';
import { Persona } from '@fluentui/react/lib/components/Persona/Persona';
import { TooltipHost } from '@fluentui/react/lib/components/Tooltip';
import { FontWeights, mergeStyleSets } from '@fluentui/react/lib/Styling';
import { useId, useBoolean } from '@fluentui/react-hooks';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { useTheme } from '@fluentui/react/lib/utilities/ThemeProvider';
import { PersonaSize } from '@fluentui/react/lib/components/Persona';
import { Dialog, DialogFooter, DialogType, FontIcon } from '@fluentui/react';
import { useDeleteDocumentById, useGetDocumentById, useGetDocuments } from '../../api/documentsApi';

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
    fileSize: string;
    fileSizeRaw: number;
}

const DocumentsTable: FunctionComponent = () => {
    const [isModalOpen, { setTrue: showModal, setFalse: hideModal }] = useBoolean(false);
    const [isConfirmDeleteOpen, { setTrue: showConfirmDelete, setFalse: hideConfirmDelete }] = useBoolean(false);
    const [items, updateItems] = useState([] as IDocument[]);
    const [deleteItem, updateDeleteItem] = useState({} as IDocument);
    const getDocuments = useGetDocuments(new URLSearchParams([['pageSize', '10']]));
    const getDocumentById = useGetDocumentById('', new URLSearchParams([['getdocument', 'true']]));
    const getOutputById = useGetDocumentById('', new URLSearchParams([['getoutput', 'true']]));
    const deleteDocumentById = useDeleteDocumentById('', new URLSearchParams());

    const theme = useTheme();

    useEffect(() => {
        getDocuments.sendRequest({});
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [getDocuments.endpoint]);

    useEffect(() => {
        const updatedItems: IDocument[] = [];

        for (var i = 0; i < getDocuments.response.length; i++) {
            const fileDate = new Date(getDocuments.response[i].added_date);

            let fileType = 'Unknown';
            let fileIcon = 'Unknown';

            switch (getDocuments.response[i].type_id) {
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

            let fileName = getDocuments.response[i].name;
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
                key: getDocuments.response[i].document_id,
                name: fileName,
                value: fileName,
                iconName: fileIcon,
                fileStatus: getDocuments.response[i].status_id,
                fileType: fileType,
                modifiedBy: userName,
                dateModified: fileDate.toLocaleDateString(),
                dateModifiedValue: fileDate.valueOf(),
                fileSize: getDocuments.response[i].size.toString(),
                fileSizeRaw: getDocuments.response[i].size,
            });
        }

        updateItems(updatedItems);
    }, [getDocuments.response]);

    const promptToDelete = (item: any) => {
        updateDeleteItem(item);
        showConfirmDelete();
    }

    const confirmDelete = async () => {
        await deleteDocumentById.sendRequest({}, `${process.env.REACT_APP_API_DOCUMENTS_ENDPOINT as string}/${deleteItem.key}`);
        await getDocuments.sendRequest({});
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
        const detail = await getDocumentById.sendRequest({}, `${process.env.REACT_APP_API_DOCUMENTS_ENDPOINT as string}/${item.key}`);
        const link = document.getElementById('downloadLink') as any;
        link.href = detail.text_url;
        link.click();
        console.log(detail);
        hideConfirmDelete();
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
            minWidth: 210,
            maxWidth: 350,
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
            minWidth: 70,
            maxWidth: 90,
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
            key: 'column5',
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
            key: 'column6',
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
            key: 'column7',
            name: 'Actions',
            minWidth: 70,
            maxWidth: 90,
            isResizable: false,
            onColumnClick: onColumnClick,
            onRender: (item: IDocument) => {
                if (item.fileStatus === 2 && item.fileType !== 'Invalid') {
                    return <div>
                        <IconButton iconProps={{ iconName: 'DocumentSearch' }} onClick={() => { getItemDocument(item); }} />
                        <IconButton iconProps={{ iconName: 'Download' }} onClick={() => { getItemOutput(item); }} />
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
            <Modal
                isOpen={isModalOpen}
                onDismiss={hideModal}
                isBlocking={false}
                containerClassName={contentStyles.container}
            >
                <div className={contentStyles.header}>
                    <span>View Document</span>
                    <IconButton
                        styles={iconButtonStyles}
                        iconProps={{ iconName: 'Cancel' }}
                        ariaLabel="Close popup modal"
                        onClick={hideModal}
                    />
                </div>
                <div className={contentStyles.body}>
                    <p>PDF/Image Here</p>
                </div>
            </Modal>
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