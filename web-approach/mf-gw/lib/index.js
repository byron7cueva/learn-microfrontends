/*
Una forma de implementar la puerta de enlace es reenviar / a alguna micro interfaz, mientras se procesa cada solicitud en función del prefijo de la ruta.
Esto establece el requisito en cada micro interfaz de usar un determinado prefijo y ceñirse a él.
Si no se identifica ningún prefijo conocido, responderemos con un estado HTTP 404
*/

const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();
const port = process.env.PORT || 1234;

const targets = {
  "/mf1": "http://localhost:2001",
  "/mf2": "http://localhost:2002",
};

app.get("/", (_, res) => res.redirect(Object.keys(targets)[0]));

Object.keys(targets).forEach((prefix) => {
  app.use(
    prefix,
    createProxyMiddleware({
      target: targets[prefix],
      changeOrigin: true,
    })
  );
});

app.get("*", (_, res) => res.status(404).send("Page not found."));

app.listen(port, () => {
  console.log(`Microfrontend gateway running at ${port}.`);
});