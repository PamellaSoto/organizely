export const buildTaskPayload = (task, overrides = {}) => ({
  description:
    overrides.description !== undefined
      ? overrides.description
      : task.description,
  isCompleted:
    overrides.isCompleted !== undefined
      ? overrides.isCompleted
      : task.isCompleted,
  isArchived:
    overrides.isArchived !== undefined
      ? overrides.isArchived
      : task.isArchived || false,
  dayOfWeek:
    overrides.dayOfWeek !== undefined ? overrides.dayOfWeek : task.dayOfWeek,
  priority: Number(
    overrides.priority !== undefined ? overrides.priority : task.priority
  ),
  category:
    overrides.category !== undefined
      ? // aceita id direto ou objeto com id
        typeof overrides.category === "object"
        ? overrides.category?.id ?? null
        : overrides.category
      : task.category?.id ?? null,
});
