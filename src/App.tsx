import { RootLayout } from './app/root-layout/RootLayout';
import { Provider } from 'react-redux';
import { store } from 'store';
import { EventDispatcherProvider } from 'cdk/hooks/event-dispatcher';
import { RootRendererProvider } from 'cdk/root-renderer/root-renderer';
import './i18n';
import './App.scss';
import 'tailwindcss/tailwind.css';

const App = () => {
  return (
    <Provider store={store}>
      <RootRendererProvider>
        <EventDispatcherProvider>
          <RootLayout></RootLayout>
        </EventDispatcherProvider>
      </RootRendererProvider>
    </Provider>
  );
};

export default App;
