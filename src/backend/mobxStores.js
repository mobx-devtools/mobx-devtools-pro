export default bridge => {
  const disposables = [
    bridge.sub('request-stores', () => {
      // eslint-disable-next-line no-underscore-dangle
      const storesHook = window.__MOBX_DEVTOOLS_GLOBAL_STORES_HOOK__;
      bridge.send('update-stores', storesHook && storesHook.stores);
    }),
  ];

  return {
    setup(mobxid, collection) {},
    dispose() {
      disposables.forEach(fn => fn());
    },
  };
};
