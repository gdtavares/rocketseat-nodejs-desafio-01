import { randomUUID } from "node:crypto";
import { Database } from "./database.js";
import { buildRoutePath } from "./utils/build-route-path.js";

const database = new Database();

export const routes = [
  {
    method: "GET",
    path: buildRoutePath("/tasks"),
    handler: (req, res) => {
      const tasks = database.select("tasks", null);

      return res.end(JSON.stringify(tasks));
    },
  },
  {
    method: "POST",
    path: buildRoutePath("/tasks"),
    handler: (req, res) => {
      const { title, description } = req.body;
      console.log("dados: ", title, description);
      if (!title || !description) {
        return res.writeHead(400).end(
          JSON.stringify({
            error: "title and description are required properties",
          })
        );
      }
      const task = {
        id: randomUUID(),
        title,
        description,
        completed_at: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      database.insert("tasks", task);

      return res.writeHead(201).end();
    },
  },
  {
    method: "PUT",
    path: buildRoutePath("/tasks/:id"),
    handler: (req, res) => {
      const { id } = req.params;
      const { title, description } = req.body;
      if (!title || !description) {
        return res.writeHead(400).end(
          JSON.stringify({
            error: "title and description are required properties",
          })
        );
      }
      const doesIdExists = database.select("tasks", null, id);
      if (!doesIdExists) {
        return res.writeHead(404).end(
          JSON.stringify({
            error: "There is no task with the provided id.",
          })
        );
      }
      database.update("tasks", id, {
        title,
        description,
        updated_at: new Date().toISOString(),
      });

      return res.writeHead(204).end();
    },
  },
  {
    method: "PATCH",
    path: buildRoutePath("/tasks/:id/complete"),
    handler: (req, res) => {
      const { id } = req.params;
      const doesIdExists = database.select("tasks", null, id);
      if (!doesIdExists) {
        return res.writeHead(404).end(
          JSON.stringify({
            error: "There is no task with the provided id.",
          })
        );
      }
      database.update("tasks", id, {
        completed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

      return res.writeHead(204).end();
    },
  },
  {
    method: "DELETE",
    path: buildRoutePath("/tasks/:id"),
    handler: (req, res) => {
      const { id } = req.params;
      const doesIdExists = database.select("tasks", null, id);
      if (!doesIdExists) {
        return res.writeHead(404).end(
          JSON.stringify({
            error: "There is no task with the provided id.",
          })
        );
      }
      database.delete("tasks", id);

      return res.writeHead(204).end();
    },
  },
];
