# Static - Pipeline

Solución de micro frontend integrada en tiempo de compilación

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

## Install Dependencies

```
npx lerna bootstrap
```

## Run Application

```
npm start
```

## Open on browser

```
http://localhost:1234
```