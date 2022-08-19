import { ApiClient } from "./api_client";

export class Givex {

  constructor(config = {}) {
    this.api = new ApiClient(config);
  }

}
