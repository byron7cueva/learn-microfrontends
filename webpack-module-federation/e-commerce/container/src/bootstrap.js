// name_module/expose_file
import { mount as productsMount} from 'products/ProductsIndex';
import { mount as cartMount } from 'cart/CartShow';

console.log('Container');

// Mount on local el
productsMount(
  document.querySelector('#my-products')
);

cartMount(
  document.querySelector('#dev-cart')
);