import { FunctionComponent } from 'react';
import { RecoilRoot } from 'recoil';
import { RootLayout } from './app/root-layout/RootLayout';

import 'tailwindcss/tailwind.css';
import './App.scss';
import { RecoilUndoRoot } from 'cdk/hooks/useUndo';

const App: FunctionComponent = () => {
  return (
    <RecoilRoot>
      <RecoilUndoRoot>
        <RootLayout></RootLayout>
      </RecoilUndoRoot>
    </RecoilRoot>
  );
};

export default App;
