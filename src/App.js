import React from 'react';
import { Provider } from 'mobx-react';
import SettingsStore from './Stores/Settings';
import UserStore from './Stores/User';

import './App.css';
import GameScreen from './Containers/GameScreen/GameScreen';

function App() {
  return (
    <div className="App">
      <Provider 
        settings={SettingsStore}
        user={UserStore}
      >
        <GameScreen />
      </Provider>
    </div>
  );
}

export default App;
