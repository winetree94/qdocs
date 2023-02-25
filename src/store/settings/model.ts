export interface QueueDocumentSettings {
  /**
   * @description
   * 현재 열려있는 문서 id
   */
  documentId: string;
  /**
   * @description
   * 현재 선택된 page id
   */
  pageId: string;
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
  selectedObjectIds: string[];
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
}
