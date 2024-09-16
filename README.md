# Next.js tRPC App

This application is built using **Next.js**, **tRPC**, **Prisma**, **Supabase** for authentication, **Material UI (MUI)** components, and **ApexCharts** for rendering charts. The project uses **pnpm**, but can also be run with **npm**, **bun**, or **yarn**.

Repository URL: [https://github.com/Lukiano99/ThermoViz.git](https://github.com/Lukiano99/ThermoViz.git)

---

Ova aplikacija je izgrađena korišćenjem **Next.js**, **tRPC**, **Prisma**, **Supabase** za autentifikaciju, **Material UI (MUI)** komponenti, i **ApexCharts** za grafike. Projekat koristi **pnpm**, ali se može koristiti i sa **npm**, **bun** ili **yarn**.

URL repozitorijuma: [https://github.com/Lukiano99/ThermoViz.git](https://github.com/Lukiano99/ThermoViz.git)

## How to Run the Project / Kako Pokrenuti Projekat

1. Clone the repository / Klonirajte repozitorijum:
    ```bash
    git clone https://github.com/Lukiano99/ThermoViz.git
    ```

2. Install dependencies using **pnpm** (or `npm`, `yarn`, `bun`) / Instalirajte zavisnosti koristeći **pnpm** (ili `npm`, `yarn`, `bun`):
    ```bash
    pnpm install
    ```

3. Configure the **.env** file / Konfigurišite **.env** fajl:
    - Add **API** keys for **Supabase** database and authentication / Dodajte **API** ključeve za **Supabase** bazu i autentifikaciju.
    - Example environment variables can be found in the `.env.example` file / Primer varijabli možete pronaći u fajlu `.env.example`.

4. Generate Prisma types / Generišite Prisma tipove:
    ```bash
    npx prisma generate
    ```

5. Start the development server / Pokrenite razvojni server:
    ```bash
    pnpm dev
    ```

## Technologies / Tehnologije

- **Next.js**: Server-side rendering and static site generator / Server-side rendering i statički sajt generator.
- **tRPC**: End-to-end type-safe API communication / End-to-end tip-safe API komunikacija.
- **Prisma**: ORM for database interaction / ORM za interakciju sa bazom podataka.
- **Supabase**: Database and authentication / Baza podataka i autentifikacija.
- **Material UI (MUI)**: UI components / Komponente za korisnički interfejs.
- **ApexCharts**: Library for interactive charts / Biblioteka za iscrtavanje interaktivnih grafika.

## Project Structure / Struktura Projekta

- `src/app/dashboard`: Main part of the application, dashboard functionalities / Glavni deo aplikacije, dashboard funkcionalnosti.
- `src/server`: Server-side logic and tRPC routers / Server-side logika i tRPC router-i.
- `src/prisma`: Prisma schema for defining models / Prisma schema za definisanje modela.

## Important Notes / Važne Napomene

- **Prisma** types must be generated using the following command / **Prisma** tipove je potrebno generisati pomoću sledeće komande:
    ```bash
    npx prisma generate
    ```

- Add **Supabase** API keys in the `.env` file to enable authentication and database / Postavite **Supabase** API ključeve u `.env` fajl kako biste omogućili autentifikaciju i bazu podataka.

## References / Reference

- [Next.js Documentation](https://nextjs.org/docs) / [Next.js Dokumentacija](https://nextjs.org/docs)
- [tRPC Documentation](https://trpc.io/docs) / [tRPC Dokumentacija](https://trpc.io/docs)
- [T3 Stack Documentation](https://create.t3.gg/) / [T3 Stack Dokumentacija](https://create.t3.gg/)
- [Supabase Documentation](https://supabase.com/docs) / [Supabase Dokumentacija](https://supabase.com/docs)
- [Prisma Documentation](https://www.prisma.io/docs) / [Prisma Dokumentacija](https://www.prisma.io/docs)
- [Material UI Documentation](https://mui.com/) / [Material UI Dokumentacija](https://mui.com/)
- [ApexCharts Documentation](https://apexcharts.com/docs) / [ApexCharts Dokumentacija](https://apexcharts.com/docs)

## Requirements / Zahtevi

- Node.js 14.x or higher / Node.js 14.x ili noviji.
- API keys for Supabase / API ključevi za Supabase.
