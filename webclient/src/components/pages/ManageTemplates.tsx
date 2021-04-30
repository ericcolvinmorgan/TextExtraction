import { Breadcrumb, IBreadcrumbItem } from '@fluentui/react/lib/components/Breadcrumb';
import { CommandBar, ICommandBarItemProps } from '@fluentui/react/lib/components/CommandBar';
import { IStackStyles, Stack } from '@fluentui/react/lib/components/Stack';
import { FunctionComponent, useState } from 'react';
import DocumentsPanel from '../tables/DocumentsTable';
import UploadDocumentPanel from '../panels/UploadDocumentPanel';


const TemplatesForms: FunctionComponent = () => {
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
        { text: 'Manage Templates', key: 'f1', isCurrentItem: true },
    ]; 

    const _items: ICommandBarItemProps[] = [
        {
            key: 'newDocument',
            text: 'New',
            iconProps: { iconName: 'Add' },
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
            </Stack>
            <Stack styles={stackStyles}>
                {/* <p>{JSON.stringify(saveFileForm)}</p> */}
                <CommandBar
                    items={_items}
                    ariaLabel="Use left and right arrow keys to navigate between commands"
                    styles={commandBarStyles}
                />

                <DocumentsPanel></DocumentsPanel>

            </Stack>
            <UploadDocumentPanel isOpen={isOpen} setIsOpen={setIsOpen}></UploadDocumentPanel>
        </div>
    );
}

export default TemplatesForms;