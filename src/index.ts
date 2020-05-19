import { Dispatch, SetStateAction, useState, useEffect, useCallback } from 'react';

export type UseGState<S = undefined> = () => [S | undefined, Dispatch<SetStateAction<S | undefined>>];

const createGState = <S = undefined>(initialState: S) => {
  // Global Shared State
  let innerState: S | undefined = initialState;
  const setters: Dispatch<SetStateAction<S | undefined>>[] = [];

  // Global state hook
  const useGlobalState: UseGState<S | undefined> = () => {
    // create react state manager
    const [globalState, setState] = useState(innerState);

    useEffect(() => {
      // add setter to our queue
      setters.push(setState);
      // remove setter after unmount
      return () => {
        const index = setters.indexOf(setState);
        setters.splice(index, 1);
      };
    }, []);

    const setGlobalState: Dispatch<SetStateAction<S | undefined>> = useCallback(
      (state: SetStateAction<S | undefined>) => {
        // keep track of global state
        innerState = state instanceof Function ? state(innerState) : state;
        // run setters on each update (clone to avoid unmount issues)
        [...setters].forEach((set) => {
          set(innerState);
        });
      },
      [],
    );

    return [globalState, setGlobalState];
  };
  return useGlobalState;
};

export default createGState;
