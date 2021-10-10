const express = require("express");
const path = require("path");
const axios = require("axios").default;
const cheerio = require("cheerio");
const { renderFile } = require("ejs");
const { middleware } = require("nodesi");

const app = express();

const port = process.env.PORT || 1234;
const host = `http://localhost:${port}`;

/*
Para simplificar, usaremos un conjunto estático de objetivos de micro frontend
*/
const targets = {
  "/products": "http://localhost:2001",
  "/store": "http://localhost:2002",
  "/recommendations": "http://localhost:2003",
};

const esiConfig = {
  baseUrl: host,
  allowedHosts: Object.keys(targets).reduce(
    (prev, prefix) => [...prev, targets[prefix]],
    [host]
  ),
  maxDepth: 8,
  // Deshabilitar el almacenamiento en caché por completo
  cache: false,
};

app.set("views", path.resolve(__dirname, "..", "views"));
app.engine("html", renderFile);
app.set("view engine", "html");

function combine(path, query) {
  const keys = Object.keys(query);

  if (keys.length) {
    const qp = keys.reduce(
      (params, key) => [...params, `${key}=${query[key]}`],
      []
    );
    return `${path}?${qp.join("&")}`;
  }

  return path;
}

app.use(middleware(esiConfig));

app.use(express.static("public"));

app.get("/mf-down-error", (req, res) => {
  req.esiOptions = {
    headers: {
      cookie: req.headers.cookie || '',
    },
  };
  res.render("frag-mf-down");
});

Object.keys(targets).forEach((prefix) => {
  app.use(prefix, (req, res) => {
    const dest = targets[prefix];
    const target = combine(dest + req.path, req.query);
    const cookie = req.headers.cookie || '';
    console.log(`[${req.method}] ${target}`);

    req.esiOptions = {
      headers: {
        cookie,
      },
    };

    if (req.method === "GET") {
      axios
        .request({
          method: "GET",
          responseType: "arraybuffer",
          url: target,
          headers: {
            cookie,
          },
        })
        .then((response) => {
          const contentType = response.headers["content-type"];

          for (const name of Object.keys(response.headers)) {
            res.setHeader(name, response.headers[name]);
          }

          res.contentType(contentType);

          if (contentType.startsWith("text/html")) {
            let result = Buffer.from(response.data, "utf8").toString("utf8");
            const doc = cheerio.load(result);

            doc("img").each((i, el) => {
              const prev = el.attribs["src"];

              if (prev.startsWith(".")) {
                const next = prefix + prev.substr(1);
                result = result.split(prev).join(next);
              }
            });

            doc("link,base").each((i, el) => {
              const prev = el.attribs["href"];

              if (prev.startsWith(".")) {
                const next = prefix + prev.substr(1);
                result = result.split(prev).join(next);
              }
            });

            doc("a").each((i, el) => {
              const prev = el.attribs["href"];

              if (prev.startsWith(".")) {
                const next = "/page" + prefix + prev.substr(1);
                result = result.split(prev).join(next);
              }
            });

            doc("form").each((i, el) => {
              const prev = el.attribs["action"];

              if (prev.startsWith(".")) {
                const next = prefix + prev.substr(1);
                result = result.split(prev).join(next);
              }
            });

            res.send(Buffer.from(result, "utf8"));
          } else {
            res.send(Buffer.from(response.data, "binary"));
          }
        })
        .catch((error) => {
          console.error(error);
          res.sendStatus(503);
        });
    } else if (req.method === "POST") {
      axios
        .request({
          method: "POST",
          data: req.body,
          url: target,
          headers: {
            cookie,
          },
        })
        .then((response) => {
          res.header("cookie", response.headers.cookie);
          res.redirect(req.headers.referer);
        })
        .catch(() => {
          res.redirect(req.headers.referer);
        });
    } else {
      res.sendStatus(501);
    }
  });
});

app.get("/", (_, res) => {
  res.redirect("/page/mf-red/product-page");
});

/**
* Cualquier ruta con el prefijo /page/ resolverá la plantilla predeterminada
* donde el contenido proviene del micro frontend indicada en la ruta.
* Al solicitar una página utilizando la ruta /page/products/product-page,
* la plantilla resolverá el contenido de /products/product-page,
* que luego enviará la solicitud al micro frontend products.
* Las solicitudes de proxy son resistentes y nunca deben bloquear la aplicación.
* Podemos probar esto apagando micro frontends individuales.
* Como ejemplo, si desactivamos el micro frontend products,
* solo se renderiza la plantilla simple sin ningún contenido.
* La puerta de enlace se ejecuta de forma aislada sin micro interfaces
*/
app.get("/page/*", (req, res) => {
  req.esiOptions = {
    headers: {
      cookie: req.headers.cookie || '',
    },
  };
  res.render("default", {
    page: combine(req.path.substr(5), req.query),
  });
});

app.listen(port, () => {
  console.log(`[OK] Gateway running at ${host} ...`);
});