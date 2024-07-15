import { useMemo } from "react";
import SvgColor from "src/components/svg-color";
import { paths } from "src/routes/paths";

// ----------------------------------------------------------------------

const icon = (name: string) => (
  <SvgColor
    src={`/assets/icons/navbar/${name}.svg`}
    sx={{ width: 1, height: 1 }}
  />
  // OR
  // <Iconify icon="fluent:mail-24-filled" />
  // https://icon-sets.iconify.design/solar/
  // https://www.streamlinehq.com/icons
);

const ICONS = {
  job: icon("ic_job"),
  blog: icon("ic_blog"),
  chat: icon("ic_chat"),
  mail: icon("ic_mail"),
  user: icon("ic_user"),
  file: icon("ic_file"),
  lock: icon("ic_lock"),
  tour: icon("ic_tour"),
  order: icon("ic_order"),
  label: icon("ic_label"),
  blank: icon("ic_blank"),
  kanban: icon("ic_kanban"),
  folder: icon("ic_folder"),
  banking: icon("ic_banking"),
  booking: icon("ic_booking"),
  invoice: icon("ic_invoice"),
  product: icon("ic_product"),
  calendar: icon("ic_calendar"),
  disabled: icon("ic_disabled"),
  external: icon("ic_external"),
  menuItem: icon("ic_menu_item"),
  ecommerce: icon("ic_ecommerce"),
  analytics: icon("ic_analytics"),
  dashboard: icon("ic_dashboard"),
  chart: icon("ic_chart"),
  temperature: icon("ic_temperature"),
  energy: icon("ic_energy"),
  consumption: icon("ic_consumption"),
  location: icon("ic_location"),
  settings: icon("ic_settings"),
  report: icon("ic_report"),
  notification: icon("ic_notification"),
  help: icon("ic_help"),
};

// ----------------------------------------------------------------------

export function useNavData() {
  const data = useMemo(
    () => [
      // MAIN
      // ----------------------------------------------------------------------
      {
        subheader: "home",
        items: [
          {
            title: "overview",
            path: paths.overview.root,
            icon: ICONS.dashboard,
          },
        ],
      },
      // DATA ANALYSIS
      // ----------------------------------------------------------------------
      {
        subheader: "data analysis",
        items: [
          {
            title: "Analytics",
            path: paths.data_analysis.analytics,
            icon: ICONS.analytics,
          },
          {
            title: "Graphs",
            path: paths.data_analysis.graphs,
            icon: ICONS.chart,
          },
          {
            title: "Temperature Trends",
            path: paths.data_analysis.temperature_trends,
            icon: ICONS.temperature,
          },
          {
            title: "Energy Trends",
            path: paths.data_analysis.energy_trends,
            icon: ICONS.energy,
          },
        ],
      },

      // ENERGY_MANAGEMENT
      // ----------------------------------------------------------------------
      {
        subheader: "energy management",
        items: [
          {
            title: "consumption",
            path: paths.energy_management.consumption,
            icon: ICONS.consumption,
          },
          {
            title: "locations",
            path: paths.energy_management.locations,
            icon: ICONS.location,
          },
        ],
      },

      // ADMINISTRATION
      // ----------------------------------------------------------------------
      {
        subheader: "administration",
        items: [
          {
            title: "settings",
            path: paths.administration.settings,
            icon: ICONS.settings,
          },
          {
            title: "reports",
            path: paths.administration.reports,
            icon: ICONS.report,
          },
          {
            title: "notifications",
            path: paths.administration.notifications,
            icon: ICONS.notification,
          },
        ],
      },
      // SUPPORT
      // ----------------------------------------------------------------------
      {
        subheader: "support",
        items: [
          {
            title: "help",
            path: paths.support.help,
            icon: ICONS.help,
          },
        ],
      },

      // // MANAGEMENT
      // // ----------------------------------------------------------------------
      // {
      //   subheader: "management",
      //   items: [
      //     {
      //       title: "user",
      //       path: paths.dashboard.group.root,
      //       icon: ICONS.user,
      //       children: [
      //         { title: "four", path: paths.dashboard.group.root },
      //         { title: "five", path: paths.dashboard.group.five },
      //         { title: "six", path: paths.dashboard.group.six },
      //       ],
      //     },
      //   ],
      // },
    ],
    [],
  );

  return data;
}
