// Constants for possible HTTP methods.
const GET = 'get';

// API methods with their method and path
const API_METHODS = {
  check_balance: {
    http_method: GET,
    path: '/balance.json'
  },
  preauth: {
    http_method: GET,
    path: '/preauth.json'
  }
}

// Return the appropriate API URL for the given environment and API method
const getUrl = (endpoint, method) => {
  return `${endpoint}${API_METHODS[method].path}`;
}

// Return the appropriate HTTP method (GET, POST, DELETE etc) for the given API method
const getHttpMethod = (method) => {
  return API_METHODS[method].http_method;
};

// Return a combined set of query parameters for a request
const getQueryParams = (authentication, params) => {
  return Object.assign({}, authentication, params);
};

// Return a querystring that can be appended to an API URL
const buildQueryString = (params) => {
  const queryString = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    .join('&');

  return `?${queryString}`;
};

export class ApiClient {

  constructor({ authentication, endpoint }) {
    this.authentication = authentication;
    this.endpoint = endpoint;
  }

  // Execute an API request against the Givex Integration API
  execute({ method, params, onSuccess, onFailure }) {
    const url = getUrl(this.endpoint, method);
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
