import {PolymerElement, html} from '@polymer/polymer/polymer-element.js';
import '@polymer/iron-pages/iron-pages.js';

import './login';
import './logout';

class App extends PolymerElement {
  static get properties() { return {
    state: String,
  }}

  constructor() {
    super();
    authApp.init(this);
  }

  apply(state, payload) {
    this.state = state;
    switch (state) {
      case 'init':
        break;
      case 'loginForm':
        if (payload && payload.message)
          App.toast(payload.message);
        break;
      case 'home':
        break;
    }
  }

  static get template () {
    return html`
      <iron-pages selected="[[state]]" attr-for-selected="state">
        <ng-login state="loginForm"></ng-login>
        <div state="loginProcess">Logging in...</div>
        <ng-logout state="home"></ng-logout>
      </iron-pages>
    `;
  }

  static toast(message) {
    console.log(message);
  }
}

customElements.define('ng-auth-app', App);
