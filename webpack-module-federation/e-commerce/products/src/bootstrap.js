import fake from 'faker';

const mount = (el) => {
  let products = '';

  for (let i = 0; i < 5; i++) {
    const name = fake.commerce.productName();
    products += `<div>${name}</div>`;
  }

  el.innerHTML = products;
}

// Context/Situation #1
// We are running this file in development in isolation
// We are using our local index.html file
// Which DEFINITELY has a element with a id of 'dev-products'
// We want to immediately render our app into that element

if (process.env.NODE_ENV === 'development') {
  const el = document.querySelector('#dev-products');

  // Assuming our container does not have an element with id 'dev-products'
  if (el) {
    // We are probably running in isolation
    mount(el);
  }
}


// Context/Situation #2
// We are running this file in development or production
// through the CONTAINER app
// No GUARANTEE that an element with han id of 'dev-products' exist
// We do not want try to immediately render the app
export { mount };