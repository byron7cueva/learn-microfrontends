# Products

Este micro frontend es responsable de la página de información del producto.
Esta página será el controlador central de todo el contenido, ya que representa la única página.

## Implementación

* Podemos usar un servidor Node.js y Express simple para entregar el contenido.
* Usando los paquetes ejs y nodesi, integramos un mecanismo de plantillas.
* Las partes en las que usamos variables se indican mediante los marcadores de posición <% =…%>.
* El uso de la etiqueta esi:include para referirse a fragmentos de otro micro frontend. Este es un posible mecanismo para indicar la inserción de código desde otro micro frontend. El atributo src indica de dónde se recupera la pieza deseada.
* El documento es un fragmento HTML válido y también se muestra bien en el navegador.
* El formato final depende ligeramente de la capa de agregación utilizada.
* En general, deberíamos limitarnos a los fragmentos, aunque el caso ideal sería escribir documentos HTML completos y válidos.
