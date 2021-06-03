import { DefaultButton } from '@fluentui/react/lib/components/Button';
import { Panel } from '@fluentui/react/lib/components/Panel';
import { TextField } from '@fluentui/react/lib/components/TextField';
import React, { FC } from 'react';
import { IPanelProps } from './Interfaces';

const WordViewerPanel: FC<IPanelProps & any> = (props) => {
    const setIsOpen = props.setIsOpen;
    const selectedTextItem = props.selectedtextitem;

    const onRenderFooterContent = React.useCallback(
        () => {
            return (
                <div>
                    <DefaultButton onClick={() => { setIsOpen(false); }}>Close</DefaultButton>
                </div>)
        },
        [setIsOpen]
    );

    const renderPanelBody = () => {
        if (Object.keys(selectedTextItem).length === 0) {
            return (<div>No Item Selected!</div>)
        }
        else {
            return (<div>
                <TextField label="Page" readOnly value={`Page ${selectedTextItem.page}`} />
                <TextField label="Entry" readOnly value={`${selectedTextItem.word.entry}`} />
                <TextField label="Confidence" readOnly value={`${selectedTextItem.word.confidence === -1 ? 100 : selectedTextItem.word.confidence}`} />
            </div>)
        }
    }

    return (
        <div>
            <Panel
                id="panelWordViewer"
                isLightDismiss={true}
                isOpen={props.isOpen}
                isBlocking={false}
                onDismiss={() => {
                    console.log('dismissed');
                    props.setIsOpen(false);
                }}
                headerText="Word Viewer"
                closeButtonAriaLabel="Close"
                onRenderFooterContent={onRenderFooterContent}
                isFooterAtBottom={true}
            >
                {renderPanelBody()}
            </Panel>
        </div>
    );
}

export default WordViewerPanel;