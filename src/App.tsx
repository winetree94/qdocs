import { FunctionComponent } from 'react';
import { RecoilRoot } from 'recoil';
import { RootLayout } from './app/root-layout/RootLayout';

import 'tailwindcss/tailwind.css';
import './App.scss';

const App: FunctionComponent = () => {
  return (
    <RecoilRoot>
      <RootLayout></RootLayout>
    </RecoilRoot>
  );
};

export default App;
