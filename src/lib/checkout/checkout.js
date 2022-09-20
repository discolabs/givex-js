import {
  SELECTOR_REDUCTION_FORM,
  STEP_CONTACT_INFORMATION,
  STEP_PAYMENT_METHOD,
  STEP_SHIPPING_METHOD
} from "../constants";
import { CheckoutForm } from "./checkout_form";
import { renderHtmlTemplate } from "../helpers";

const SUPPORTED_STEPS = [
  STEP_CONTACT_INFORMATION,
  STEP_SHIPPING_METHOD,
  STEP_PAYMENT_METHOD
];

export class Checkout {

  constructor(document, Shopify, api, config) {
    this.document = document;
    this.Shopify = Shopify;
    this.api = api;
    this.config = config;

    this.initialise();
  }

  initialise() {
    this.debug('initialise()');

    const { document, Shopify, api, config } = this;

    // if we're not in the Shopify checkout on a supported step, return
    if(!Shopify || !Shopify.Checkout || !SUPPORTED_STEPS.includes(Shopify.Checkout.step)) {
      return;
    }

    this.debug('on supported step');

    // define an event handler for page changes
    const handlePageChange = () => {
      document.querySelectorAll(SELECTOR_REDUCTION_FORM).forEach(formElement => {
        // skip if the form is already initialised
        if(formElement.dataset.givex === 'true') {
          return;
        }

        new CheckoutForm(formElement, api, config);
      });
    };

    // register event listeners for page changes
    document.addEventListener('page:load', handlePageChange);
    document.addEventListener('page:change', handlePageChange);
  }

  debug(...args) {
    if(!this.config.debug) {
      return;
    }

    console.log('[Givex Checkout]', ...args);
  }

}
