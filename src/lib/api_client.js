// Constants for possible HTTP methods.
const GET = 'get';

// API endpoints across environments
const API_ENDPOINTS = {
  production: 'https://givex-integration.discolabs.com/api/v1',
  staging: 'https://givex-integration-staging.discolabs.com/api/v1'
};

// API methods with their method and path
const API_METHODS = {
  check_balance: {
    http_method: GET,
    endpoint: '/balance.json'
  },
  preauth: {
    http_method: GET,
    endpoint: '/preauth.json'
  }
}

// Return the appropriate API URL for the given environment and API method
const getUrl = (environment, method) => {
  return `${API_ENDPOINTS[environment]}${API_METHODS[method].endpoint}`;
}

// Return the appropriate HTTP method (GET, POST, DELETE etc) for the given API method
const getHttpMethod = (method) => {
  return API_METHODS[method].http_method;
};

// Return a combined set of query parameters for a request
const getQueryParams = (authentication, params) => {
  return Object.assign({}, authentication, params);
};

// Return a querystring that can be appended to an API endpoint
const buildQueryString = (params) => {
  const queryString = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    .join('&');

  return `?${queryString}`;
};

export class ApiClient {

  constructor({ authentication, environment }) {
    this.authentication = authentication;
    this.environment = environment;
  }

  // Execute an API request against the Givex Integration API
  execute({ method, params, onSuccess, onFailure }) {
    const url = getUrl(this.environment, method);
    const httpMethod = getHttpMethod(method);
    const queryParams = getQueryParams(this.authentication, params);

    return fetch(url + buildQueryString(queryParams), {
      method: httpMethod,
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    }).then(response => response.json().then(json => {
      if(json && json.response) {
        if(json.response.status === 'OK') {
          onSuccess && onSuccess(json.response);
          return;
        } else {
          onFailure && onFailure(json.response);
          return;
        }
      }

      if(response.status === 400 || response.status === 422 || response.status === 500) {
        onFailure && onFailure(json);
        return;
      }

      onSuccess && onSuccess(json);
    }));
  }

  checkBalance({ number, pin, onSuccess, onFailure }) {
    return this.execute({
      method: 'check_balance',
      params: {
        voucher_number: number,
        security_code: pin
      },
      onSuccess,
      onFailure
    });
  }

  preauth({ number, pin, amount, onSuccess, onFailure }) {
    return this.execute({
      method: 'preauth',
      params: {
        voucher_number: number,
        security_code: pin,
        voucher_amount: amount
      },
      onSuccess,
      onFailure
    });
  }

}
