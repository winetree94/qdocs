import { FunctionComponent } from 'react';
import { RootLayout } from './app/root-layout/RootLayout';
import { Provider } from 'react-redux';

import 'tailwindcss/tailwind.css';
import './App.scss';
import { store } from 'store';

const App: FunctionComponent = () => {
  return (
    <Provider store={store}>
      <RootLayout></RootLayout>
    </Provider>
  );
};

export default App;
