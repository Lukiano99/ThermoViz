/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  type NavItemBaseProps,
  type NavProps,
} from "src/components/nav-section";
import { flattenArray } from "src/utils/flatten-array";

// ----------------------------------------------------------------------

type ItemProps = {
  group: string;
  title: string;
  path: string;
};

export function getAllItems({ data }: NavProps) {
  const reduceItems = data
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    .map((list) => handleLoop(list.items, list.subheader))
    .flat();

  const items = flattenArray(reduceItems).map((option) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const group = splitPath(reduceItems, option.path);

    return {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      group: group && group.length > 1 ? group[0] : option.subheader,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      title: option.title,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      path: option.path,
    };
  });

  return items;
}

// ----------------------------------------------------------------------

type FilterProps = {
  inputData: ItemProps[];
  query: string;
};

export function applyFilter({ inputData, query }: FilterProps) {
  if (query) {
    inputData = inputData.filter(
      (item) =>
        item.title.toLowerCase().indexOf(query.toLowerCase()) !== -1 ||
        item.path.toLowerCase().indexOf(query.toLowerCase()) !== -1,
    );
  }

  return inputData;
}

// ----------------------------------------------------------------------

export function splitPath(array: NavItemBaseProps[], key: string) {
  let stack = array.map((item) => ({
    path: [item.title],
    currItem: item,
  }));

  while (stack.length) {
    const { path, currItem } = stack.pop() as {
      path: string[];
      currItem: NavItemBaseProps;
    };

    if (currItem.path === key) {
      return path;
    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (currItem.children?.length) {
      stack = stack.concat(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        currItem.children.map((item: NavItemBaseProps) => ({
          path: path.concat(item.title),
          currItem: item,
        })),
      );
    }
  }
  return null;
}

// ----------------------------------------------------------------------

export function handleLoop(array: unknown, subheader?: string) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
  return array?.map((list: unknown) => ({
    subheader,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    ...list,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    ...(list.children && {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      children: handleLoop(list.children, subheader),
    }),
  }));
}

// ----------------------------------------------------------------------

type GroupsProps = Record<string, ItemProps[]>;

export function groupedData(array: ItemProps[]) {
  const group = array.reduce((groups: GroupsProps, item) => {
    groups[item.group] = groups[item.group] ?? [];

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    groups[item.group].push(item);

    return groups;
  }, {});

  return group;
}
