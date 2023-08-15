import { EntityId } from '@reduxjs/toolkit';
import { OBJECT_TYPES } from './meta';

export interface BaseObject {
  /**
   * @description
   * 오브젝트 종류, 타입 추론을 위해 반드시 유일한 값을 사용
   */
  type: OBJECT_TYPES;

  /**
   * @description
   * 오브젝트의 고유 id
   */
  id: EntityId;

  /**
   * @description
   * 오브젝트의 우선 순위, 겹쳐진 문체는 index 우선 순위로 정렬
   */
  index: number;

  /**
   * @description
   * 오브젝트가 속한 페이지의 고유 id
   */
  pageId: EntityId;
}
