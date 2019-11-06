import { decorate, observable, action, computed } from 'mobx';
import autoSave from './StoreAutoSave';

class Settings {
  constructor() {
    autoSave(this, 'SettingsStore');
  }

  server = null;

  setServer(serverId) {
    this.server = serverId;
  }
}

decorate(Settings, {
  server: observable,
  setServer: action,
})

const store = new Settings();

export default store; 