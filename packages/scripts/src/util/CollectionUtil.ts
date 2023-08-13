export const asyncFilter = async function <T>(
  items: T[],
  callback: (value: T, index?: number, array?: T[]) => Promise<boolean>
): Promise<T[]> {
  const result: T[] = []
  for (let it = 0; it < items.length; it++) {
    if (await callback(items[it], it, items)) result.push(items[it])
  }
  return result
}
