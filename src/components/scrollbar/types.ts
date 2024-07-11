import { type SxProps, type Theme } from "@mui/material/styles";
import { type Props } from "simplebar-react";

// ----------------------------------------------------------------------

export interface ScrollbarProps extends Props {
  children?: React.ReactNode;
  sx?: SxProps<Theme>;
}
