"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import LoadingButton from "@mui/lab/LoadingButton";
import Alert from "@mui/material/Alert";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useAuthContext } from "src/auth/hooks";
import FormProvider, { RHFTextField } from "src/components/hook-form";
import Iconify from "src/components/iconify";
import { useBoolean } from "src/hooks/use-boolean";
import { RouterLink } from "src/routes/components";
import { useRouter } from "src/routes/hooks";
import { paths } from "src/routes/paths";
import * as Yup from "yup";

// ----------------------------------------------------------------------

export default function RegisterView() {
  const { register } = useAuthContext();

  const [errorMsg, setErrorMsg] = useState("");

  const router = useRouter();

  const password = useBoolean();

  const RegisterSchema = Yup.object().shape({
    firstName: Yup.string().required("Ime je obavezno polje"),
    lastName: Yup.string().required("Prezime je obavezno polje"),
    email: Yup.string()
      .required("Email je obavezano polje")
      .email("Email mora da bude validna email adresa"),
    password: Yup.string().required("Lozinka je obavezno polje"),
  });

  const defaultValues = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  };

  const methods = useForm({
    resolver: yupResolver(RegisterSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      await register?.(
        data.email,
        data.password,
        data.firstName,
        data.lastName,
      );
      const searchParams = new URLSearchParams({
        email: data.email,
      }).toString();

      const href = `${paths.auth.verify}?${searchParams}`;

      router.push(href);
    } catch (error) {
      console.error(error);
      reset();
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      setErrorMsg(typeof error === "string" ? error : error.message);
    }
  });

  const renderHead = (
    <Stack spacing={2} sx={{ mb: 5, position: "relative" }}>
      <Typography variant="h4">Registruj se apsolutno besplatno</Typography>

      <Stack direction="row" spacing={0.5}>
        <Typography variant="body2"> Vec imas nalog? </Typography>

        <Link
          href={paths.auth.login}
          component={RouterLink}
          variant="subtitle2"
        >
          Prijavi se
        </Link>
      </Stack>
    </Stack>
  );

  const renderTerms = (
    <Typography
      component="div"
      sx={{
        mt: 2.5,
        textAlign: "center",
        typography: "caption",
        color: "text.secondary",
      }}
    >
      {"Prijavom prihvatam "}
      <Link underline="always" color="text.primary">
        Uslovi korišćenja
      </Link>
      {" i "}
      <Link underline="always" color="text.primary">
        Politika o privatnosti
      </Link>
      .
    </Typography>
  );

  const renderForm = (
    <Stack spacing={2.5}>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
        <RHFTextField name="firstName" label="Ime" />
        <RHFTextField name="lastName" label="Prezime" />
      </Stack>

      <RHFTextField name="email" label="Email adresa" />

      <RHFTextField
        name="password"
        label="Lozinka"
        type={password.value ? "text" : "password"}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={password.onToggle} edge="end">
                <Iconify
                  icon={
                    password.value ? "solar:eye-bold" : "solar:eye-closed-bold"
                  }
                />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <LoadingButton
        fullWidth
        color="inherit"
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
      >
        Napravi nalog
      </LoadingButton>
    </Stack>
  );

  return (
    <>
      {renderHead}

      {!!errorMsg && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errorMsg}
        </Alert>
      )}

      <FormProvider methods={methods} onSubmit={onSubmit}>
        {renderForm}
      </FormProvider>

      {renderTerms}
    </>
  );
}
