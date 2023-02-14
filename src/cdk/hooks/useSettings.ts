import { useRecoilState } from 'recoil';
import { documentSettingsState, QueueDocumentSettings } from 'store/settings';

export interface UseSettingsHook {
  settings: QueueDocumentSettings;

  /**
   * @description
   * 현재 큐 변경
   *
   * @param index - 변경할 큐 인덱스
   * @param play - 변경할 큐 인덱스로 이동했을 때 애니메이션 재생 여부
   */
  setQueueIndex: (index: number, play: boolean) => void;

  /**
   * @description
   * 현재 큐 페이지 변경
   *
   * @param index - 변경할 큐 페이지 인덱스
   */
  setQueuePageIndex: (index: number) => void;

  /**
   * @description
   * 오브젝트를 일반 모드로 단일 & 다중 선택
   *
   * @param uuids - 변경할 오브젝트 UUID 목록
   */
  setSelectedObjectUUIDs: (uuids: string[]) => void;

  /**
   * @description
   * 애니메이션 재생 중지
   */
  stopAnimation: () => void;

  /**
   * @description
   *
   * 오브젝트를 상세 모드로 단일 선택
   *
   * @param uuid - 선택할 오브젝트 UUID
   */
  setDetailSettingMode: (uuid: string) => void;

  /**
   * @description
   * 스케일 변경
   * @param scale - 변경할 스케일
   */
  setScale: (scale: number) => void;

  /**
   * @description
   * 프레젠테이션 모드 변경
   * @param presentationMode - 변경할 프레젠테이션 모드
   * @default false
   */
  setPresentationMode: (presentationMode: boolean) => void;
}

export const useSettings = (): UseSettingsHook => {
  const [settings, setSettings] = useRecoilState(documentSettingsState);

  const setQueueIndex = (index: number, play?: boolean): void => {
    setSettings({
      ...settings,
      queueIndex: index,
      queuePosition: settings.queueIndex < index ? 'forward' : 'backward',
      queueStart: play ? performance.now() : -1,
      selectedObjectUUIDs: [],
      selectionMode: 'normal',
    });
  };

  const setQueuePageIndex = (index: number): void => {
    setSettings({
      ...settings,
      queuePage: index,
      queueStart: -1,
      queuePosition: 'pause',
      selectedObjectUUIDs: [],
      selectionMode: 'normal',
    });
  };

  const setSelectedObjectUUIDs = (uuids: string[]): void => {
    setSettings({
      ...settings,
      selectionMode: 'normal',
      selectedObjectUUIDs: uuids,
    });
  };

  const setDetailSettingMode = (uuid: string): void => {
    setSettings({
      ...settings,
      selectionMode: 'detail',
      selectedObjectUUIDs: [uuid],
    });
  };

  const stopAnimation = (): void => {
    setSettings({
      ...settings,
      queueStart: -1,
    });
  };

  const setScale = (scale: number): void => {
    setSettings({
      ...settings,
      scale: Math.max(scale, 0.1),
    });
  };

  const setPresentationMode = (presentationMode: boolean): void => {
    setSettings({
      ...settings,
      presentationMode,
    });
  };

  return {
    settings,
    setQueueIndex,
    setQueuePageIndex,
    setSelectedObjectUUIDs,
    setDetailSettingMode,
    stopAnimation,
    setScale,
    setPresentationMode,
  };
};
