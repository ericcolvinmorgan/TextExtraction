import { CommandBar, ICommandBarItemProps } from '@fluentui/react/lib/components/CommandBar';
import { IContextualMenuItem } from '@fluentui/react/lib/components/ContextualMenu';
import { Dispatch, FC, SetStateAction, useState } from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';

type TopNavigationProps = {
  isDarkMode: boolean;
  setIsDarkMode: Dispatch<SetStateAction<boolean>>;
  setIsSidePanelOpen: Dispatch<SetStateAction<boolean>>;
} & RouteComponentProps;

const TopNavigation: FC<TopNavigationProps> = (props) => {
  const [useModeLabel, setModeLabel] = useState('Use Dark Mode');

  const handleLoginClick = (ev?: React.MouseEvent<HTMLElement, MouseEvent> | React.KeyboardEvent<HTMLElement> | undefined, item?: IContextualMenuItem | undefined) => {
    if (item) {
      console.log('Login/Logout');
    }
  };

  const handleToggleTheme = (ev?: React.MouseEvent<HTMLElement, MouseEvent> | React.KeyboardEvent<HTMLElement> | undefined, item?: IContextualMenuItem | undefined) => {
    if (item) {
      if (props.isDarkMode)
        setModeLabel('Use Dark Mode');
      else
        setModeLabel('Use Light Mode');

      props.setIsDarkMode(!props.isDarkMode)
    }
  };

  const leftSideitems: ICommandBarItemProps[] = [
    {
      key: 'openMenu',
      iconProps: { iconName: 'BulletedListText' },
      onClick: () => { props.setIsSidePanelOpen(true) }
    },
  ];

  const rightSideItems: ICommandBarItemProps[] = [
    { key: 'login', text: 'Login', iconProps: { iconName: 'Accounts' }, onClick: handleLoginClick },
    {
      key: 'toggleTheme',
      text: useModeLabel,
      //iconProps: {iconName: 'Sunny' },
      iconProps: { iconName: 'ClearNight' },
      onClick: handleToggleTheme
    }
  ];

  return (
    <CommandBar
      items={leftSideitems}
      farItems={rightSideItems}
      ariaLabel="Use left and right arrow keys to navigate available resources"
    />
  );
}

export default withRouter(TopNavigation);
