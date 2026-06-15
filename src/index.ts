import { Hono } from "hono";
import { cors } from "hono/cors";
import { readFile, writeFile } from "fs/promises";
import { connectDb } from "./util/connectDb.js";
import { Schema, model } from "inspector/promises";

const todosSchema = new Schema({
  title :String,
  isdone: Boolean
}) 

const FILE_PATH = "./todos.json";

const app = new Hono();

app.use("*", cors());

const getTodos = async () => {
  const data = await readFile(FILE_PATH, "utf-8");

  return JSON.parse(data);
};

const saveTodos = async (todos: any[]) => {
  await writeFile(FILE_PATH, JSON.stringify(todos));
};

app.get("/", async (c) => {
  await connectDb();
  return c.json({
    message: "hello",
  });
});

app.get("/todos", async (c) => {
  const todos = await getTodos();
  return c.json({
    todos,
  });
});

app.get("/todos/:id", async (c) => {
  const id = c.req.param("id");

  const todos = await getTodos();

  const foundTodo = todos.find((todo: any) => todo.id === id);

  if (!foundTodo) {
    return c.json(
      {
        message: "Todo not found",
      },
      404,
    );
  }

  return c.json({
    message: "Success",
    todo: foundTodo,
  });
});

app.post("/todo", async (c) => {
  const input = await c.req.json();

  if (!input.id) {
    return c.json(
      {
        message: "Id alga",
      },
      400,
    );
  }
  if (!input.title) {
    return c.json(
      {
        message: "Title alga",
      },
      400,
    );
  }

  const todos = await getTodos();

  todos.push({
    ...input,
    isDone: false,
  });

  await saveTodos(todos);

  return c.json({
    message: "Success",
    todos,
  });
});

app.put("/todo/:id", async (c) => {
  const id = c.req.param("id");
  const body = await c.req.json();

  const todos = await getTodos();

  const todoIndex = todos.findIndex((t: any) => t.id === id);

  if (todoIndex === -1) {
    return c.json({ message: "Todo not found" }, 404);
  }

  todos[todoIndex] = {
    ...todos[todoIndex],
    ...body,
  };

  return c.json({
    message: "Updated successfully",
    todo: todos[todoIndex],
  });
});

app.delete("/todo/:id", async (c) => {
  const id = c.req.param("id");

  const todos = await getTodos();

  const index = todos.findIndex((t: any) => t.id === id);

  if (index === -1) {
    return c.json({ message: "Todo baihgui" }, 404);
  }

  const deleted = todos.splice(index, 1);
  await saveTodos(todos);

  return c.json({
    message: "Delete a,jilttai",
    todo: deleted[0],
    todos,
  });
});

app.get("/hello", (c) => {
  return c.json(
    {
      message: "Hello",
    },
    200,
  );
});

export default app;
