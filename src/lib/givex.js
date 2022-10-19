import { ApiClient } from "./api_client";
import { Checkout } from "./checkout/checkout";
import { BalanceChecker } from "./balance_checker/balance_checker";

export class Givex {

  constructor(document, Shopify, config = {}) {
    const api = new ApiClient(config);
    this.api = api;
    this.checkout = new Checkout(document, Shopify, api, config);
    this.balanceChecker = new BalanceChecker(document, api, config);
  }

}
