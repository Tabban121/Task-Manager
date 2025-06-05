import { Router } from 'express';
import { getTasks , createTask, updateTask , deleteTask } from '../controllers/Taskcontrollers';
import {authenticate} from '../middlewares/authenticate.middleware';
const Taskrouter = Router();
Taskrouter.get('/',authenticate, getTasks);
Taskrouter.post('/',authenticate, createTask);
Taskrouter.put('/:id', authenticate, updateTask);
Taskrouter.delete('/:id', authenticate, deleteTask);

export default Taskrouter;
