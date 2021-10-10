# Store

Cubre la gestión de la cesta de pedidos. En la tienda de tractores, esto se divide en dos componentes:
• Información de la cesta para mostrar el número de artículos en la cesta.
• Un botón Agregar al carrito que permite agregar artículos adicionales al carrito.

## Implementación

La parte complicada aquí es que esta gestión implica un estado específico del usuario. Hay varias formas de implementar dicho estado en el backend, pero la mayoría de estas formas dependen de una cookie que se transporta a través de los encabezados.
Para una gestión de sesión simplificada, usaremos el paquete express-session. Nos proporciona una envoltura sencilla sobre las cookies y la gestión del estado del usuario. En este ejemplo, es suficiente un simple almacenamiento en memoria para administrar el estado del usuario.