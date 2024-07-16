import { _mock } from "src/_mock";

// TO GET THE USER FROM THE AUTHCONTEXT, YOU CAN USE

// CHANGE:
// import { useMockedUser } from 'src/hooks/use-mocked-user';
// const { user } = useMockedUser();

// TO:
// import { useAuthContext } from 'src/auth/hooks';
// const { user } = useAuthContext();

// ----------------------------------------------------------------------

export function useMockedUser() {
  const user = {
    id: "8864c717-587d-472a-929a-8e5f298024da-0",
    displayName: "Test User",
    email: "test@test.com",
    password: "demo1234",
    photoURL: _mock.image.avatar(24),
    phoneNumber: "+637539664",
    country: "Serbia",
    address: "Bulevar Nemanjica",
    state: "Nis",
    city: "Nis",
    zipCode: "18 000",
    about: "ThermoViz is my vision.",
    role: "admin",
    isPublic: true,
  };

  return { user };
}
