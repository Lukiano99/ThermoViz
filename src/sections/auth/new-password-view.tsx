"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import LoadingButton from "@mui/lab/LoadingButton";
import Alert from "@mui/material/Alert";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { NewPasswordIcon } from "src/assets/icons";
import { useAuthContext } from "src/auth/hooks";
import FormProvider, { RHFTextField } from "src/components/hook-form";
import Iconify from "src/components/iconify";
import { useBoolean } from "src/hooks/use-boolean";
import { useRouter } from "src/routes/hooks";
import { paths } from "src/routes/paths";
import * as Yup from "yup";

// ----------------------------------------------------------------------

export default function NewPasswordView() {
  const router = useRouter();

  const [errorMsg, setErrorMsg] = useState("");

  const { updatePassword } = useAuthContext();

  const password = useBoolean();

  const NewPasswordSchema = Yup.object().shape({
    password: Yup.string()
      .min(6, "Lozinka mora da sadrzi najmanje 6 karaktera")
      .required("Lozinka je obavezno polje"),
    confirmPassword: Yup.string()
      .required("Potvrda lozinke je obavezno polje")
      .oneOf([Yup.ref("password")], "Lozinke moraju da se poklapaju"),
  });

  const defaultValues = {
    password: "",
    confirmPassword: "",
  };

  const methods = useForm({
    mode: "onChange",
    resolver: yupResolver(NewPasswordSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      await updatePassword?.(data.password);

      router.push(paths.overview.root);
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
    <>
      <NewPasswordIcon sx={{ height: 96 }} />

      <Stack spacing={1} sx={{ mt: 3, mb: 5 }}>
        <Typography variant="h3">Nova Lozinka</Typography>

        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          Uspešno ažuriranje omogućava pristup pomoću nove lozinke
        </Typography>
      </Stack>
    </>
  );

  const renderForm = (
    <Stack spacing={3}>
      <RHFTextField
        name="password"
        label="Nova Lozinka"
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

      <RHFTextField
        name="confirmPassword"
        label="Potvrda Nove Lozinke"
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
        type="submit"
        size="large"
        variant="contained"
        loading={isSubmitting}
      >
        Azuriraj Lozinku
      </LoadingButton>
    </Stack>
  );

  return (
    <>
      {renderHead}

      {!!errorMsg && (
        <Alert severity="error" sx={{ textAlign: "left", mb: 3 }}>
          {errorMsg}
        </Alert>
      )}

      <FormProvider methods={methods} onSubmit={onSubmit}>
        {renderForm}
      </FormProvider>
    </>
  );
}
