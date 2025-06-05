import { Request, Response } from 'express';
import Tasks from '../models/Tasks';
import createUserTask  from '../services/tasks.services';
export const getTasks = async (_req: Request, res: Response) => {
    console.log( ' Task  controller called :)');
  const tasks = await Tasks.find();
  res.json(tasks);
};

export const createTask = async (req: Request, res: Response) => {

  const userId = res.locals.user;

  console.log("User ", userId)
  const task = await createUserTask(req.body, userId);

  console.log(task);
  res.status(201).json(task);
};
// updateTask with id
export const updateTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updatedTask = await Tasks.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedTask) {
      res.status(404).json({ message: 'Task not found' });
      return;
    }
    res.json(updatedTask); // send response but do NOT return it
  } catch (error) {
    res.status(400).json({ message: 'Invalid task ID or data', error });
  }
};


// Delete a task by ID
export const deleteTask = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const deletedTask = await Tasks.findByIdAndDelete(id);
    if (!deletedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Invalid task ID', error });
  }
};