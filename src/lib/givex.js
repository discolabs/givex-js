import { ApiClient } from "./api_client";
import { Checkout } from "./checkout/checkout";

export class Givex {

  constructor(document, Shopify, config = {}) {
    this.api = new ApiClient(config);
    this.checkout = new Checkout(document, Shopify, config);
  }

}
