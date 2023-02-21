import { FunctionComponent } from 'react';
import { RootLayout } from './app/root-layout/RootLayout';
import { Provider } from 'react-redux';

import 'tailwindcss/tailwind.css';
import './App.scss';
import { store } from 'store';
import { EventDispatcherProvider } from 'cdk/hooks/event-dispatcher';

const App: FunctionComponent = () => {
  return (
    <Provider store={store}>
      <EventDispatcherProvider>
        <RootLayout></RootLayout>
      </EventDispatcherProvider>
    </Provider>
  );
};

export default App;
