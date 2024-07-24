import { RootState } from '@legacy/store';

export interface TemplateMeta {
  name: string;
  preview: string;
  getTemplate(): Promise<RootState>;
}

export const TEMPLATES: TemplateMeta[] = [
  {
    name: 'Empty',
    preview: '',
    getTemplate: () =>
      fetch('/assets/templates/empty.que').then((r) => r.json()),
  },
  {
    name: 'UX Flow',
    preview: '',
    getTemplate: () =>
      fetch('/assets/templates/ux-flow.que').then((r) => r.json()),
  },
  {
    name: 'Wave',
    preview: '',
    getTemplate: () =>
      fetch('/assets/templates/wave.que').then((r) => r.json()),
  },
  {
    name: 'Animated Text',
    preview: '',
    getTemplate: () =>
      fetch('/assets/templates/animated-text.que').then((r) => r.json()),
  },
  {
    name: 'Play',
    preview: '',
    getTemplate: () =>
      fetch('/assets/templates/play.que').then((r) => r.json()),
  },
  {
    name: 'conflictFlow',
    preview: '',
    getTemplate: () =>
      fetch('/assets/templates/conflict.que').then((r) => r.json()),
  },
];
