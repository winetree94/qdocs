import { FunctionComponent } from 'react';
import clsx from 'clsx';
import { useRecoilState } from 'recoil';
import { Input } from '../../components/input/Input';
import { Object } from '../../components/object/Object';
import { ObjectGrid } from '../../components/object/ObjectGrid';
import { ObjectGroup } from '../../components/object/ObjectGroup';
import { ObjectGroupTitle } from '../../components/object/ObjectGroupTitle';
import { documentSettingsState } from '../../store/settings';
import { documentState } from '../../store/document';
import { generateUUID } from '../../cdk/functions/uuid';
import styles from './LeftPanel.module.scss';

export const LeftPanel: FunctionComponent = () => {
  const [queueDocument, setQueueDocument] = useRecoilState(documentState);
  const [settings, setSettings] = useRecoilState(documentSettingsState);

  const createSquare = (): void => {
    const uuid = generateUUID();
    const width = 300;
    const height = 300;
    setQueueDocument({
      ...queueDocument!,
      objects: [
        ...queueDocument!.objects,
        {
          type: 'rect',
          uuid: uuid,
          rect: {
            x: queueDocument!.documentRect.width / 2 - width / 2,
            y: queueDocument!.documentRect.height / 2 - height / 2,
            width: width,
            height: height,
          },
          stroke: {
            width: 1,
            color: '#000000',
            dasharray: 'solid',
          },
          fill: {
            color: '#ffffff',
          },
          scale: {
            scale: 1,
          },
          rotate: {
            x: 0,
            y: 0,
            position: 'forward',
            degree: 0,
          },
          fade: {
            opacity: 1,
          },
          text: {
            text: 'Hello World',
            fontSize: 24,
            fontColor: '#000000',
            fontFamily: 'Arial',
            horizontalAlign: 'center',
            verticalAlign: 'middle',
          },
          effects: [
            {
              type: 'create',
              timing: 'linear',
              duration: 0,
              index: settings.queueIndex,
            },
          ],
        },
      ],
    });
    setSettings({
      ...settings,
      selectedObjectUUIDs: [uuid],
    });
  };

  const createCircle = (): void => {
    const uuid = generateUUID();
    const width = 300;
    const height = 300;
    setQueueDocument({
      ...queueDocument!,
      objects: [
        ...queueDocument!.objects,
        {
          type: 'circle',
          uuid: uuid,
          rect: {
            x: queueDocument!.documentRect.width / 2 - width / 2,
            y: queueDocument!.documentRect.height / 2 - height / 2,
            width: width,
            height: height,
          },
          stroke: {
            width: 1,
            color: '#000000',
            dasharray: 'solid',
          },
          fill: {
            color: '#ffffff',
          },
          scale: {
            scale: 1,
          },
          rotate: {
            x: 0,
            y: 0,
            position: 'forward',
            degree: 0,
          },
          fade: {
            opacity: 1,
          },
          text: {
            text: 'Hello World',
            fontSize: 24,
            fontColor: '#000000',
            fontFamily: 'Arial',
            horizontalAlign: 'center',
            verticalAlign: 'middle',
          },
          effects: [
            {
              type: 'create',
              timing: 'linear',
              duration: 0,
              index: settings.queueIndex,
            },
          ],
        },
      ],
    });
    setSettings({
      ...settings,
      selectedObjectUUIDs: [uuid],
    });
  };

  return (
    <div className={clsx(styles.container)}>
      <Input placeholder="Search Shape" className={styles.input}></Input>
      <ObjectGroup>
        <ObjectGroupTitle>Group Title</ObjectGroupTitle>
        <ObjectGrid>
          <Object onClick={createSquare}>
            <svg
              version="1.1"
              baseProfile="full"
              xmlns="http://www.w3.org/2000/svg"
              className={styles.canvas}
            >
              <g>
                <rect
                  width="30"
                  height="30"
                  stroke="black"
                  strokeWidth="4"
                  fill="transparent"
                />
              </g>
            </svg>
          </Object>
          <Object onClick={createCircle}>
            <svg
              version="1.1"
              baseProfile="full"
              xmlns="http://www.w3.org/2000/svg"
              className={styles.canvas}
            >
              <g>
                <circle cx="15" cy="15" r="13" stroke="black" strokeWidth="2" fill="transparent" />
              </g>
            </svg>
          </Object>
        </ObjectGrid>
      </ObjectGroup>
      <ObjectGroup>
        <ObjectGroupTitle>Group Title</ObjectGroupTitle>
        <ObjectGrid>
          <Object>Obj1</Object>
          <Object>Obj1</Object>
          <Object>Obj1</Object>
          <Object>Obj1</Object>
          <Object>Obj1</Object>
          <Object>Obj1</Object>
          <Object>Obj1</Object>
          <Object>Obj1</Object>
          <Object>Obj1</Object>
        </ObjectGrid>
      </ObjectGroup>
    </div>
  );
};
