# Givex.js
Givex.js is a Javascript library that targets the browser.

It provides client-side functionality required to integrate [Givex](https://www.givex.com) into the front end of a Shopify store, in tandem with Disco Labs' [Givex Integration](https://givex.discolabs.com).

## Usage
The simplest method for integration is to load the compiled and distributed `givex.js` script on all pages you need Givex functionality to be available (including the checkout), alongside a configuration object.

```html
<script id="givex-config" type="application/json">
  {
    "authentication": {
      "shop": "mystore.myshopify.com"
    },
    "environment": "staging"
  }
</script>
<script type="text/javascript" src="https://cdn.jsdelivr.net/npm/givex-js@0.2.0/dist/givex.js"></script>
```

The easiest way to do this if you're using a Liquid-based Shopify theme is to copy-paste the Liquid snippet found in `snippets/givex-js.liquid` into your theme, and then render that snippet in your `theme.liquid` and `checkout.liquid`:

```liquid
<head>
  ...
  {%- render 'givex-js' -%}
  ...
</head>
```

The library will automatically instantiate and initialise a top-level `givex` object in the document window, which your own code can then use to leverage Givex functionality, if you need it.

However, the library will also automatically hook into key elements on your theme's pages to provide key functionality:

* When loaded in the checkout, the library will automatically hook into the gift card input present on the page to add Givex gift card support for redemptions. See [Integrating Gift Card Redemption in the Checkout](#integrating-gift-card-redemption-in-the-checkout).
* When loaded on a page with elements marked up with specific data attributes, the library will automatically hook into a form to provide out of the box balance checking functionality. See [Integrating Balance Checking on a Page](#integrating-balance-checking-on-a-page).

### Making API Calls
Once you have an initialised Givex object, making API calls is pretty simple:

```js
givex.api.checkBalance({
  number: "12345678901234567890",
  pin: "7878",
  onSuccess: (result) => { },
  onFailure: (error) => { }
});
```

All API calls support two callback methods, `onSuccess` and `onFailure`.
`onSuccess` provides a successful `(result)` signature, while `onFailure` provides `(error)`.

### API Reference
There are currently only two API methods exposed by the Givex client.

#### Check balance
Check the balance of the provided card number (with PIN, if required).

```js
givex.api.checkBalance({
  number: "12345678901234567890",
  pin: "7878", // may not be required depending on configuration
  onSuccess: (result) => {
    console.log(result.message);
  },
  onFailure: (error) => {
    console.error(error.message);
  }
});
```

#### Preauthorise
Pre-authorised a specific amount on the provided card (with PIN, if required) as part of the gift card redemption process.
In a typical implementation, you won't need to worry about calling this directly as it'll be handled by the default checkout integration.

```js
givex.api.preauth({
  number: "12345678901234567890",
  pin: "7878", // may not be required depending on configuration
  amount: "17.95",
  onSuccess: (result) => {
    console.log(result.message);
  },
  onFailure: (error) => {
    console.error(error.message);
  }
});
```

### Integrating Gift Card Redemption in the Checkout
If you've copied the `givex-js.liquid` snippet into your theme, and rendered it anywhere inside your `checkout.liquid` layout file, you should be done!

The library will automatically hook into the gift card application box in the checkout, show and hide the gift card security code input as needed, and pass requests off to the Givex Integration without any further coding required.

### Integrating Balance Checking on a Page
While you're welcome to use the API client directly to make requests to the `checkBalance` API endpoint, if you render the `givex-js.liquid` snippet on a page with a specially-marked-up form, the library will automatically hook into it and provide an out of the box balance checker for you.

You're welcome to style your form however you like, the key data attributes you'll need to add are:

```html
<form data-givex-balance-checker="form">
  <div data-givex-balance-checker="result"></div>
  <input type="text" data-givex-balance-checker="number" />
  <input type="text" data-givex-balance-checker="pin" />
  <button type="submit" data-givex-balance-checker="submit"></button>
</form>
```

If these are present, then when a user submits the form via button click or hitting enter, the submission will be automatically intercepted and passeed to the Givex Integration.
The result of the balance check lookup will be rendered into the `<div data-givex-balance-checker="result">` DOM element.
If you'd like to customise how that rendered message is displayed, you can update the default templates in `givex-js.liquid`.

The most common approach we've seen for balance checkers is to create a new specific page template in your theme (`page.balance-checker.liquid` or `page.balance-checker.json`) and create a dedicated balance checker page on your store.

### Translations
All text rendered by the library is translatable via Shopify's default locale functionality -- indeed, there's an expectation that translation keys will be added to the store's default locale file, whether that's `en.default.json` or something else.

To apply the default translations, the following can be copied as a top-level object to the store's default locale file:

```json
{
  "givex": {
    "balance_checker": {
      "title": "Check your gift card balance",
      "number_label": "Enter card number",
      "number_placeholder": "Enter card number",
      "security_code_label": "Enter PIN",
      "security_code_placeholder": "Enter PIN",
      "submit": "Submit",
      "loading": "Checking balance..."
    },
    "checkout": {
      "security_code_label": "Gift card? Enter PIN",
      "security_code_placeholder": "Gift card? Enter PIN"
    }
  }
}
```
