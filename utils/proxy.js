const dotenv = require("dotenv");
const http = require("http");
const https = require("https");

dotenv.config();

const { REACT_APP_PROXY_PORT: port, REACT_APP_SERVER_URL: apiUrl } =
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

  const options = {
    hostname: apiUrl.replace("https://", ""),
    port: 443,
    path: req.url,
    method: req.method,
    rejectUnauthorized: false,
    headers: {
      ...req.headers,
    },
  };

  const proxy = https.request(options, function (incoming) {
    var data = "";
    incoming.on("readable", function () {
      data += incoming.read();
    });

    incoming.pipe(res, {
      end: true,
    });

    res.writeHead(incoming.statusCode, { ...headers, ...incoming.headers });
  });

  req.pipe(proxy, {
    end: true,
  });
}

http.createServer(onRequest).listen(port);
console.log(`Proxy app listening on port ${port}`);
