// index.js
import { parseJSONScript } from "./lib/helpers";
import { Givex } from "./lib/givex";

const initialise = () => {
  // check we are in a browser context
  if(!window || !document) { return; }

  // parse Givex configuration
  const config = parseJSONScript(document, 'givex-config');

  // initialise a Givex object and make it accessible to the window
  window.givex = new Givex(config);
}

initialise();
