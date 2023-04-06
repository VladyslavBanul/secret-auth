const createElement = (elemName, attributes, children) => {
  const elem = document.createElement(elemName);
  if (attributes) {
    Object.entries(attributes).forEach(([attrName, attrValue]) => {
      if (attrName.startsWith('on') && typeof attrValue === 'function') {
        elem.addEventListener(attrName.slice(2).toLowerCase(), attrValue);
      } else {
        elem.setAttribute(attrName, attrValue);
      }
    });
  }

  if (children) {
    elem.append(...children);
  }

  return elem;
};

export default createElement;
