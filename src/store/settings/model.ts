import { EntityId } from '@reduxjs/toolkit';

export interface QueueDocumentSettings {
  /**
   * @description
   * 현재 열려있는 문서 id
   */
  documentId: EntityId;
  /**
   * @description
   * 현재 선택된 page id
   */
  pageId: EntityId;
  /**
   * @description
   * 현재 선택된 queue index
   */
  queueIndex: number;
  /**
   * @description
   * 애니메이션 시작 시간, 대게 performance.now() 를 사용
   */
  queueStart: number;
  /**
   * @description
   * 자동 재생 여부
   */
  autoPlay: boolean;
  /**
   * @description
   * 자동 재생 반복 여부
   */
  autoPlayRepeat: boolean;
  /**
   * @description
   * 애니메이션 재생의 방향 지정
   */
  queuePosition: 'forward' | 'backward' | 'pause';
  /**
   * @description
   * 선택 모드, detail 모드는 하나의 오브젝트만 선택 가능
   */
  selectionMode: 'normal' | 'detail';
  /**
   * @description
   * 선택된 오브젝트 id 목록
   */
  selectedObjectIds: EntityId[];
  /**
   * @description
   * 현재 문서의 스케일
   */
  scale: number;
  /**
   * @description
   * 프레젠테이션 모드 여부
   */
  presentationMode: boolean;

  /**
   * @description
   * 좌측 패널 열림 여부
   */
  leftPanelOpened: boolean;

  /**
   * @description
   * 하단 패널 열림 여부
   */
  bottomPanelOpened: boolean;
}
