const proxy = require("http-proxy-middleware");

module.exports = function (app) {
  // const BASE_URL="http://localhost:5000"
  const BASE_URL="https://ai-based-grievance-portal.onrender.com"

  app.use(proxy("/api/*", { target: `${BASE_URL}` }));
};
