import React, { useEffect, useRef, useState } from 'react';
import { createGlobalStyle } from 'styled-components';
import Blocker from './Blocker';
import Bridge from './Bridge';
import { StoreProvider, useStores } from './contexts/storesProvider';

export type AppProps = {
  quiet?: boolean;
  reloadSubscribe: any;
  inject: any;
  reload: any;
  children: React.ReactNode;
};

export const App = (props: AppProps) => {
  const { quiet, reloadSubscribe, inject, reload, children } = props;
  const { capabilitiesStore, actionsLoggerStore } = useStores();

  const [contentScriptInstallationError, setContentScriptInstallationError] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [connected, setConnected] = useState(false);
  const [mobxFound, setMobxFound] = useState(false);

  const unsubscribeReloadRef = useRef(undefined);
  const teardownWallRef = useRef(undefined);
  const disposablesRef = useRef([]);
  const unMountedRef = useRef(false);

  useEffect(() => {
    if (reloadSubscribe) {
      unsubscribeReloadRef.current = reloadSubscribe(() => reload());
    }
    inject((wall, teardownWall) => {
      teardownWallRef.current = teardownWall;
      const bridge = new Bridge(wall);
      capabilitiesStore.setBridge(bridge);

      disposablesRef.current.push(
        // @ts-ignore
        bridge.sub('capabilities', ({ mobxFound }) => {
          setMobxFound(mobxFound);
          bridge.send('request-stores');
          actionsLoggerStore.getPreferences();
        }),
        bridge.sub('content-script-installation-error', () => {
          setContentScriptInstallationError(true);
        }),
      );

      bridge.send('backend:ping');
      const connectInterval = setInterval(() => bridge.send('backend:ping'), 500);
      bridge.once('frontend:pong', () => {
        clearInterval(connectInterval);

        setConnected(true);
        bridge.send('get-capabilities');
      });

      if (!unMountedRef.current) {
        setLoaded(true);
      }
    });

    return () => {
      unMountedRef.current = true;
      reload();
    };
  }, []);

  const renderContent = () => {
    if (contentScriptInstallationError) {
      return <Blocker>Error while installing content-script</Blocker>;
    }
    if (!loaded) {
      return !quiet && <Blocker>Loading...</Blocker>;
    }
    if (!connected) {
      return !quiet && <Blocker>Connecting...</Blocker>;
    }
    if (mobxFound !== true) {
      return !quiet && <Blocker>Looking for mobx...</Blocker>;
    }
    return (
      <StoreProvider>
        <GlobalStyle />
        {React.Children.only(children)}
      </StoreProvider>
    );
  };

  return renderContent();
};

const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
  }
`;
