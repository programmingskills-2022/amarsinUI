import { toJalaali } from "jalaali-js";
import DateObject from "react-date-object";
import persian from "react-date-object/calendars/persian";
export const convertToLatinDigits = (
  str: string | null | undefined 
): string => {
  const farsiDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];

  if (str === null || str === undefined) {
    return "";
  }
  if (typeof str === "number") {
    return str
  }
  // Convert Farsi digits to Latin digits, preserve minus sign and other characters
  const result = str.replace(/[۰-۹]/g, (d) => {
    const index = farsiDigits.indexOf(d);
    return index !== -1 ? index.toString() : d;
  });
  
  return result;
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
export const convertStringToInteger = (str: string | null) => {
  if (str === null) return 0;
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

  // curDay: day of month (1-31)
  // curMonth: month number (1-12)
  // Calculate the actual day of the week from the Persian date
  const dateObject = new DateObject({ 
    year: curYear, 
    month: curMonth, 
    day: curDay, 
    calendar: persian 
  });
  // Convert to native Date to get day of week
  const gregorianDate = dateObject.toDate();
  // JavaScript getDay(): 0=Sunday, 1=Monday, ..., 6=Saturday
  // Persian week starts from Saturday (شنبه), so we need to shift:
  // Saturday (JS=6) -> 0 (شنبه), Sunday (JS=0) -> 1 (یکشنبه), etc.
  const jsDayOfWeek = gregorianDate.getDay();
  const dayOfWeek = (jsDayOfWeek + 1) % 7; // Shift to match Persian week (Saturday=0)
  const dayName = persianDays[dayOfWeek];
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
// format number with commas
export const formatNumberWithCommas = (num: number | string | null | undefined): string => {
  if (num === null || num === undefined || num === "") {
    return "";
  }
  const numValue = typeof num === "string" ? parseFloat(num) || 0 : num;
  if (isNaN(numValue)) {
    return "";
  }
  return numValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};
// convert currency string to number
export const currencyStringToNumber = (currencyStr: string): number => {
  // Remove any non-numeric characters except for the decimal point and minus sign
  const cleanedString = currencyStr.replace(/[^\d.-]/g, "");
  // Convert to number
  return parseFloat(cleanedString);
};

// Format number as Farsi currency with thousand separators
export const formatFarsiCurrency = (value: string | number): string => {
  // Handle empty or null values
  if (!value && value !== 0) return "";

  // Convert to string and remove any existing formatting
  let numStr = value.toString();

  // Convert Farsi digits to Latin first for processing
  numStr = convertToLatinDigits(numStr);

  // Remove any non-digit characters except minus sign
  numStr = numStr.replace(/[^\d-]/g, "");

  // Handle empty input after cleaning
  if (!numStr) return "";

  // Handle negative numbers
  const isNegative = numStr.startsWith("-");
  const numberPart = isNegative ? numStr.slice(1) : numStr;

  // Add thousand separators (commas)
  const formattedNumber = numberPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  // Convert to Farsi digits
  const farsiFormatted = convertToFarsiDigits(formattedNumber);

  return isNegative ? `-${farsiFormatted}` : farsiFormatted;
};

// Handle currency input change with real-time formatting
export const handleCurrencyInputChange = (
  inputValue: string,
  setValue: (value: string) => void
) => {
  // Format the input value in real-time
  const formattedValue = formatFarsiCurrency(inputValue);
  setValue(formattedValue);

  // Return the numeric value for storage/API calls
  const numericValue = currencyStringToNumber(convertToLatinDigits(inputValue));
  return numericValue;
};
////////////////////////////////////////////////////////////
// Generic handler for both single and multiple AutoComplete components
export const handleAutoCompleteChange = <
  T extends { id: number | string; title: string }
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
  const parts = dateString.split("/");
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
//////////////////////////////////////////
export function convertToPersianDate(date: Date): string {
  const jalaaliDate = toJalaali(
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate()
  );
  const { jy, jm, jd } = jalaaliDate;

  // Format as 'YYYY/MM/DD'
  const persianDate = `${jy}/${padZero(jm)}/${padZero(jd)}`;
  return persianDate;
}

// Helper function to pad single digit months/days with leading zero
function padZero(num: number): string {
  return num < 10 ? `0${num}` : `${num}`;
}
////////////////////////////////////////////////////////////
// pick up numbers seperated by new line
export function parsePersianNumerals(input: string): number[] {
  const persianDigits = "۰۱۲۳۴۵۶۷۸۹";

  return input.split("\n").map((part) => {
    let numberStr = "";
    for (const char of part) {
      const index = persianDigits.indexOf(char);
      if (index !== -1) {
        numberStr += index.toString();
      } else {
        numberStr += char; // fallback in case of unexpected characters
      }
    }
    return parseInt(numberStr, 10);
  });
}
////////////////////////////////////////////////////////////
//date is a persian date string like "1404/01/01"
//add days to the date
export const addPersianDays = (date: string, days: number): string => {
  const dateObject = parsePersianDateString(date);
  if (dateObject === null) {
    return "";
  }
  const newDate = new DateObject({ date: dateObject, calendar: persian });
  newDate.add(days, "days");
  return convertToPersianDate(newDate.toDate() ?? new Date());
};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//normalize input for search for ی و ک
export function normalizeInputForSearch(input: string): string {
  return input
    .replace(/[يك]/g, (c) => {
      // تبدیل کاراکترهای عربی/فارسی به نسخهٔ همسان
      if (c === 'ي' || c === 'ی') return 'ی';
      if (c === 'ك' || c === 'ک') return 'ک';
      return c;
    })
    .normalize('NFKC')
    .replace(/\s+/g, ' ') 
    .trim();
}
////////////////////////////////////////////////////////////
// Convert pixel widths to percentage widths for table columns
// Only considers visible columns when calculating percentages
export function convertPixelWidthsToPercentages(
  pixelWidths: Record<string, number>,
  columns: Array<{ id?: string; accessor?: string; visible?: boolean; columns?: any[] }>,
  currentColumnWidths: Record<string, number>
): Record<string, number> {
  const percentageWidths: Record<string, number> = {};
  
  // Flatten columns (handle ColumnGroup with nested columns)
  const flatColumns = columns.flatMap((col) => {
    // If it's a ColumnGroup, use its nested columns
    if ('columns' in col && Array.isArray(col.columns)) {
      return col.columns;
    }
    // Otherwise, it's a Column
    return [col];
  });
  
  // Get visible columns to only convert visible ones
  const visibleColumnIds = flatColumns
    .filter((col) => col.visible !== false)
    .map((col) => col.id ?? col.accessor)
    .filter((id): id is string => id !== undefined);
  
  // Calculate total visible width in pixels
  const totalVisiblePixels = visibleColumnIds.reduce((sum, colId) => {
    return sum + (pixelWidths[colId] || 0);
  }, 0);
  
  // Convert to percentages based on visible columns only
  Object.keys(pixelWidths).forEach((key) => {
    if (visibleColumnIds.includes(key)) {
      // Convert based on visible columns total
      percentageWidths[key] = totalVisiblePixels > 0
        ? (pixelWidths[key] / totalVisiblePixels) * 100
        : 0;
    } else {
      // Keep invisible columns as they were (they might not be in pixelWidths)
      percentageWidths[key] = currentColumnWidths[key] || 0;
    }
  });
  
  return percentageWidths;
}