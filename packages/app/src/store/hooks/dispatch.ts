import { useDispatch } from 'react-redux';
import { AppDispatch } from '@legacy/store';

export const useAppDispatch: () => AppDispatch = useDispatch;
