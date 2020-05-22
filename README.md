# Mate State

Mate State is just global state hook made as simple as possible.

This library allows to share a `useState` or `useReducer` hook across several components.

---

## Install

```shell
npm i -s mate-state
```

---

# UseState Hook

## Minimal example:

```javascript
import React from 'react';
import { createGlobalState } from 'mate-state';

const useGlobalCounter = createGlobalState(0);

const App = () => {
  const [counter, setCounter] = useGlobalCounter();
  return (
    <div>
      <p>
        counter:
        {counter}
      </p>
      <button type="button" onClick={() => setCounter((c) => c + 1)}>
        +1 to global
      </button>
    </div>
  );
};

export default App;
```

## Usage

First step is to create your global state.

```javascript
const useState = createGState();
```

After created, all you need is to use it as with React `useState` hook. Same interface is supported.

```javascript
import useState from "my-global-state-path"

...
const [state, setState] = useState()
```

---

# UseReducer Hook

## Minimal example:

```javascript
import React from 'react';
import { createGlobalReducer } from 'mate-state';

// Reducer
const initialState = { counter: 0 };
const reducer = (state = initialState, action) => {
  switch(action.type) {
    case 'count':
      return { counter: state.counter + 1 };
    case 'reset':
      return { counter: 0 };
    default:
      return state;
  }
}

// Global reducer hook
const useCounterReducer = createGlobalReducer(reducer, initialState);

const App = () => {
  const [state, dispatch] = useCounterReducer();
  return (
    <div>
      <p>
        counter:
        {state.counter}
      </p>
      <button type="button" onClick={() => dispatch({ type: 'count' })}>
        +1 to global
      </button>
      <button type="button" onClick={() => dispatch({ type: 'reset' })}>
        reset global
      </button>
    </div>
  );
};

export default App;
```

## Usage

First step is to create your global reducer.

```javascript
import { reducer, initialState } from "my-reducer-logic-path"
const useCounterReducer = createGlobalReducer(reducer, initialState);
```

After created, all you need is to use it as with React `useReducer` hook. Same interface is supported.

```javascript
import useReducer from "my-global-reducer-path"

...
const [state, dispatch] = useReducer()
```

---

## Benefits

* Comes with typescript support ++
* Built with react hooks only. No magic here ++
* Proved to work with multiple react instances (microforntends) across same env ++
