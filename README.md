# RGState

React global state hook made as simple as possible.

This library allows to share a `useState` hook across several components.

---

## Install

```shell
npm i -s rgstate
```

## Minimal example:

```javascript
import React from 'react';
import createGState from 'rgstate';

const globalCounterState = {
  counter: 0,
};

const useGlobalCounter = createGState(globalCounterState);

const App = () => {
  const [counter, setCounter] = useGlobalCounter();
  return (
    <div>
      <p>
        counter:
        {counter}
      </p>
      <button type="button" onClick={() => setCounter({ counter: counter + 1 })}>
        +1 to global
      </button>
    </div>
  );
};

export default App;
```