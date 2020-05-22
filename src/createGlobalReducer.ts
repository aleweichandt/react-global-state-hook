import createGlobalState from './createGlobalState'
import { useCallback, Reducer, ReducerState, ReducerAction, Dispatch } from 'react';

export type UseGlobalReducerHook<R extends Reducer<any, any>> = () => [ReducerState<R> | undefined, Dispatch<ReducerAction<R>>]

const createGlobalReducer = <R extends Reducer<any, any>, T>(
    reducer: R,
    initialState: T | ReducerState<R>,
    init: ((init: T) => ReducerState<R>) | undefined = undefined,
) => {
    const zeroState = !!init ? init(initialState as T) : initialState as ReducerState<R>;
    const useState = createGlobalState<ReducerState<R>>(zeroState)
    
    const useReducer: UseGlobalReducerHook<R> = () => {
        const [state, setState] = useState();
        const dispatch: Dispatch<ReducerAction<R>> = useCallback(
            (action) => { setState(prevState => reducer(prevState, action)) }, []
        )
        return [state, dispatch]
    }

    return useReducer
}

export default createGlobalReducer