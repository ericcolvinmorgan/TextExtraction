import { INavLinkGroup, Nav } from '@fluentui/react/lib/components/Nav';
import { Panel, PanelType } from '@fluentui/react/lib/components/Panel';
import { FC, useState } from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { IPanelProps } from '../panels/Interfaces';

type Props = IPanelProps & RouteComponentProps

const SideNavigation: FC<Props> = (props) => {
    const navLinkGroups: INavLinkGroup[] = [
        {
            links: [
                {
                    name: 'Home',
                    url: '/',
                    key: 'keyHomePage',
                    target: '_blank',
                },
                {
                    name: 'Manage Forms',
                    url: '/ManageForms',
                    key: 'keyManageFormsPage',
                    target: '_blank',
                }
            ],
        },
        {
            name: 'Advanced',
            links: [
                {
                    name: 'Manage Templates',
                    url: '/ManageTemplates',
                    key: 'keyManageTemplatesPage',
                    target: '_blank',
                }
            ],
        },
    ];

    const [useSelectedKey, setSelectedKey] = useState('keyHomePage');
    return (
        <Panel
            isOpen={props.isOpen}
            onDismiss={() => props.setIsOpen(false)}
            headerText="Main Menu"
            closeButtonAriaLabel="Close"
            isLightDismiss={true}
            type={PanelType.smallFixedNear}
        >
            <Nav
                onLinkClick={(event, element) => {
                    if (event) {
                        event.preventDefault();
                    }

                    if(element)
                    {
                        props.history.push(element.url);
                        
                        if(element.key)
                            setSelectedKey(element.key);
                    }
                }}
                selectedKey={useSelectedKey}
                ariaLabel="Navigation items"
                groups={navLinkGroups}
            />
        </Panel>
    );
}

export default withRouter(SideNavigation);