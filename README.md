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

const useGlobalCounter = createGState(0);

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

---

## Usage

First step is to create your global state.

```javascript
const useState = createGState();
```

After created, all you need is to use it as with React `useState` hook. Same interface is supported

```javascript
import useState from "my-global-state-path"

...
const [state, setState] = useState()
```

---

## Benefits

* Comes with typescript support ++
* Built with react hooks only. No magic here ++
* Proved to work with multiple react instances (microforntends) across same env ++
