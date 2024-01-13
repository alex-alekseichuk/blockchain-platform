import {PolymerElement, html} from '@polymer/polymer/polymer-element.js';

class LogoutForm extends PolymerElement {
  static get template () {
    return html`
      <button on-click="onLogoutClick">Logout</button>      
    `;
  }

  onLogoutClick() {
    authApp.sm.action('logout');
  }
}

customElements.define('ng-logout', LogoutForm);
