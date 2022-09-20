// parse a JSON configuration object from the DOM
export const parseJSONScript = (document, id) => {
  const script = document.getElementById(id);
  try {
    return JSON.parse(script.innerHTML);
  } catch { return null; }
};

// render a HTML template after the given target element
export const renderHtmlTemplate = (config, targetElement, templateName) => {
  const templateDocument = new DOMParser().parseFromString(config.templates[templateName], 'text/html');
  const templateElement = templateDocument.querySelector('body > *');

  targetElement.after(templateElement);
};
