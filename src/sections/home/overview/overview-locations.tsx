import { LinearProgress } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Card, { type CardProps } from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import Stack from "@mui/material/Stack";
import { useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import Label from "src/components/label";
import Scrollbar from "src/components/scrollbar";

import { type RouterOutputs } from "@/trpc/react";

// ----------------------------------------------------------------------

type ItemProps =
  RouterOutputs["measurement"]["getAverageTemperatureByLocation"][number];

interface Props extends CardProps {
  title?: string;
  subheader?: string;
  list: ItemProps[];
}

export default function OverviewLocations({
  title,
  subheader,
  list,
  ...other
}: Props) {
  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} />

      <Scrollbar>
        <Stack spacing={3} sx={{ p: 3, minWidth: 360 }}>
          {list.map((location) => (
            <LocationItem key={location.location} location={location} />
          ))}
        </Stack>
      </Scrollbar>
    </Card>
  );
}

// ----------------------------------------------------------------------

type ApplicationItemProps = {
  location: ItemProps;
};

function LocationItem({ location }: ApplicationItemProps) {
  const locationName = location.location;
  const { t_amb, t_ref } = location._avg;
  const energyByLocation = location._sum.e;
  const totalEnergy = location.totalEnergy;
  const theme = useTheme();

  const tempDiffEfficiency = t_ref - t_amb < 24;

  return (
    <Stack direction="row" alignItems="start" spacing={2}>
      <Avatar
        variant="rounded"
        sx={{
          width: 72,
          height: 72,
          bgcolor: "background.neutral",
        }}
      >
        <Typography variant="h5" color={theme.palette.primary.main}>
          {locationName.slice(-3)}
        </Typography>
      </Avatar>

      <Box sx={{ flexGrow: 1, minWidth: 0 }}>
        <Typography variant="subtitle2" noWrap>
          {locationName}
        </Typography>

        <Stack
          direction="row"
          alignItems="center"
          justifyContent="start"
          spacing={1}
          sx={{ mt: 0.5, color: "text.secondary" }}
        >
          <Stack
            direction="column"
            alignItems="start"
            justifyContent="space-between"
            sx={{ mt: 0.5, color: "text.secondary" }}
          >
            <Typography variant="caption" sx={{ ml: 0.5, mr: 1 }}>
              Amb
            </Typography>
            <Label color={tempDiffEfficiency ? "success" : "error"}>
              {t_amb} °C
            </Label>
          </Stack>
          <Stack
            direction="column"
            alignItems="start"
            justifyContent="space-between"
            sx={{ mt: 0.5, color: "text.secondary" }}
          >
            <Typography variant="caption" sx={{ ml: 0.5, mr: 1 }}>
              Ref
            </Typography>
            <Label variant="soft">{t_ref} °C</Label>
          </Stack>
        </Stack>
      </Box>

      <Stack alignItems="">
        {/* <Rating
          readOnly
          size="small"
          precision={0.5}
          name="reviews"
          value={5}
        /> */}
        <Typography>
          {((energyByLocation / totalEnergy) * 100).toFixed(2)} %
        </Typography>
        <LinearProgress
          value={(energyByLocation / totalEnergy) * 100}
          variant="determinate"
        />
        <Typography variant="caption" sx={{ mt: 0.5, color: "text.secondary" }}>
          energy used
        </Typography>
      </Stack>
    </Stack>
  );
}
