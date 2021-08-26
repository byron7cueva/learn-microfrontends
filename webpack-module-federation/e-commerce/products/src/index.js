import fake from 'faker';

let products = '';

for (let i = 0; i < 5; i++) {
  const name = fake.commerce.productName();
  products += `<div>${name}</div>`;
}

document.querySelector('#dev-products').innerHTML = products;