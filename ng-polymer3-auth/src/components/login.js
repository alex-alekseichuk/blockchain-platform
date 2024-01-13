import {PolymerElement, html} from '@polymer/polymer/polymer-element.js';

class LoginForm extends PolymerElement {
  static get template () {
    return html`
      <div>Login: <input type="text" id="txtLogin" /></div>      
      <div>Password: <input type="password" id="txtPassword" /></div>
      <div><input type="checkbox" id="chkRemember" /> Remember</div>
      <div><input type="checkbox" id="chkIsLdap" /> LDAP</div>
      <div><button on-click="onLoginClick">Login</button></div>      
    `;
  }

  onLoginClick() {
    authApp.sm.action('login', {
      username: this.$.txtLogin.value,
      password: this.$.txtPassword.value,
      remember_me: this.$.chkRemember.checked,
      isLdap: this.$.chkIsLdap.checked
    });
  }
}

customElements.define('ng-login', LoginForm);
