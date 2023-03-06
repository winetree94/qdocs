import { RootLayout } from './app/root-layout/RootLayout';
import { Provider } from 'react-redux';
import { store } from 'store';
import { EventDispatcherProvider } from 'cdk/hooks/event-dispatcher';
import './i18n';
import './App.scss';
import 'tailwindcss/tailwind.css';

const App = () => {
  return (
    <Provider store={store}>
      <EventDispatcherProvider>
        <RootLayout></RootLayout>
      </EventDispatcherProvider>
    </Provider>
  );
};

export default App;
