import  DateObject  from "react-date-object";
import persian from "react-date-object/calendars/persian";

export const convertToLatinDigits = (
  str: string | null | undefined
): string => {
  const farsiDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];

  if (str === null || str === undefined) {
    return "";
  }

  return str.replace(/[۰-۹]/g, (d) => {
    const index = farsiDigits.indexOf(d);
    return index !== -1 ? index.toString() : d;
  });
};
/////////////////////////////////////////////////////////////
export const convertToFarsiDigits = (
  num: number | string | null | undefined
): string => {
  const farsiDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];

  if (num === null || num === undefined) {
    return "";
  }

  if (typeof num === "string") {
    return num.replace(/\d/g, (d) => farsiDigits[parseInt(d)]);
  } else {
    let temp: string;
    if (num < 0) {
      temp =
        Math.abs(num)
          .toString()
          .replace(/\d/g, (d) => farsiDigits[parseInt(d)]) + "-";
    } else {
      temp = Math.abs(num)
        .toString()
        .replace(/\d/g, (d) => farsiDigits[parseInt(d)]);
    }
    return temp;
  }
};
/////////////////////////////////////////////////////////////
export const convertStringToInteger = (str: string) => {
  const result = parseInt(str, 10); // Base 10
  return isNaN(result) ? null : result; // Return null for NaN
};
/////////////////////////////////////////////////////////////
export function formatPersianDate(
  curDay: number,
  curMonth: number,
  curYear: number
): string {
  const persianDays = [
    "شنبه",
    "یکشنبه",
    "دوشنبه",
    "سه شنبه",
    "چهارشنبه",
    "پنجشنبه",
    "جمعه",
  ];
  const persianMonths = [
    "فروردین",
    "اردیبهشت",
    "خرداد",
    "تیر",
    "مرداد",
    "شهریور",
    "مهر",
    "آبان",
    "آذر",
    "دی",
    "بهمن",
    "اسفند",
  ];

  // curDay: 0 (شنبه) to 6 (جمعه)
  // curMonth: 1 (فروردین) to 12 (اسفند)
  const dayName = persianDays[curDay % 7];
  const monthName = persianMonths[(curMonth - 1) % 12];

  return convertToFarsiDigits(`${dayName}، ${curDay} ${monthName} ${curYear}`);
}
/////////////////////////////////////////////////////////////
export const convertPersianDate = (dateStr: string): string => {
  const persianToEnglish = {
    "۰": "0",
    "۱": "1",
    "۲": "2",
    "۳": "3",
    "۴": "4",
    "۵": "5",
    "۶": "6",
    "۷": "7",
    "۸": "8",
    "۹": "9",
  };
  return dateStr
    .replace(
      /[۰-۹]/g,
      (d) => persianToEnglish[d as keyof typeof persianToEnglish]
    )
    .split("/")
    .map((part) => part.padStart(2, "0"))
    .join("/");
};

export const formatNumberWithCommas = (num: number): string => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};
////////////////////////////////////////////////////////////
// Generic handler for both single and multiple AutoComplete components
export const handleAutoCompleteChange = <
  T extends { id: number|string; title: string }
>(
  newValue: T | T[] | null,
  setter: React.Dispatch<React.SetStateAction<T | null>>
) => {
  const selectedValue = Array.isArray(newValue) ? newValue[0] : newValue;
  setter(selectedValue);
};
////////////////////////////////////////////
export function parsePersianDateString(dateString: string): Date | null {
  // Expected format: "YYYY/MM/DD"
  if (dateString === null || dateString === undefined) {
    return null;
  }
  const parts = dateString.split('/');
  if (parts.length !== 3) {
    return null;
  }

  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10);
  const day = parseInt(parts[2], 10);

  if (isNaN(year) || isNaN(month) || isNaN(day)) {
    return null;
  }

  // Create a Persian DateObject with the provided date parts
  const dateObject = new DateObject({ year, month, day, calendar: persian });

  // Convert to Gregorian Date
  return dateObject.toDate();
}