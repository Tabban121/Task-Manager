import createTask from "../repositories/task.repositories";

const createUserTask = async (taskData: any, userId: string) => {
  const task = await createTask({
    ...taskData,
    userId
  });
  return task;
};
export default createUserTask