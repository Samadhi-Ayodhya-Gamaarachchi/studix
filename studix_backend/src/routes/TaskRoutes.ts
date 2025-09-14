import { Router } from "express";
import auth, { AuthRequest } from "../middleWare/auth";
import Task from "../models/Task";

const router = Router();

// GET /api/tasks
router.get("/", auth, async (req: AuthRequest, res) => {
  const tasks = await Task.find({ user: (req.user as any).id }).sort({ createdAt: -1 });
  res.json(tasks);
});

// POST /api/tasks
router.post("/", auth, async (req: AuthRequest, res) => {
  const { title, description, dueDate } = req.body;
  const task = new Task({ user: (req.user as any).id, title, description, dueDate });
  await task.save();
  res.status(201).json(task);
});

// PUT /api/tasks/:id
router.put("/:id", auth, async (req: AuthRequest, res) => {
  const updated = await Task.findOneAndUpdate(
    { _id: req.params.id, user: (req.user as any).id },
    req.body,
    { new: true }
  );
  if (!updated) return res.status(404).json({ message: "Task not found" });
  res.json(updated);
});

// PATCH /api/tasks/:id (for partial updates like toggling completion)
router.patch("/:id", auth, async (req: AuthRequest, res) => {
  const updated = await Task.findOneAndUpdate(
    { _id: req.params.id, user: (req.user as any).id },
    req.body,
    { new: true }
  );
  if (!updated) return res.status(404).json({ message: "Task not found" });
  res.json(updated);
});

// DELETE /api/tasks/:id
router.delete("/:id", auth, async (req: AuthRequest, res) => {
  const deleted = await Task.findOneAndDelete({ _id: req.params.id, user: (req.user as any).id });
  if (!deleted) return res.status(404).json({ message: "Task not found" });
  res.json({ message: "Deleted" });
});

export default router;
