import {
  SECURITY_CODE_POLICY_IS_REQUIRED,
  SELECTOR_BALANCE_CHECKER_NUMBER,
  SELECTOR_BALANCE_CHECKER_PIN,
  SELECTOR_BALANCE_CHECKER_RESULT,
  SELECTOR_BALANCE_CHECKER_SUBMIT
} from "../constants";
import {renderHtmlTemplate} from "../helpers";

export class BalanceCheckerForm {

  constructor(formElement, api, config) {
    this.formElement = formElement;
    this.api = api;
    this.config = config;

    this.initialise();
  }

  initialise() {
    this.debug('initialise()');

    const { formElement } = this;

    // store references to other elements
    this.numberElement = formElement.querySelector(SELECTOR_BALANCE_CHECKER_NUMBER);
    this.pinElement = formElement.querySelector(SELECTOR_BALANCE_CHECKER_PIN);
    this.resultElement = formElement.querySelector(SELECTOR_BALANCE_CHECKER_RESULT);
    this.submitElement = formElement.querySelector(SELECTOR_BALANCE_CHECKER_SUBMIT);

    // register event listeners
    this.formElement.addEventListener('submit', this.handleSubmit.bind(this));

    // mark this form element as initialised
    formElement.dataset.givex = 'true';
  }

  handleSubmit(e) {
    this.debug('handleSubmit()', e);

    const { numberElement, pinElement, submitElement, resultElement, api, config } = this;

    // prevent form submission
    e.preventDefault();
    e.stopPropagation();

    // if the security code input is required, present and empty, focus it and return
    if((config.security_code_policy === SECURITY_CODE_POLICY_IS_REQUIRED) && pinElement && pinElement.value.trim().length === 0) {
      pinElement.focus();
      return false;
    }

    // add loading spinner and disable the button to prevent resubmission.
    submitElement.classList.add('btn--loading');
    submitElement.disabled = true;

    // render the blank result state
    this.resultElement = renderHtmlTemplate(config, resultElement, "balance_checker_loading", {}, "replaceWith");

    // build values for preauthorisation request
    const number = numberElement.value;
    const pin = pinElement ? pinElement.value : null;

    // make balance check request
    api.checkBalance({
      number,
      pin,
      onSuccess: this.handleBalanceCheckSuccess.bind(this),
      onFailure: this.handleBalanceCheckFailure.bind(this)
    });
  }

  handleBalanceCheckSuccess(result) {
    this.debug('handleBalanceCheckSuccess', result);

    const { config, resultElement } = this;
    this.resultElement = renderHtmlTemplate(config, resultElement, "balance_checker_success", {
      message: result.message
    }, "replaceWith");

    this.handleBalanceCheckComplete();
  }

  handleBalanceCheckFailure(error) {
    this.debug('handleBalanceCheckFailure', error);

    const { config, resultElement } = this;
    this.resultElement = renderHtmlTemplate(config, resultElement, "balance_checker_error", {
      message: error.message
    }, "replaceWith");

    this.handleBalanceCheckComplete();
  }

  handleBalanceCheckComplete() {
    const { submitElement } = this;

    submitElement.classList.remove('btn--loading');
    submitElement.disabled = false;
  }

  debug(...args) {
    if(!this.config.debug) {
      return;
    }

    console.log('[Givex BalanceCheckerForm]', ...args);
  }

}
