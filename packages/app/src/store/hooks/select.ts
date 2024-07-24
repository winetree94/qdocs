import { TypedUseSelectorHook, useSelector } from 'react-redux';
import { RootState } from '@legacy/store';

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
