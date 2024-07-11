"use client";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { EmailInboxIcon } from "src/assets/icons";
import Iconify from "src/components/iconify";
import { RouterLink } from "src/routes/components";
import { useSearchParams } from "src/routes/hooks";
import { paths } from "src/routes/paths";

// ----------------------------------------------------------------------

export default function VerifyView() {
  const searchParams = useSearchParams();

  const email = searchParams.get("email");

  const renderHead = (
    <>
      <EmailInboxIcon sx={{ mb: 5, height: 96 }} />

      <Typography variant="h3" sx={{ mb: 1 }}>
        Proveri svoj email!
      </Typography>

      <Stack
        spacing={1}
        sx={{ color: "text.secondary", typography: "body2", mb: 5 }}
      >
        <Box component="span"> Poslali smo ti potvrdni link na email</Box>
        <Box component="strong" sx={{ color: "text.primary" }}>
          {email}
        </Box>
        <Box component="div">Proveri svoj inbox/spam</Box>
      </Stack>
    </>
  );

  return (
    <>
      {renderHead}

      <Button
        component={RouterLink}
        href={paths.auth.login}
        size="large"
        color="inherit"
        variant="contained"
        startIcon={<Iconify icon="eva:arrow-ios-back-fill" />}
        sx={{ alignSelf: "center" }}
      >
        Vrati se na prijavu
      </Button>
    </>
  );
}
