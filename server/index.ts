import express, { type Request, type Response, type NextFunction } from "express";
import session from "express-session";
import { registerRoutes } from "./routes";
import { initializeDatabase } from "./db";

const app = express();

const normalizeOrigin = (value?: string | null): string | undefined => {
  if (!value) return undefined;
  return value.trim().replace(/\/$/, "");
};

const baseAllowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  "https://celik-kuyumcu-frontend.onrender.com",
  "https://celikkuyumcu.onrender.com",
  process.env.FRONTEND_URL,
];

const allowedOriginSet = new Set(
  baseAllowedOrigins
    .map((origin) => normalizeOrigin(origin))
    .filter((origin): origin is string => Boolean(origin)),
);

app.use((req, res, next) => {
  const origin = req.headers.origin as string | undefined;
  const normalizedOrigin = normalizeOrigin(origin);

  if (process.env.NODE_ENV === "development") {
    res.setHeader("Access-Control-Allow-Origin", origin || "*");
  } else if (normalizedOrigin && allowedOriginSet.has(normalizedOrigin)) {
    res.setHeader("Access-Control-Allow-Origin", normalizedOrigin);
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

(async () => {
  try {
    await initializeDatabase();
    const server = await registerRoutes(app);

    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
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
        console.log(`Backend API running on port ${port}`);
      },
    );
  } catch (error) {
    console.error("Sunucu baslatma hatasi:", error);
    process.exit(1);
  }
})();
