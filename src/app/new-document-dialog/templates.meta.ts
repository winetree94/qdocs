import animatedTextUrl from 'assets/templates/animated-text.que';
import playUrl from 'assets/templates/play.que';
import colorSampleUrl from 'assets/templates/color-sample.que';
import uxFlowUrl from 'assets/templates/ux-flow.que';
import wave from 'assets/templates/wave.que';
import imageTest from 'assets/templates/image-test.que';
import groupTest from 'assets/templates/object-group.que';
import conflictFlow from 'assets/templates/conflict.que';
import { nanoid } from '@reduxjs/toolkit';
import { RootState } from 'store';

export interface TemplateMeta {
  name: string;
  preview: string;
  getTemplate(): Promise<RootState>;
}

export const TEMPLATES: TemplateMeta[] = [
  {
    name: 'Empty',
    preview: '',
    getTemplate: () => {
      const documentId = nanoid();
      const initPageId = nanoid();
      return Promise.resolve({
        document: {
          id: documentId,
          documentName: 'Untitled Document',
          documentRect: {
            width: 1920,
            height: 1080,
            fill: '#ffffff',
          },
        },
        pages: {
          ids: [initPageId],
          entities: {
            [initPageId]: {
              id: initPageId,
              documentId: documentId,
              pageName: 'Page-1',
              index: 0,
            },
          },
        },
        objects: {
          entities: {},
          ids: [],
        },
        effects: {
          entities: {},
          ids: [],
        },
      });
    },
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
  {
    name: 'Group test',
    preview: '',
    getTemplate: () => fetch(groupTest).then((r) => r.json()),
  },
  {
    name: 'conflictFlow',
    preview: '',
    getTemplate: () => fetch(conflictFlow).then((r) => r.json()),
  },
];
