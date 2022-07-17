const dotenv = require("dotenv");
const http = require("http");
const https = require("https");

dotenv.config();

const { REACT_APP_PROXY_PORT: port, API_PROXY_APP_SERVER_URL: apiUrl } =
  process.env;

function onRequest(req, res) {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "OPTIONS, POST, GET",
    "Access-Control-Allow-Headers":
      "origin, content-type, accept, authorization",
    "Access-Control-Max-Age": 2592000, // 30 days
  };

  // CORS handler
  if (req.method === "OPTIONS") {
    res.writeHead(204, headers);
    res.end();
    return;
  }

  const host = apiUrl.replace("https://", "");

  const options = {
    host: host,
    hostname: host,
    port: 443,
    path: req.url,
    method: req.method,
    headers: {
      ...req.headers,
      host: host,
      hostname: host,
    },
  };

  const proxy = https.request(options, function (incoming) {
    incoming.pipe(res, {
      end: true,
    });

    res.writeHead(incoming.statusCode, { ...headers, ...incoming.headers });
  });

  req.pipe(proxy, {
    end: true,
  });

  console.log("Request::", { data: req.body, url: req.url });
}

http.createServer(onRequest).listen(port);
console.log(`Proxy app listening on port ${port}`);
