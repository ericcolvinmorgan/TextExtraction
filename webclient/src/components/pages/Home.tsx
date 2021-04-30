import { IStackStyles, IStackTokens, Stack } from "@fluentui/react/lib/components/Stack";
import { Text } from '@fluentui/react/lib/components/Text';
import { FunctionComponent } from "react";

const Home: FunctionComponent = () => {
    const stackStyles: IStackStyles = {
        root: {
          width: `75%`,
          textAlign: 'left'
        },
      };

    const stackTokens: IStackTokens = { childrenGap: 10 };
    
    return (
        <Stack gap={0} horizontalAlign="center">
            <Text variant="xxLarge">
                Welcome to Your Document Management Center! 
            </Text>
            <Stack styles={stackStyles} tokens={stackTokens} horizontalAlign="start">
            <Text variant="large">Please login to manage your documents and templates.  Account management functionalities are located in the top right.  Once you are logged in you will be able to access a menu of options by clicking the menu button on the top left.</Text>
            </Stack>
        </Stack>
    )
}

export default Home;