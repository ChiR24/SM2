import { AppRegistry } from 'react-native';
import App from './App.web';
import appJson from '../app.json';

const appName = appJson.name;

// Register the app
AppRegistry.registerComponent(appName, () => App);

// Initialize web app
AppRegistry.runApplication(appName, {
  rootTag: document.getElementById('root'),
});
