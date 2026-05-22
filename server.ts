import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware
  app.use(express.json());

  // Database location in the workspace
  const DB_FILE = path.join(process.cwd(), "wishes_db.json");

  // Load database arrays safely
  const readDb = (): any[] => {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, "utf-8");
        return JSON.parse(raw);
      }
    } catch (e) {
      console.error("Failed to read database file, returning empty array", e);
    }
    return [];
  };

  // Persist database arrays
  const writeDb = (data: any[]) => {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
    } catch (e) {
      console.error("Failed to write to database file", e);
    }
  };

  // API - Get all submissions (Admin Only / Secret Portal lookup)
  app.get("/api/wishes", (req, res) => {
    const data = readDb();
    res.json({ success: true, wishes: data });
  });

  // API - Send a new wish to server db silently
  app.post("/api/wishes", (req, res) => {
    const { text, timestamp, color, id } = req.body;
    if (!text || typeof text !== "string") {
      return res.status(400).json({ success: false, error: "Text is required and must be a string." });
    }

    const data = readDb();
    const wishId = id || Math.random().toString(36).substring(2, 9);
    
    // Double check duplicates
    const alreadyExists = data.some((w) => w.id === wishId);
    
    if (!alreadyExists) {
      const newWish = {
        id: wishId,
        text: text.trim().slice(0, 500),
        timestamp: timestamp || new Date().toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" }),
        color: color || "#fdba74",
        createdAt: new Date().toISOString()
      };
      
      data.unshift(newWish); // Prepend to show latest wishes first
      writeDb(data);
    }

    res.json({ success: true, wishes: data });
  });

  // API - Delete a wish
  app.delete("/api/wishes/:id", (req, res) => {
    const { id } = req.params;
    let data = readDb();
    const initialSize = data.length;
    data = data.filter((w) => w.id !== id);
    
    if (data.length !== initialSize) {
      writeDb(data);
    }

    res.json({ success: true, wishes: data });
  });

  // Vite development integration or static files rendering
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    
    // Express 4 wildcard catch-all for SPA client routing
    app.get("*", (req, res) => {
       res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Express server routing at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Critical crash in Express launcher server: ", err);
});
