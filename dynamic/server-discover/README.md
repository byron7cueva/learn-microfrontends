# Server

Solución de servidor con enrutamiento dinámico de vistas.

En este caso, la aplicación está asumiendo el papel de una especie de puerta de enlace de vista de micro frontend, mientras que cada micro frontend ya no es un paquete, sino su propia aplicación que se ejecuta en un puerto dedicado.

* app: aplicación para ser una puerta de enlace de aplicaciones que se ejecuta en el puerto 1234
* mife-1: será su propia aplicación ejecutándose en el puerto 2001
* mife-2: será su propia aplicación ejecutándose en el puerto 2002

## Install dependencies

```
npx lerna bootstrap
```

## Run

```
npm start
```

## Steps

Follow these steps to implement the same from scratch.

Initialize the repository:

```
npm init -y
```

Make it a Lerna monorepo:

```
npx lerna init
```

Add an application gateway and two micro frontends:

```
npx lerna create @aom/app --yes
npx lerna create @aom/mife-1 --yes
npx lerna create @aom/mife-2 --yes
```

Register the dependencies:

```
npx lerna add express pug
```

Add http-proxy to the gateway:

```
npx lerna add http-proxy --scope @aom/app
```