import { EntityId } from '@reduxjs/toolkit';
import { AnimatorTimingFunctionType } from '@legacy/cdk/animation/timing/meta';
import { OBJECT_EFFECT_TYPES } from './meta';

export interface BaseQueueEffect<T> {
  /**
   * @description
   * 이펙트의 종류, 타입 추론을 위해 반드시 유일한 값을 사용
   */
  type: OBJECT_EFFECT_TYPES;

  /**
   * @description
   * 이펙트의 고유 아이디
   */
  id: EntityId;

  /*
   * @descriptioin
   * 이펙트의 대상이 되는 페이지의 고유 아이디
   */
  pageId: EntityId;

  /**
   * @description
   * 이펙트의 대상이 되는 객체의 고유 아이디
   */
  objectId: EntityId;

  /**
   * @description
   * 이펙트의 인덱스 (Queue Index)
   */
  index: number;

  /**
   * @description
   * 애니메이션 딜레이
   */
  delay: number;

  /**
   * @description
   * 애니메이션 지속 시간
   */
  duration: number;

  /**
   * @description
   * 애니메이션의 시간 대비 진행률을 계산하는 함수의 종류
   */
  timing: AnimatorTimingFunctionType;

  /**
   * @description
   * 애니메이션의 목표 속성
   */
  prop: T;
}
