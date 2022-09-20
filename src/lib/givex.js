import { ApiClient } from "./api_client";
import { Checkout } from "./checkout/checkout";

export class Givex {

  constructor(document, Shopify, config = {}) {
    const api = new ApiClient(config);
    this.api = api;
    this.checkout = new Checkout(document, Shopify, api, config);
  }

}
