import {
  SELECTOR_BALANCE_CHECKER_FORM,
} from "../constants";
import { BalanceCheckerForm } from "./balance_checker_form";

export class BalanceChecker {

  constructor(document, api, config) {
    this.document = document;
    this.api = api;
    this.config = config;

    this.initialise();
  }

  initialise() {
    this.debug('initialise()');

    const { document, api, config } = this;

    // define an event handler for page changes
    document.querySelectorAll(SELECTOR_BALANCE_CHECKER_FORM).forEach(formElement => {
      // skip if the form is already initialised
      if(formElement.dataset.givex === 'true') {
        return;
      }

      new BalanceCheckerForm(formElement, api, config);
    });
  }

  debug(...args) {
    if(!this.config.debug) {
      return;
    }

    console.log('[Givex Balance Checker]', ...args);
  }

}
