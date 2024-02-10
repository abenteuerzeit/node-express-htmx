import express from "express";
import path from "path";
import cors from "cors";
import { fileURLToPath } from "url";

// Initialize the express application
const app = express();

// Utility for creating raw HTML strings
const html = String.raw;

/**
 * Function to serve static files from the htmx library.
 * It constructs the path to the 'htmx.org' library within 'node_modules' and
 * uses express.static middleware to serve the files.
 * @returns Middleware function to serve htmx static files.
 */
const getHtmx = () =>
  express.static(
    path.join(
      path.dirname(fileURLToPath(import.meta.url)),
      "node_modules",
      "htmx.org",
      "dist",
    ),
  );

// Middleware to enable Cross-Origin Resource Sharing (CORS)
app.use(cors());

// Serve htmx static files under the "/static" route
app.use("/static", getHtmx());

// Middleware to parse URL-encoded data and JSON data in request bodies
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

/**
 * Route handler for the root path. It serves the initial HTML page
 * that includes a button demonstrating the use of htmx for dynamic content updates.
 * The button uses htmx attributes to configure AJAX POST requests.
 */
app.get("/", function (req, res) {
  return res.send(html`
    <!doctype html>
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width" />
        <title>HTMX Toggle Button Demo</title>
        <script src="/static/htmx.min.js"></script>
      </head>

      <body>
        <h1>HTMX Toggle Button</h1>

        <button
          hx-post="/ToggleButton"
          hx-swap="outerHTML"
          hx-vals='{"isClicked": "false"}'
        >
          Click for the first time...
        </button>
      </body>
    </html>
  `);
});

/**
 * POST route handler for the "/ToggleButton" endpoint.
 * It dynamically toggles the button text based on its current state,
 * which is passed as a JSON object in the request body.
 * The htmx attributes on the button ensure the request and content replacement
 * are handled without a full page refresh.
 */
app.post("/ToggleButton", function (req, res) {
  const isClicked = !(req.body.isClicked === "true");
  const text = isClicked ? "Clicked! Such Wow. Very Amaze." : "Click me :)";
  res.send(html`
    <button
      hx-post="/ToggleButton"
      hx-swap="outerHTML"
      hx-vals='{"isClicked": "${isClicked}"}'
    >
      ${text}
    </button>
  `);
});

// Start the express server on port 3000
app.listen(3000, () => {
  console.log("Express server initialized");
});
