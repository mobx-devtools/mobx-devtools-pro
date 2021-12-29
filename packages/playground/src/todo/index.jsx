/* eslint-disable react/prop-types */
import React, { useCallback } from 'react';
import { $mobx } from 'mobx';
import { observer } from 'mobx-react';
import { render } from 'react-dom';
import RootStore from './stores/RootStore';

/**
 * stores = {
 *   storeA: { a: 1 },
 *   storeB: { b: 2}
 * }
 */
const injectStores = stores => {
  // eslint-disable-next-line no-underscore-dangle
  window.__MOBX_DEVTOOLS_GLOBAL_STORES_HOOK__ = {
    stores,
    $mobx,
  };
};

const rootStore = new RootStore();

injectStores({ rootStore });

const TodoComponent = observer(function TodoComponent({ todo }) {
  return (
    <div>
      #{todo.id} <strong>{todo.title}</strong>
    </div>
  );
});

const TodoAppComponent = () => {
  const { todoStore } = rootStore;

  const handleInputKeydown = useCallback(e => {
    if (e.keyCode === 13) {
      todoStore.addTodo(e.target.value);
      e.target.value = '';
    }
  }, []);

  return (
    <div>
      {todoStore.todos.map(t => (
        <TodoComponent key={t.id} todo={t} />
      ))}
      <input type="test" onKeyDown={handleInputKeydown} />
    </div>
  );
};

const ObserverTodoAppComponent = observer(TodoAppComponent);

render(<ObserverTodoAppComponent />, document.querySelector('#root'));