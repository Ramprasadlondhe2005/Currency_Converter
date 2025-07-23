const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");

const BASE_URL = "https://2024-03-06.currency-api.pages.dev/v1/currencies";

// Country List for Flag Images
const countryList = {
  AED: "AE", AFN: "AF", XCD: "AG", ALL: "AL", AMD: "AM", ANG: "AN", AOA: "AO", ARS: "AR",
  AUD: "AU", AZN: "AZ", BAM: "BA", BBD: "BB", BDT: "BD", BGN: "BG", BHD: "BH", BIF: "BI",
  BMD: "BM", BND: "BN", BOB: "BO", BRL: "BR", BSD: "BS", BTN: "BT", BWP: "BW", BYN: "BY",
  BZD: "BZ", CAD: "CA", CDF: "CD", CHF: "CH", CLP: "CL", CNY: "CN", COP: "CO", CRC: "CR",
  CUP: "CU", CVE: "CV", CZK: "CZ", DJF: "DJ", DKK: "DK", DOP: "DO", DZD: "DZ", EGP: "EG",
  ERN: "ER", ETB: "ET", EUR: "FR", FJD: "FJ", FKP: "FK", FOK: "FO", GBP: "GB", GEL: "GE",
  GGP: "GG", GHS: "GH", GIP: "GI", GMD: "GM", GNF: "GN", GTQ: "GT", GYD: "GY", HKD: "HK",
  HNL: "HN", HRK: "HR", HTG: "HT", HUF: "HU", IDR: "ID", ILS: "IL", INR: "IN", IQD: "IQ",
  IRR: "IR", ISK: "IS", JEP: "JE", JMD: "JM", JOD: "JO", JPY: "JP", KES: "KE", KGS: "KG",
  KHR: "KH", KID: "KI", KMF: "KM", KRW: "KR", KWD: "KW", KYD: "KY", KZT: "KZ", LAK: "LA",
  LBP: "LB", LKR: "LK", LRD: "LR", LSL: "LS", LYD: "LY", MAD: "MA", MDL: "MD", MGA: "MG",
  MKD: "MK", MMK: "MM", MNT: "MN", MOP: "MO", MRU: "MR", MUR: "MU", MVR: "MV", MWK: "MW",
  MXN: "MX", MYR: "MY", MZN: "MZ", NAD: "NA", NGN: "NG", NIO: "NI", NOK: "NO", NPR: "NP",
  NZD: "NZ", OMR: "OM", PAB: "PA", PEN: "PE", PGK: "PG", PHP: "PH", PKR: "PK", PLN: "PL",
  PYG: "PY", QAR: "QA", RON: "RO", RSD: "RS", RUB: "RU", RWF: "RW", SAR: "SA", SBD: "SB",
  SCR: "SC", SDG: "SD", SEK: "SE", SGD: "SG", SHP: "SH", SLL: "SL", SOS: "SO", SRD: "SR",
  SSP: "SS", STN: "ST", SYP: "SY", SZL: "SZ", THB: "TH", TJS: "TJ", TMT: "TM", TND: "TN",
  TOP: "TO", TRY: "TR", TTD: "TT", TVD: "TV", TWD: "TW", TZS: "TZ", UAH: "UA", UGX: "UG",
  USD: "US", UYU: "UY", UZS: "UZ", VES: "VE", VND: "VN", VUV: "VU", WST: "WS", XAF: "CM",
  XCD: "AG", XOF: "BJ", XPF: "PF", YER: "YE", ZAR: "ZA", ZMW: "ZM", ZWL: "ZW"
};

// Populate Currency Dropdowns
for (let select of dropdowns) {
  for (let currCode in countryList) {
    let option = document.createElement("option");
    option.value = currCode;
    option.innerText = currCode;

    if (select.name === "from" && currCode === "USD") {
      option.selected = true;
    } else if (select.name === "to" && currCode === "INR") {
      option.selected = true;
    }

    select.append(option);
  }

  select.addEventListener("change", (e) => updateFlag(e.target));
}

// Update Flag Image
const updateFlag = (element) => {
  let currCode = element.value;
  let countryCode = countryList[currCode];
  let img = element.parentElement.querySelector("img");
  img.src = `https://flagsapi.com/${countryCode}/flat/64.png`;
};

// Fetch Exchange Rate
const updateExchangeRate = async () => {
  const amountInput = document.querySelector(".amount input");
  let amtVal = amountInput.value;

  if (amtVal === "" || amtVal <= 0) {
    amtVal = 1;
    amountInput.value = "1";
  }

  const from = fromCurr.value.toLowerCase();
  const to = toCurr.value.toLowerCase();
  const URL = `${BASE_URL}/${from}.json`;

  try {
    const res = await fetch(URL);
    const data = await res.json();

    if (!data[from] || !data[from][to]) {
      msg.innerText = `Exchange rate not found.`;
      return;
    }

    const rate = data[from][to];
    const finalAmount = amtVal * rate;

    msg.innerText = `${amtVal} ${fromCurr.value} = ${finalAmount.toFixed(2)} ${toCurr.value}`;
  } catch (err) {
    msg.innerText = "Failed to fetch exchange rate.";
    console.error("Error:", err);
  }
};

// Button Event Listener
btn.addEventListener("click", (e) => {
  e.preventDefault();
  updateExchangeRate();
});

// Initial Load
window.addEventListener("load", () => {
  updateExchangeRate();
});
