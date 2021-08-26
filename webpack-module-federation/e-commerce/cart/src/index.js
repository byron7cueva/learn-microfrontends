import faker from 'faker';

const cartText = `<div>You have ${faker.random.number()}</div>`;

document.querySelector('#dev-cart').innerHTML = cartText;