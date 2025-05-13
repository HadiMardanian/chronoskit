# 📆 ChronosKit

A lightweight TypeScript utility for consistent and localizable date-time formatting with support for **Gregorian** and **Persian** (Jalali) calendars using the native `Intl.DateTimeFormat`.

---

## ✨ Features

* ✅ Localized date-time formatting (`en-US`, `fa-IR`)
* 🍍 Support for **Gregorian** and **Persian** calendars
* 🔁 Caching for `Intl.DateTimeFormat` to improve performance
* 📄 Converts to ISO-like strings: `YYYY-MM-DDTHH:mm:ss`
* 🔍 Graceful handling of invalid dates

---

## 📦 Installation

```bash
npm install chronoskit
```

---

## 🛠 Usage

```ts
import {
  toDateTime,
  toDateTimePersian,
  toDateTimePersianFa,
  generateFormattedDateTimeObject
} from 'chronoskit'

// Standard Gregorian ISO string
toDateTime(new Date())
// => "2025-05-13T12:45:00"

// Persian calendar in ISO-like format
toDateTimePersian('2025-05-13')
// => "1404-02-23T00:00:00"

// Persian + Farsi locale (output is still numeric, but culturally formatted)
toDateTimePersianFa(Date.now())
// => "1404-02-23T12:45:00"
```

---

## 🔧 API Reference

### `toDateTime(param, calendar?, lang?)`

| Param      | Type                       | Default     | Description           |
| ---------- | -------------------------- | ----------- | --------------------- |
| `param`    | `string \| number \| Date` | required    | Any valid date input  |
| `calendar` | `'gregory' \| 'persian'`   | `'gregory'` | Which calendar to use |
| `lang`     | `'en-US' \| 'fa-IR'`       | `'en-US'`   | Which locale to use   |

**Returns:**
`YYYY-MM-DDTHH:mm:ss` as a string or `'INVALID_DATE'` if input is invalid.

---

### `toDateTimePersian(param)`

Shortcut for:

```ts
toDateTime(param, 'persian', 'en-US')
```

---

### `toDateTimePersianFa(param)`

Shortcut for:

```ts
toDateTime(param, 'persian', 'fa-IR')
```

---

### `generateFormattedDateTimeObject(timestamp, calendar?, lang?)`

Parses a timestamp into an object like:

```ts
{
  year: '2025',
  month: '05',
  day: '13',
  hour: '12',
  minute: '45',
  second: '00'
}
```

---

## 🧪 Example Output

```ts
toDateTime(new Date('2025-05-13T12:00:00+03:30'))
// "2025-05-13T12:00:00"

toDateTimePersianFa(Date.now())
// "1404-02-23T13:15:00"
```

---

## 📂 Internal Types

| Type                 | Description                                  |
| -------------------- | -------------------------------------------- |
| `DateTimeString`     | Template literal `"YYYY-MM-DDTHH:mm:ss"`     |
| `DateTimeParts`      | `{ year, month, day, hour, minute, second }` |
| `InvalidDateLiteral` | `'INVALID_DATE'`                             |

---
