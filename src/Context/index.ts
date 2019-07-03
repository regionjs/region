import { createContext as createReactContext, useContext as useReactContext, Context as ReactContext } from 'react';
import createRegion, { Region } from '../createRegion/createRegion';

export const createContext = (defaultValue: any) => {
  const symbol = Symbol();
  const Context = createReactContext(symbol) as any;
  const region = createRegion(defaultValue);
  Context.write = region.set;
  Context.read = region.getValue;
  Context.symbol = symbol;
  Context.region = region;
  return Context;
};

interface ContextType extends ReactContext<any> {
  symbol: Symbol;
  region: Region;
}

export const useContext = (Context: ContextType) => {
  const { region, symbol } = Context;
  const providedValue = useReactContext(Context);
  const value = region.useValue();
  if (providedValue === symbol) {
    return value;
  }
  return providedValue;
};
