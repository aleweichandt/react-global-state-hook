import { renderHook, act } from '@testing-library/react-hooks'
import createGState, { UseGlobalStateHook } from '../createGlobalState'
import { Dispatch, SetStateAction } from 'react';

describe('RGState test suite', () => {
  const mockRender = <S>(hook: UseGlobalStateHook<S>): [() => S | undefined, Dispatch<SetStateAction<S | undefined>>] => {
    const { result } = renderHook(() => hook())
    const [_, setter] = result.current
    const getter = () => result.current[0]
    return [getter, setter]
  }

  describe('use state behavior', () => {
    it('allows type state change', () => {
      // given
      const useState = createGState<number>(0);
      const [getCounter, setCounter] = mockRender(useState)
      // when
      act(() => setCounter(1))
      // then
      expect(getCounter()).toEqual(1)
    })
    it('allows function state change', () => {
      // given
      const useState = createGState<number>(0);
      const [getCounter, setCounter] = mockRender(useState)
      // when
      act(() => setCounter((s = 0) => s + 1))
      // then
      expect(getCounter()).toEqual(1)
    })
  })

  describe('numeric state type', () => {
    it('when start as undefined then initial state is undefined', () => {
      // when
      const useState = createGState<number>(undefined);
      const [getCounter] = mockRender(useState)
      // then
      expect(getCounter()).toBeUndefined()
    })
    it('when update from undefined then allows state of type', () => {
      // given
      const useState = createGState<number>(undefined);
      const [getCounter, setCounter] = mockRender(useState)
      // when
      act(() => setCounter(0))
      // then
      expect(getCounter()).toEqual(0)
    })
    it('when update to undefined then allows undefined state', () => {
      // given
      const useState = createGState<number>(0);
      const [getCounter, setCounter] = mockRender(useState)
      // when
      act(() => setCounter(undefined))
      // then
      expect(getCounter()).toBeUndefined()
    })
  })

  describe('string state type', () => {
    it('when start as undefined then initial state is undefined', () => {
      // when
      const useState = createGState<string>(undefined);
      const [getCounter] = mockRender(useState)
      // then
      expect(getCounter()).toBeUndefined()
    });
    it('when update from undefined then allows state of type', () => {
      // given
      const useState = createGState<string>(undefined);
      const [getCounter, setCounter] = mockRender(useState)
      // when
      act(() => setCounter("test"))
      // then
      expect(getCounter()).toEqual("test")
    });
    it('when update to undefined then allows undefined state', () => {
      // given
      const useState = createGState<string>("test");
      const [getCounter, setCounter] = mockRender(useState)
      // when
      act(() => setCounter(undefined))
      // then
      expect(getCounter()).toBeUndefined()
    });
  });

  describe('object state type', () => {
    it('when start as undefined then initial state is undefined', () => {
      // when
      const useState = createGState<{ test : number}>(undefined);
      const [getCounter] = mockRender(useState)
      // then
      expect(getCounter()).toBeUndefined()
    });
    it('when update from undefined then allows state of type', () => {
      // given
      const useState = createGState<{ test : number}>(undefined);
      const [getCounter, setCounter] = mockRender(useState)
      // when
      act(() => setCounter({ test: 0 }))
      // then
      expect(getCounter()).toEqual({ test: 0 })
    });
    it('when update to undefined then allows undefined state', () => {
      // given
      const useState = createGState<{ test : number}>({ test: 0 });
      const [getCounter, setCounter] = mockRender(useState)
      // when
      act(() => setCounter(undefined))
      // then
      expect(getCounter()).toBeUndefined()
    });
  });

  describe('array state type', () => {
    it('when start as undefined then initial state is undefined', () => {
      // when
      const useState = createGState<number[]>(undefined);
      const [getCounter] = mockRender(useState)
      // then
      expect(getCounter()).toBeUndefined()
    });
    it('when update from undefined then allows state of type', () => {
      // given
      const useState = createGState<number[]>(undefined);
      const [getCounter, setCounter] = mockRender(useState)
      // when
      act(() => setCounter([0]))
      // then
      expect(getCounter()).toEqual([0])
    });
    it('when update to undefined then allows undefined state', () => {
      // given
      const useState = createGState<number[]>([0]);
      const [getCounter, setCounter] = mockRender(useState)
      // when
      act(() => setCounter(undefined))
      // then
      expect(getCounter()).toBeUndefined()
    });
  });

  describe('using single component', () => {
    it('when state updated once then renders update', () => {
      // given
      const useState = createGState(0);
      const [getCounter, setCounter] = mockRender(useState)
      // when
      act(() => setCounter(1))
      //then
      expect(getCounter()).toEqual(1)

    });
    it('when state updated multiple times then renders each update', () => {
      // given
      const useState = createGState(0);
      const [getCounter, setCounter] = mockRender(useState)
      // when
      act(() => setCounter(1))
      act(() => setCounter(2))
      //then
      expect(getCounter()).toEqual(2)
    });
  });

  describe('using two components', () => {
    it('when one updates state then both renders update', () => {
      // given
      const useState = createGState(0);
      const [get1, setCounter] = mockRender(useState)
      const [get2] = mockRender(useState)
      // when
      act(() => setCounter(1))
      //then
      expect(get1()).toEqual(1)
      expect(get2()).toEqual(1)
    });
    it('when other updates state then both enders update', () => {
      // given
      const useState = createGState(0);
      const [get1] = mockRender(useState)
      const [get2, setCounter] = mockRender(useState)
      // when
      act(() => setCounter(1))
      //then
      expect(get1()).toEqual(1)
      expect(get2()).toEqual(1)
    });
    it('when one updates and other updates state then both enders update twice ordered', () => {
      // given
      const useState = createGState(0);
      const [get1, set1] = mockRender(useState)
      const [get2, set2] = mockRender(useState)
      // update 1
      act(() => set1(1))
      expect(get1()).toEqual(1)
      expect(get2()).toEqual(1)
      // update 2
      act(() => set2(2))
      expect(get1()).toEqual(2)
      expect(get2()).toEqual(2)
    });
  });

  describe('using multiple components', () => {
    it('when one updates state then all render update', () => {
      // given
      const useState = createGState(0);
      const [get1, setCounter] = mockRender(useState)
      const [get2] = mockRender(useState)
      const [get3] = mockRender(useState)
      // when
      act(() => setCounter(1))
      //then
      expect(get1()).toEqual(1)
      expect(get2()).toEqual(1)
      expect(get3()).toEqual(1)
    });
    it('when other updates state then all enders update', () => {
      // given
      const useState = createGState(0);
      const [get1] = mockRender(useState)
      const [get2, setCounter] = mockRender(useState)
      const [get3] = mockRender(useState)
      // when
      act(() => setCounter(1))
      //then
      expect(get1()).toEqual(1)
      expect(get2()).toEqual(1)
      expect(get3()).toEqual(1)
    });
    it('when someone updates and someother updates state then all enders update twice ordered', () => {
      // given
      const useState = createGState(0);
      const [get1] = mockRender(useState)
      const [get2, set2] = mockRender(useState)
      const [get3, set3] = mockRender(useState)
      // update 1
      act(() => set3(1))
      expect(get1()).toEqual(1)
      expect(get2()).toEqual(1)
      expect(get3()).toEqual(1)
      // update 2
      act(() => set2(2))
      expect(get1()).toEqual(2)
      expect(get2()).toEqual(2)
      expect(get3()).toEqual(2)
    });
  });
});
