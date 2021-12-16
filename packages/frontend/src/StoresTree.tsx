import React from 'react';
import ReactJson from 'react-json-view';
import styled from 'styled-components';
import { PRIMARY_BG_COLOR } from './constant/color';
import { Stores } from './stores/StoresStore';
import injectStores from './utils/injectStores';

export type StoresTreeProps = {
  storesStore: Stores;
  requestStores: () => void;
};

const StoresTreeBase = (props: StoresTreeProps) => {
  const { storesStore, requestStores } = props;

  const handleRefresh = () => {
    requestStores();
  };

  if (storesStore.noInject) {
    return (
      <TipContainer>
        If you want to use State, please refer to this{' '}
        <a
          href="https://www.npmjs.com/package/@mobx-devtools/tools"
          target="_blank"
        >
          document
        </a>
        , and then inject stores of application.
      </TipContainer>
    );
  }

  return (
    <Container>
      <ReactJsonContainer>
        {Object.entries(storesStore.stores).map(([storeName, store], index) => {
          return (
            <ReactJson
              key={`${storeName}-${index}`}
              name={storeName}
              src={store}
              indentWidth={2}
              collapsed
              displayDataTypes={false}
              displayObjectSize={false}
              enableClipboard={false}
              quotesOnKeys={false}
              style={{ fontSize: 14 }}
            />
          );
        })}
      </ReactJsonContainer>

      <RefreshButton onClick={handleRefresh}>Refresh</RefreshButton>
    </Container>
  );
};

export const StoresTree = injectStores({
  subscribe: {
    storesStore: ['updateStores'],
  },
  // @ts-ignore
  injectProps: ({ storesStore }) => ({
    storesStore,
    requestStores: storesStore.requestStores,
  }),
})(StoresTreeBase);

const TipContainer = styled.div`
  padding: 16px;
`;

const Container = styled.div`
  height: 100%;
  position: relative;
`;

const RefreshButton = styled.button`
  width: 60px;
  height: 24px;
  position: absolute;
  right: 16px;
  top: 16px;
  color: #323d4c;
  background-color: #fff;
  border: 1px solid #d9d9d9;
  border-radius: 2px;
  font-size: 12px;
  cursor: pointer;
  transition: 0.1s;
  &:hover {
    background-color: ${PRIMARY_BG_COLOR};
    opacity: 0.9;
    color: #fff;
    border-color: ${PRIMARY_BG_COLOR};
  }
  &:active {
    opacity: 1;
  }
`;

const ReactJsonContainer = styled.div`
  height: 100%;
  overflow: auto;
  padding: 16px;
`;
