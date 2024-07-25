import { RootLayout } from './app/RootLayout';
import { Provider } from 'react-redux';
import { store } from '@legacy/store';
import { EventDispatcherProvider } from '@legacy/cdk/hooks/event-dispatcher';
import { RootRendererProvider } from '@legacy/cdk/root-renderer/root-renderer';
import './i18n';

const App = () => {
  return (
    <Provider store={store}>
      <EventDispatcherProvider>
        <RootRendererProvider>
          <RootLayout />
        </RootRendererProvider>
      </EventDispatcherProvider>
    </Provider>
  );
};

export default App;
