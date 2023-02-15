import { QueueDocument } from 'model/document';
import { atom } from 'recoil';

/**
 * @description
 * 문서 원본 형식
 */
export const documentState = atom<QueueDocument | null>({
  key: 'documentState',
  default: null,
  effects: [
    ({ setSelf, onSet }): void => {
      onSet((newValue) => {
        // console.log(newValue);
      });
    }
  ]
});
