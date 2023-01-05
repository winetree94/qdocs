import { FunctionComponent } from 'react';
import { RecoilRoot } from 'recoil';
import { GlobalOverlayProvider } from './cdk/overlay/GlobalOverlay';
import { RootLayout } from './app/root-layout/RootLayout';

import 'tailwindcss/tailwind.css';
import './App.scss';

const App: FunctionComponent = () => {
  return (
    <RecoilRoot>
      <GlobalOverlayProvider>
        <RootLayout></RootLayout>
      </GlobalOverlayProvider>
    </RecoilRoot>
  );
};

export default App;
