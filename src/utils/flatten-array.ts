// ----------------------------------------------------------------------

export function flattenArray<T>(list: T[], key = "children"): T[] {
  let children: T[] = [];

  const flatten = list?.map((item: unknown) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (item[key]?.length) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      children = [...children, ...item[key]];
    }
    return item;
  });

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return flatten?.concat(
    children.length ? flattenArray(children, key) : children,
  );
}
