/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { useCallback, useEffect, useState } from "react";

// ----------------------------------------------------------------------

export function useLocalStorage(key: string, initialState: unknown) {
  const [state, setState] = useState(initialState);

  useEffect(() => {
    const restored = getStorage(key);

    if (restored) {
      setState((prevValue: unknown) => ({
        ...(prevValue as object),
        ...restored,
      }));
    }
  }, [key]);

  const updateState = useCallback(
    (updateValue: unknown) => {
      setState((prevValue: unknown) => {
        setStorage(key, {
          ...(prevValue as object),
          ...(updateValue as object),
        });

        return {
          ...(prevValue as object),
          ...(updateValue as object),
        };
      });
    },
    [key],
  );

  const update = useCallback(
    (name: string, updateValue: unknown) => {
      updateState({
        [name]: updateValue,
      });
    },
    [updateState],
  );

  const reset = useCallback(() => {
    removeStorage(key);
    setState(initialState);
  }, [initialState, key]);

  return {
    state,
    update,
    reset,
  };
}

// ----------------------------------------------------------------------

export const getStorage = (key: string) => {
  let value = null;

  try {
    const result = window.localStorage.getItem(key);

    if (result) {
      value = JSON.parse(result);
    }
  } catch (error) {
    console.error(error);
  }

  return value;
};

export const setStorage = (key: string, value: unknown) => {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(error);
  }
};

export const removeStorage = (key: string) => {
  try {
    window.localStorage.removeItem(key);
  } catch (error) {
    console.error(error);
  }
};
