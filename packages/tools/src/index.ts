import { $mobx } from 'mobx';

export type Stores = {
  [storeName: string]: Object;
};

export type StoresHook = {
  stores: Stores;
  $mobx: Symbol;
};

declare var window: {
  __MOBX_DEVTOOLS_GLOBAL_STORES_HOOK__: StoresHook;
};

export const injectStores = (rootStore: Stores) => {
  // eslint-disable-next-line no-underscore-dangle
  window.__MOBX_DEVTOOLS_GLOBAL_STORES_HOOK__ = { stores: rootStore, $mobx };
  return rootStore;
};
