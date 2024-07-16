"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import LoadingButton from "@mui/lab/LoadingButton";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { PasswordIcon } from "src/assets/icons";
import { useAuthContext } from "src/auth/hooks";
import FormProvider, { RHFTextField } from "src/components/hook-form";
import Iconify from "src/components/iconify";
import { RouterLink } from "src/routes/components";
import { useRouter } from "src/routes/hooks";
import { paths } from "src/routes/paths";
import * as Yup from "yup";

// ----------------------------------------------------------------------

export default function ForgotPasswordView() {
  const { forgotPassword } = useAuthContext();

  const router = useRouter();

  const ForgotPasswordSchema = Yup.object().shape({
    email: Yup.string()
      .required("Email is a required field")
      .email("Email must be a valid email address"),
  });

  const defaultValues = {
    email: "",
  };

  const methods = useForm({
    resolver: yupResolver(ForgotPasswordSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      await forgotPassword?.(data.email);

      const searchParams = new URLSearchParams({
        email: data.email,
      }).toString();

      const href = `${paths.auth.verify}?${searchParams}`;

      router.push(href);
    } catch (error) {
      console.error(error);
    }
  });

  const renderForm = (
    <Stack spacing={3} alignItems="center">
      <RHFTextField name="email" label="Email adresa" />

      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
      >
        Send request
      </LoadingButton>

      <Link
        component={RouterLink}
        href={paths.auth.login}
        color="inherit"
        variant="subtitle2"
        sx={{
          alignItems: "center",
          display: "inline-flex",
        }}
      >
        <Iconify icon="eva:arrow-ios-back-fill" width={16} />
        Back to Sign In Form
      </Link>
    </Stack>
  );

  const renderHead = (
    <>
      <PasswordIcon sx={{ height: 96 }} />

      <Stack spacing={1} sx={{ mt: 3, mb: 5 }}>
        <Typography variant="h3">Forgot your password?</Typography>

        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          Enter the email address associated with your account, and we will send
          you a link to reset your password via email.
        </Typography>
      </Stack>
    </>
  );

  return (
    <>
      {renderHead}

      <FormProvider methods={methods} onSubmit={onSubmit}>
        {renderForm}
      </FormProvider>
    </>
  );
}
