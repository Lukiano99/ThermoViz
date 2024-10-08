import { checkboxClasses, type CheckboxProps } from "@mui/material/Checkbox";
import { type Theme } from "@mui/material/styles";

// ----------------------------------------------------------------------

export function checkbox(theme: Theme) {
  return {
    MuiCheckbox: {
      styleOverrides: {
        root: ({ ownerState }: { ownerState: CheckboxProps }) => {
          const { color } = ownerState;

          return {
            padding: theme.spacing(1),
            ...(color === "default" && {
              [`&.${checkboxClasses.checked}`]: {
                color: theme.palette.text.primary,
              },
            }),
            [`&.${checkboxClasses.disabled}`]: {
              color: theme.palette.action.disabled,
            },
          };
        },
      },
    },
  };
}
