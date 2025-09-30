import express from "express";
import session from "express-session";
import { registerRoutes } from "./routes";
import { initializeDatabase } from "./db";

const app = express();

app.use((req, res, next) => {
  const allowedOrigins = [
    "http://localhost:3000",
    "http://localhost:5173",
    "https://celik-kuyumcu-frontend.onrender.com",
    process.env.FRONTEND_URL || "http://localhost:3000",
  ];

  const origin = req.headers.origin as string | undefined;

  if (process.env.NODE_ENV === "development") {
    res.setHeader("Access-Control-Allow-Origin", origin || "*");
  } else if (origin && allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }

  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Max-Age", "86400");

  if (req.method === "OPTIONS") {
    res.sendStatus(200);
    return;
  }

  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(
  session({
    secret: process.env.SESSION_SECRET || "celik-kuyumcu-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    },
  }),
);

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, unknown> | undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson: any, ...args: any[]) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = ${req.method}   in ms;
      if (capturedJsonResponse) {
        try {
          logLine +=  :: ;
        } catch (error) {
          console.error("response log stringify error", error);
        }
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "...";
      }

      console.log(logLine);
    }
  });

  next();
});

(async () => {
  try {
    await initializeDatabase();
    const server = await registerRoutes(app);

    app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";
      res.status(status).json({ message });
      console.error(err);
    });

    const port = parseInt(process.env.PORT || "5000", 10);
    server.listen(
      {
        port,
        host: "0.0.0.0",
        reusePort: true,
      },
      () => {
        console.log(Backend API running on port );
      },
    );
  } catch (error) {
    console.error("Sunucu baslatma hatasi:", error);
    process.exit(1);
  }
})();
