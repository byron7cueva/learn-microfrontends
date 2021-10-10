# Gateway

Es la capa de agregación.

## Implementación

* La capa de agregación viene con un diseño, esencialmente una plantilla básica para definir el documento HTML como lo ven los usuarios.
* Es un documento HTML completo pero contiene un marcador de posición para el contenido principal. La fuente de este contenido debe ser determinada por el backend.
* La configuración del proxy reverso, necesitamos configurar la URL base y restringir los hosts permitidos a los objetivos de micro frontend definidos. Para evitar solicitudes de larga duración debido a referencias cíclicas, limitamos la profundidad máxima de reemplazos de marcadores de posición.
* El almacenamiento en caché es una necesidad, debemos elegir la configuración con prudencia. Si actualizamos partes del contenido, no queremos terminar en un estado inconsistente.
* Las partes más difíciles son el envío exitoso de formularios y el ajuste real de las hiperreferencias. Para los envíos de formularios, podemos encontrar una solución que reenvíe el cuerpo del formulario al micro frontend de destino y descarte la respuesta.

Idealmente, reutilizaríamos el código HTML anterior y reemplazaríamos la parte correspondiente al micro frontend que envía el formulario. Sin embargo, el problema con este enfoque es que el envío de un formulario también puede influir en partes de otras micro interfaces. De esa manera, necesitaríamos saber dinámicamente cuáles se pueden conservar y cuáles se deben reemplazar. Volvemos a nuestro problema inicial de almacenamiento en caché.

Hacer una solicitud de formulario se puede hacer fácilmente con una biblioteca como axios. Dado que esto puede involucrar el estado, debemos inyectar la cookie de la solicitud actual y recuperar la cookie potencialmente modificada para enviarla con la respuesta más adelante. En el código, esto se puede hacer configurando el encabezado de la cookie explícitamente.

## Requisitos debemos cumplir

* Proxying solicitudes a micro frontends
* Reemplazo de etiquetas de marcador de posición con contenido de micro frontends
* Ajuste de hiperreferencias (por ejemplo, para enlaces, hojas de estilo, imágenes, formularios, etc.)
* Reenvío y agregación de cookies
* Sirve contenido estático