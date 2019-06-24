import { createContext as createReactContext, useContext as useReactContext } from 'react';
import Prop from '../Prop';

export const createContext = (defaultValue: any) => {
  const symbol = Symbol();
  const Context = createReactContext(symbol) as any;
  const region = new Prop('data');
  region.set(defaultValue);
  Context.write = region.set;
  Context.read = region.getValue;
  Context.symbol = symbol;
  Context.region = region;
  return Context;
};

export const useContext = (Context: any) => {
  const { region, symbol } = Context;
  const providedValue = useReactContext(Context);
  const value = region.useValue();
  if (providedValue === symbol) {
    return value;
  }
  return providedValue;
};
