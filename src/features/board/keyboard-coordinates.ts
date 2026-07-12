import type { ClientRect, KeyboardCoordinateGetter, UniqueIdentifier } from '@dnd-kit/core';

export const boardKeyboardCoordinates: KeyboardCoordinateGetter = (
  event,
  { context: { droppableRects, droppableContainers, collisionRect } },
) => {
  if (!collisionRect || !['ArrowLeft', 'ArrowRight'].includes(event.code)) return;
  event.preventDefault();

  const columns = droppableContainers
    .getEnabled()
    .map((c) => ({ id: c.id, rect: droppableRects.get(c.id) }))
    .filter((c): c is { id: UniqueIdentifier; rect: ClientRect } => !!c.rect)
    .sort((a, b) => a.rect.left - b.rect.left);

  const centerX = collisionRect.left + collisionRect.width / 2;
  const current = columns.findIndex((c) => centerX >= c.rect.left && centerX <= c.rect.right);
  const next = columns[current + (event.code === 'ArrowRight' ? 1 : -1)];
  if (!next) return;

  return { x: next.rect.left + next.rect.width / 2, y: next.rect.top + 40 };
};
