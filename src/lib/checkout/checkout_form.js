import { SELECTOR_DISCOUNT_INPUT, SELECTOR_FIELDSET, SELECTOR_SUBMIT_BUTTON } from "../constants";

export class CheckoutForm {

  constructor(formElement, api, config) {
    this.formElement = formElement;
    this.api = api;
    this.config = config;
    this.potentialGivexCard = false;

    this.initialise();
  }

  initialise() {
    const { formElement } = this;

    // store references to other elements
    this.inputElement = formElement.querySelector(SELECTOR_DISCOUNT_INPUT);
    this.fieldsetElement = this.inputElement.closest(SELECTOR_FIELDSET);
    this.submitElement = formElement.querySelector(SELECTOR_SUBMIT_BUTTON);

    // register event listeners
    this.inputElement.addEventListener('input', this.handleInput.bind(this));
    this.formElement.addEventListener('submit', this.handleSubmit.bind(this));

    // mark this form element as initialised
    formElement.dataset.givex = 'true';
  }

  handleInput(e) {
    this.potentialGivexCard = this.isPotentialGivexCard(this.inputElement.value);
    this.formElement.classList.toggle('is-potential-givex-card', this.potentialGivexCard);
  }

  handleSubmit(e) {
    const { formElement, potentialGivexCard, inputElement, pinElement, submitElement, api, config } = this;

    // don't prevent submission if no chance of a Givex card
    if(!potentialGivexCard) {
      return true;
    }

    // don't prevent submission if the force submit flag is set
    if(formElement.dataset.forceSubmit === 'true') {
      return true;
    }

    // prevent form submission
    e.preventDefault();

    // add loading spinner and disable the button to prevent resubmission.
    submitElement.classList.add('btn--loading');
    submitElement.disabled = true;

    // build values for preauthorisation request
    const number = inputElement.value;
    const pin = pinElement ? pinElement.value : null;
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

  }

  handlePreauthFailure(error) {

  }

  isPotentialGivexCard(value) {
    const cleanValue = value.replace(/\D/g, '');
    return cleanValue >= 21;
  }

}
