import styles from './style.css';
import tmpl from './app.pug';

export default class App {
  constructor() {
    console.log('new app');
    console.log(tmpl());
  }

  render() {
    document.querySelector('#root').appendChild(tmpl());
  }
}
