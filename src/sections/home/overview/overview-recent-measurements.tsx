import Card, { type CardProps } from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import CustomPopover, { usePopover } from "src/components/custom-popover";
import Iconify from "src/components/iconify";
import Label from "src/components/label";
import Scrollbar from "src/components/scrollbar";
import { TableHeadCustom } from "src/components/table";

import { type RouterOutputs } from "@/trpc/react";

// ----------------------------------------------------------------------

type RowProps = RouterOutputs["measurement"]["getRecent"][number];

interface Props extends CardProps {
  title?: string;
  subheader?: string;
  tableData: RowProps[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tableLabels: any;
}

export default function OverviewRecentMeasurements({
  title,
  subheader,
  tableData,
  tableLabels,
  ...other
}: Props) {
  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} sx={{ mb: 3 }} />

      <TableContainer sx={{ overflow: "unset" }}>
        <Scrollbar>
          <Table sx={{ minWidth: 680 }}>
            {/* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment */}
            <TableHeadCustom headLabel={tableLabels} />

            <TableBody>
              {tableData.map((row, idx) => (
                <AppNewInvoiceRow key={idx} row={row} />
              ))}
            </TableBody>
          </Table>
        </Scrollbar>
      </TableContainer>

      <Divider sx={{ borderStyle: "dashed" }} />

      {/* <Box sx={{ p: 2, textAlign: "right" }}>
        <Button
          size="small"
          color="inherit"
          endIcon={
            <Iconify
              icon="eva:arrow-ios-forward-fill"
              width={18}
              sx={{ ml: -0.5 }}
            />
          }
        >
          View All
        </Button>
      </Box> */}
    </Card>
  );
}

// ----------------------------------------------------------------------

type AppNewInvoiceRowProps = {
  row: RowProps;
};

function AppNewInvoiceRow({ row }: AppNewInvoiceRowProps) {
  const popover = usePopover();

  const handleSeeDetails = () => {
    popover.onClose();
    console.info("DETAILS", `${row.date}, ${row.time}, ${row.location}`);
  };

  const handleShare = () => {
    popover.onClose();
    console.info("SHARE", `${row.date}, ${row.time}, ${row.location}`);
  };

  return (
    <>
      <TableRow>
        <TableCell>{row.date}</TableCell>

        <TableCell>{row.time}</TableCell>

        {/* <TableCell>{row.location}</TableCell> */}

        <TableCell>
          <Label
            variant="soft"
            color={
              (row.location.includes("L4") && "primary") ||
              (row.location.includes("L8") && "secondary") ||
              (row.location.includes("L12") && "info") ||
              (row.location.includes("L17") && "success") ||
              (row.location.includes("L22") && "warning") ||
              "default"
            }
          >
            {row.location}
          </Label>
        </TableCell>

        <TableCell>{row.energy} KWh</TableCell>

        <TableCell>{row.power} KW</TableCell>

        <TableCell align="right" sx={{ pr: 1 }}>
          <IconButton
            color={popover.open ? "inherit" : "default"}
            onClick={popover.onOpen}
          >
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 160 }}
      >
        <MenuItem onClick={handleSeeDetails}>
          <Iconify icon="eva:cloud-download-fill" />
          See Details
        </MenuItem>

        <MenuItem onClick={handleShare}>
          <Iconify icon="solar:share-bold" />
          Share
        </MenuItem>
      </CustomPopover>
    </>
  );
}
