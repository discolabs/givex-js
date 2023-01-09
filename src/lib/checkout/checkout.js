import {
  SELECTOR_REDUCTION_FORM_WRAPPER,
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
      document.querySelectorAll(SELECTOR_REDUCTION_FORM_WRAPPER).forEach(formWrapperElement => {
        // skip if the form wrapper is already initialised
        if(formWrapperElement.dataset.givex === 'true') {
          return;
        }

        new CheckoutForm(formWrapperElement, api, config);
      });
    };

    // register event listeners for page changes
    document.addEventListener('page:load', handlePageChange);
    document.addEventListener('page:change', handlePageChange);

    // attempt immediate initialisation in case the page is already ready
    handlePageChange();
  }

  debug(...args) {
    if(!this.config.debug) {
      return;
    }

    console.log('[Givex Checkout]', ...args);
  }

}
