import {
  SECURITY_CODE_POLICY_IS_OPTIONAL,
  SECURITY_CODE_POLICY_IS_REQUIRED,
  SELECTOR_DISCOUNT_INPUT,
  SELECTOR_FIELDSET,
  SELECTOR_FORM,
  SELECTOR_SECURITY_CODE_INPUT,
  SELECTOR_SUBMIT_BUTTON
} from "../constants";
import { renderHtmlTemplate } from "../helpers";

export class CheckoutForm {

  constructor(formWrapperElement, api, config) {
    this.formWrapperElement = formWrapperElement;
    this.api = api;
    this.config = config;
    this.potentialGivexCard = false;

    this.initialise();
  }

  initialise() {
    this.debug('initialise()');

    const { formWrapperElement } = this;

    // store references to other elements
    this.inputElement = formWrapperElement.querySelector(SELECTOR_DISCOUNT_INPUT);
    this.fieldsetElement = this.inputElement.closest(SELECTOR_FIELDSET);
    this.formElement = this.inputElement.closest(SELECTOR_FORM);
    this.submitElement = formWrapperElement.querySelector(SELECTOR_SUBMIT_BUTTON);

    // render the security code input if required and retain a reference to it
    if(this.config.security_code_policy === SECURITY_CODE_POLICY_IS_REQUIRED || this.config.security_code_policy === SECURITY_CODE_POLICY_IS_OPTIONAL) {
      this.renderSecurityCode();
      this.securityCodeInputElement = formWrapperElement.querySelector(SELECTOR_SECURITY_CODE_INPUT);
    }

    // register event listeners
    this.inputElement.addEventListener('input', this.handleInput.bind(this));
    this.formElement.addEventListener('submit', this.handleSubmit.bind(this));

    // mark this form element as initialised
    formWrapperElement.dataset.givex = 'true';
  }

  renderSecurityCode() {
    const { config } = this;
    renderHtmlTemplate(config, this.fieldsetElement, 'checkout_security_code');
  }

  handleInput(e) {
    this.debug('handleInput()', e);

    this.potentialGivexCard = this.isPotentialGivexCard(this.inputElement.value);

    this.debug('potentialGivexCard', this.potentialGivexCard);

    this.formWrapperElement.classList.toggle('is-potential-givex-card', this.potentialGivexCard);
  }

  handleSubmit(e) {
    this.debug('handleSubmit()', e);

    const { formWrapperElement, potentialGivexCard, inputElement, securityCodeInputElement, submitElement, api, config } = this;

    // don't prevent submission if no chance of a Givex card
    if(!potentialGivexCard) {
      return true;
    }

    // don't prevent submission if the force submit flag is set
    if(formWrapperElement.dataset.forceSubmit === 'true') {
      return true;
    }

    // prevent form submission
    e.preventDefault();
    e.stopPropagation();

    // if the security code input is present and empty, focus it and return
    if(securityCodeInputElement && securityCodeInputElement.value.trim().length === 0) {
      securityCodeInputElement.focus();
      return false;
    }

    // add loading spinner and disable the button to prevent resubmission.
    submitElement.classList.add('btn--loading');
    submitElement.disabled = true;

    // build values for preauthorisation request
    const number = inputElement.value;
    const pin = securityCodeInputElement ? securityCodeInputElement.value : null;
    const amount = config.checkout.total_price;

    // make preauthorisation request
    api.preauth({
      number,
      pin,
      amount,
      onSuccess: this.handlePreauthSuccess.bind(this),
      onFailure: this.handlePreauthFailure.bind(this)
    });
  }

  handlePreauthSuccess(result) {
    this.debug('handlePreauthSuccess()', result);

    const { inputElement } = this;

    const hiddenInput = document.createElement('input');
    hiddenInput.type = 'hidden';
    hiddenInput.name = 'checkout[reduction_code]';
    hiddenInput.value = result.voucher_number;

    inputElement.after(hiddenInput);

    this.handlePreauthComplete();
  }

  handlePreauthFailure(error) {
    this.debug('handlePreauthFailure()', error);

    this.handlePreauthComplete();
  }

  handlePreauthComplete() {
    this.debug('handlePreauthComplete()');

    const { formWrapperElement, formElement } = this;
    formWrapperElement.dataset.forceSubmit = 'true';
    formElement.submit();
  }

  isPotentialGivexCard(value) {
    this.debug('isPotentialGivexCard()', value);

    const cleanValue = value.replace(/\D/g, '');
    return cleanValue.length >= this.config.card_code_length;
  }

  debug(...args) {
    if(!this.config.debug) {
      return;
    }

    console.log('[Givex CheckoutForm]', ...args);
  }

}
