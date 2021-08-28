"use strict";
const express = require("express");
const httpProxy = require("http-proxy");
const proxy = httpProxy.createProxyServer();
const app = express();
const port = process.env.GW_PORT || 1234;

/*
La búsqueda en la puerta de enlace de la aplicación podría permanecer estática
*/
const lookup = {
  "/mf1": `http://localhost:${process.env.MF1_PORT || 2001}`,
  "/mf2": `http://localhost:${process.env.MF2_PORT || 2002}`,
};

app.set("view engine", "pug");

app.get("/", (_, res) => {
  res.render("index", { title: "Sample", message: "Index" });
});

/*
Al usar una solución de proxy como http-proxy, podemos simplemente reenviar las solicitudes al destino.
Lo haremos de forma dinámica, en función del contenido real de la variable de búsqueda
*/
app.use((req, res) => {
  const [prefix] = Object.keys(lookup).filter((m) => req.path.startsWith(m));

  // Cuando no existe una url a un path
  if (!prefix) {
    return res.status(404).send("Nothing found.");
  }

  const target = lookup[prefix];

  console.log('Going to target...', prefix, target);

  // Redireccionando a la url del micro frontend
  return proxy.web(req, res, { target }, e => {
    console.error(e);
    res.status(500).send('Something went wrong...');
  });
});

app.listen(port, () => {
  console.log(`Running at ${port}.`);
});