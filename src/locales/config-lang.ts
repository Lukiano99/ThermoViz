"use client";

// core (MUI)
import {
  arSA as arSACore,
  enUS as enUSCore,
  frFR as frFRCore,
  viVN as viVNCore,
  zhCN as zhCNCore,
} from "@mui/material/locale";
// data grid (MUI)
import {
  arSD as arSDDataGrid,
  enUS as enUSDataGrid,
  frFR as frFRDataGrid,
  viVN as viVNDataGrid,
  zhCN as zhCNDataGrid,
} from "@mui/x-data-grid";
// date pickers (MUI)
import {
  enUS as enUSDate,
  frFR as frFRDate,
  viVN as viVNDate,
  zhCN as zhCNDate,
} from "@mui/x-date-pickers/locales";
// date fns
import {
  arSA as arSAAdapter,
  enUS as enUSAdapter,
  fr as frFRAdapter,
  vi as viVNAdapter,
  zhCN as zhCNAdapter,
} from "date-fns/locale";
import merge from "lodash/merge";

// PLEASE REMOVE `LOCAL STORAGE` WHEN YOU CHANGE SETTINGS.
// ----------------------------------------------------------------------

export const allLangs = [
  {
    label: "English",
    value: "en",
    systemValue: merge(enUSDate, enUSDataGrid, enUSCore),
    adapterLocale: enUSAdapter,
    icon: "flagpack:gb-nir",
    numberFormat: {
      code: "en-US",
      currency: "USD",
    },
  },
  {
    label: "French",
    value: "fr",
    systemValue: merge(frFRDate, frFRDataGrid, frFRCore),
    adapterLocale: frFRAdapter,
    icon: "flagpack:fr",
    numberFormat: {
      code: "fr-Fr",
      currency: "EUR",
    },
  },
  {
    label: "Vietnamese",
    value: "vi",
    systemValue: merge(viVNDate, viVNDataGrid, viVNCore),
    adapterLocale: viVNAdapter,
    icon: "flagpack:vn",
    numberFormat: {
      code: "vi-VN",
      currency: "VND",
    },
  },
  {
    label: "Chinese",
    value: "cn",
    systemValue: merge(zhCNDate, zhCNDataGrid, zhCNCore),
    adapterLocale: zhCNAdapter,
    icon: "flagpack:cn",
    numberFormat: {
      code: "zh-CN",
      currency: "CNY",
    },
  },
  {
    label: "Arabic",
    value: "ar",
    systemValue: merge(arSDDataGrid, arSACore),
    adapterLocale: arSAAdapter,
    icon: "flagpack:sa",
    numberFormat: {
      code: "ar",
      currency: "AED",
    },
  },
];

// export const defaultLang = allLangs[0]; // English
export const defaultLang = {
  label: "English",
  value: "en",
  systemValue: merge(enUSDate, enUSDataGrid, enUSCore),
  adapterLocale: enUSAdapter,
  icon: "flagpack:gb-nir",
  numberFormat: {
    code: "en-US",
    currency: "USD",
  },
};

// GET MORE COUNTRY FLAGS
// https://icon-sets.iconify.design/flagpack/
// https://www.dropbox.com/sh/nec1vwswr9lqbh9/AAB9ufC8iccxvtWi3rzZvndLa?dl=0
