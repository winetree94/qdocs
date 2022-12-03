import { FunctionComponent } from 'react';
import logo from './logo.svg';
import './App.scss';
import { RecoilRoot } from 'recoil';

const App: FunctionComponent<{}> = () => {
  return (
    <RecoilRoot>
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.tsx</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div>
    </RecoilRoot>
  );
};

export default App;
