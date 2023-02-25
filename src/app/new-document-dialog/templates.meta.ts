import { QueueDocument } from 'model/document';
import animatedTextUrl from 'assets/templates/animated-text.que';
import playUrl from 'assets/templates/play.que';
import { nanoid } from '@reduxjs/toolkit';

export interface TemplateMeta {
  name: string;
  preview: string;
  getTemplate(): Promise<QueueDocument>;
}

export const TEMPLATES: TemplateMeta[] = [
  {
    name: 'Empty',
    preview: '',
    getTemplate: () =>
      Promise.resolve({
        id: nanoid(),
        documentName: '새 문서',
        documentRect: {
          width: 1920,
          height: 1080,
          fill: '#ffffff',
        },
        pages: [
          {
            id: nanoid(),
            pageName: '새 페이지',
            objects: [],
          },
        ],
      }),
  },
  {
    name: 'Animated Text',
    preview: '',
    getTemplate: () => fetch(animatedTextUrl).then((r) => r.json()),
  },
  {
    name: 'Play',
    preview: '',
    getTemplate: () => fetch(playUrl).then((r) => r.json()),
  },
];
