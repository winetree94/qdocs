import { FunctionComponent } from 'react';
import { RecoilRoot } from 'recoil';
import './App.scss';
import { GlobalOverlayProvider } from './cdk/overlay/GlobalOverlay';
import { RootLayout } from './components/root-layout/RootLayout';

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
