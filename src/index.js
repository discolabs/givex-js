// index.js

const initialise = () => {
  // check we are in a browser context
  if(!window || !document) { return; }

  // initialise a Givex object and make it accessible to the window
  window.Givex = {};
}

initialise();
