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
      <EventDispatcherProvider>
        <RootRendererProvider>
          <RootLayout />
        </RootRendererProvider>
      </EventDispatcherProvider>
    </Provider>
  );
};

export default App;
