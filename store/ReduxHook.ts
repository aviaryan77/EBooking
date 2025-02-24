// hooks.ts
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { IAppDispatch,  } from '.';
import { RootState } from './Index-Reducer';

export const useAppDispatch = () => useDispatch<IAppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
