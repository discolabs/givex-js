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

The easiest way to do this if you're using a Liquid-based Shopify theme is to copy-paste the Liquid snippet found in `snippets/givex-js.liquid` into your theme, and then rendering that snippet in your `theme.liquid` and `checkout.liquid`:

```liquid
<head>
  ...
  {%- render 'givex-js' -%}
  ...
</head>
```

The library will automatically instantiate and initialise a top-level `givex` object in the document window, which your own code can then use to leverage Givex functionality.
When loaded in the checkout, the library will also automatically hook into the gift card input present on the page to add Givex gift card support for redemptions.

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

### Translations
All text rendered by the library is translatable via Shopify's default locale functionality -- indeed, there's an expectation that translation keys will be added to the store's default locale file, whether that's `en.default.json` or something else.

To apply the default translations, the following can be copied as a top-level object to the store's default locale file:

```json
{
  "givex": {
    "checkout": {
      "security_code_label": "Gift card? Enter PIN",
      "security_code_placeholder": "Gift card? Enter PIN"
    }
  }
}
```
