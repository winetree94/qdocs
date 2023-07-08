import { QueueDocument } from 'model/document';
import animatedTextUrl from 'assets/templates/animated-text.que';
import playUrl from 'assets/templates/play.que';
import colorSampleUrl from 'assets/templates/color-sample.que';
import uxFlowUrl from 'assets/templates/ux-flow.que';
import wave from 'assets/templates/wave.que';
import imageTest from 'assets/templates/image-test.que';
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
        documentName: 'Untitled Document',
        documentRect: {
          width: 1920,
          height: 1080,
          fill: '#ffffff',
        },
        pages: [
          {
            id: nanoid(),
            pageName: 'Page-1',
            objects: [],
          },
        ],
      }),
  },
  {
    name: 'UX Flow',
    preview: '',
    getTemplate: () => fetch(uxFlowUrl).then((r) => r.json()),
  },
  {
    name: 'Wave',
    preview: '',
    getTemplate: () => fetch(wave).then((r) => r.json()),
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
  {
    name: 'Color Sample',
    preview: '',
    getTemplate: () => fetch(colorSampleUrl).then((r) => r.json()),
  },
  {
    name: 'Image test',
    preview: '',
    getTemplate: () => fetch(imageTest).then((r) => r.json()),
  },
];
