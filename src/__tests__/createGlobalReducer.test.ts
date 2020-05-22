import { renderHook, act } from '@testing-library/react-hooks'
import createGlobalReducer, { UseGlobalReducerHook } from '../createGlobalReducer'
import { Dispatch, Reducer, ReducerState, ReducerAction } from 'react';

describe('RGState test suite', () => {
  const mockRender = <S extends Reducer<any, any>>(
    hook: UseGlobalReducerHook<S>
  ): [() => ReducerState<S> | undefined, Dispatch<ReducerAction<S>>] => {
    const { result } = renderHook(() => hook())
    const [_, dispatch] = result.current
    const state = () => result.current[0]
    return [state, dispatch]
  }

  type TypeCount = 'count'
  type TypeReset = 'reset'
  type SwitchType = number
  type ActionType = { type: TypeCount } | { type: TypeReset }
  type StateType = { switch: SwitchType } | undefined
  const countAction: ActionType = { type: 'count' }
  const resetAction: ActionType = { type: 'reset'}
  const initialState: StateType = { switch: 0 }
  const testReducer: Reducer<StateType, ActionType> = (prevState = initialState, action) => {
    if(action.type === "count") {
      return { switch: prevState.switch + 1 }
    }
    if(action.type === "reset") {
      return { switch: 0 }
    }
    return prevState
  }

  describe('use reducer initialization', () => {
    it('inits as undefined', () => {
      // given
      const useReducer = createGlobalReducer(testReducer, undefined);
      // when
      const [getState] = mockRender(useReducer)
      // then
      expect(getState()).toBeUndefined()
    })
    it('allows initialization', () => {
      // given
      const useReducer = createGlobalReducer(testReducer, initialState);
      // when
      const [getState] = mockRender(useReducer)
      // then
      expect(getState()).toEqual(initialState)
    })
    it('allows lazy initialization', () => {
      // given
      const useReducer = createGlobalReducer(testReducer, undefined, () => ({ switch: 0 }));
      // when
      const [getState] = mockRender(useReducer)
      // then
      expect(getState()).toEqual(initialState)
    })
    it('allows lazy initialization with params', () => {
      // given
      const useReducer = createGlobalReducer(testReducer, 0, (param: SwitchType) => ({ switch: param }));
      // when
      const [getState] = mockRender(useReducer)
      // then
      expect(getState()).toEqual(initialState)
    })
  })

  describe('using single component', () => {
    it('when state updated once then renders update', () => {
      // given
      const useReducer = createGlobalReducer(testReducer, initialState);
      const [getState, dispatch] = mockRender(useReducer)
      // when
      act(() => dispatch(countAction))
      // then
      expect(getState()).toEqual({ switch: 1 })

    });
    it('when state updated multiple times then renders each update', () => {
      // given
      const useReducer = createGlobalReducer(testReducer, initialState);
      const [getState, dispatch] = mockRender(useReducer)
      // when
      act(() => dispatch(countAction))
      act(() => dispatch(countAction))
      // then
      expect(getState()).toEqual({ switch: 2 })
    });
    it('when state updated using different actions then renders each update', () => {
      // given
      const useReducer = createGlobalReducer(testReducer, initialState);
      const [getState, dispatch] = mockRender(useReducer)
      // count
      act(() => dispatch(countAction))
      expect(getState()).toEqual({ switch: 1 })
      // reset
      act(() => dispatch(resetAction))
      expect(getState()).toEqual({ switch: 0 })
    });
  });

  describe('using two components', () => {
    it('when one updates state then both renders update', () => {
      // given
      const useReducer = createGlobalReducer(testReducer, initialState);
      const [get1, dispatch] = mockRender(useReducer)
      const [get2] = mockRender(useReducer)
      // when
      act(() => dispatch(countAction))
      //then
      expect(get1()).toEqual({ switch: 1 })
      expect(get2()).toEqual({ switch: 1 })
    });
    it('when other updates state then both enders update', () => {
      // given
      const useReducer = createGlobalReducer(testReducer, initialState);
      const [get1] = mockRender(useReducer)
      const [get2, dispatch] = mockRender(useReducer)
      // when
      act(() => dispatch(countAction))
      //then
      expect(get1()).toEqual({ switch: 1 })
      expect(get2()).toEqual({ switch: 1 })
    });
    it('when one updates and other updates state then both enders update twice ordered', () => {
      // given
      const useReducer = createGlobalReducer(testReducer, initialState);
      const [get1, dispatch1] = mockRender(useReducer)
      const [get2, dispatch2] = mockRender(useReducer)
      // update 1
      act(() => dispatch1(countAction))
      expect(get1()).toEqual({ switch: 1 })
      expect(get2()).toEqual({ switch: 1 })
      // update 2
      act(() => dispatch2(countAction))
      expect(get1()).toEqual({ switch: 2 })
      expect(get2()).toEqual({ switch: 2 })
    });
  });

  describe('using multiple components', () => {
    it('when one updates state then all render update', () => {
      // given
      const useReducer = createGlobalReducer(testReducer, initialState);
      const [get1, dispatch] = mockRender(useReducer)
      const [get2] = mockRender(useReducer)
      const [get3] = mockRender(useReducer)
      // when
      act(() => dispatch(countAction))
      //then
      expect(get1()).toEqual({ switch: 1 })
      expect(get2()).toEqual({ switch: 1 })
      expect(get3()).toEqual({ switch: 1 })
    });
    it('when other updates state then all enders update', () => {
      // given
      const useReducer = createGlobalReducer(testReducer, initialState);
      const [get1] = mockRender(useReducer)
      const [get2, dispatch] = mockRender(useReducer)
      const [get3] = mockRender(useReducer)
      // when
      act(() => dispatch(countAction))
      //then
      expect(get1()).toEqual({ switch: 1 })
      expect(get2()).toEqual({ switch: 1 })
      expect(get3()).toEqual({ switch: 1 })
    });
    it('when someone updates and someother updates state then all enders update twice ordered', () => {
      // given
      const useReducer = createGlobalReducer(testReducer, initialState);
      const [get1] = mockRender(useReducer)
      const [get2, dispatch2] = mockRender(useReducer)
      const [get3, dispatch3] = mockRender(useReducer)
      // update 1
      act(() => dispatch3(countAction))
      expect(get1()).toEqual({ switch: 1 })
      expect(get2()).toEqual({ switch: 1 })
      expect(get3()).toEqual({ switch: 1 })
      // update 1
      act(() => dispatch2(countAction))
      expect(get1()).toEqual({ switch: 2 })
      expect(get2()).toEqual({ switch: 2 })
      expect(get3()).toEqual({ switch: 2 })
    });
  });
});
