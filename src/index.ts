const formatterCache = new Map<string, Intl.DateTimeFormat>()

const DateTimeKeysArray = ['month', 'day', 'year', 'hour', 'minute', 'second'] as const
type DateTimeKeys = typeof DateTimeKeysArray[number]
type DateTimeParts = {
  [k in DateTimeKeys]: string
}
type DateString = `${string}-${string}-${string}`
type TimeString = `${string}:${string}:${string}`
type DateTimeString = `${DateString}T${TimeString}`
type Calendar = 'persian' | 'gregory'
type Lang = 'en-US' | 'fa-IR'
type InvalidDateLiteral = 'INVALID_DATE'

// Bug 2 Fix: Enhanced cache key generation with all formatter options
const generateCacheKey = (calendar: Calendar, lang: Lang): string => {
  const formatterOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZone: 'Asia/Tehran',
    hourCycle: 'h24',
    calendar: calendar
  }
  return `${calendar}|${lang}|${JSON.stringify(formatterOptions)}`
}

export const getFormatter = (calendar: Calendar = 'gregory', lang: Lang = 'en-US'): Intl.DateTimeFormat => {
  const key = generateCacheKey(calendar, lang)
  let formatter = formatterCache.get(key)
  if (!formatter) {
    formatter = new Intl.DateTimeFormat(lang, {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZone: 'Asia/Tehran',
      hourCycle: 'h24',
      calendar: calendar
    })
    formatterCache.set(key, formatter)
  }

  return formatter
}

export const generateFormattedDateTimeObject = (
  timestamp: number,
  calendar: Calendar = 'gregory',
  lang: Lang = 'en-US'
): DateTimeParts => {
  const datetime: DateTimeParts = {
    day: '',
    hour: '',
    minute: '',
    month: '',
    second: '',
    year: ''
  }
  const formatter = getFormatter(calendar, lang)
  return formatter
    .formatToParts(timestamp)
    .filter(({ type }) => type != 'literal')
    .reduce((acc, { type, value }) => ((acc[type as DateTimeKeys] = value), acc), datetime)
}

// Bug 3 Fix: Add validation to prevent injection in date string construction
const validateDatePart = (part: string, expectedLength: number): string => {
  if (typeof part !== 'string' || part.length !== expectedLength) {
    throw new Error(`Invalid date part: ${part}`)
  }
  // Allow both Arabic numerals and Persian digits for better compatibility
  if (!/^[\d۰-۹]+$/.test(part)) {
    throw new Error(`Invalid date part: ${part}`)
  }
  return part
}

const partsToDateString = (parts: DateTimeParts): DateString => {
  const year = validateDatePart(parts.year, 4)
  const month = validateDatePart(parts.month, 2)
  const day = validateDatePart(parts.day, 2)
  const dateStr = `${year}-${month}-${day}` as const
  return dateStr
}

const partsToTimeString = (parts: DateTimeParts): TimeString => {
  const hour = validateDatePart(parts.hour, 2)
  const minute = validateDatePart(parts.minute, 2)
  const second = validateDatePart(parts.second, 2)
  const timeStr = `${hour}:${minute}:${second}` as const
  return timeStr
}

export const partsToDateTimeString = (parts: DateTimeParts): DateTimeString => {
  const dateStr = partsToDateString(parts)
  const timeStr = partsToTimeString(parts)
  const datetimeStr = `${dateStr}T${timeStr}` as const
  return datetimeStr
}

// Bug 1 Fix: Proper validation logic for different input types
const validate = (param: string | number | Date): number | null => {
  let inputDate: Date
  
  if (param instanceof Date) {
    inputDate = param
  } else if (typeof param === 'number') {
    // Handle timestamp directly
    inputDate = new Date(param)
  } else {
    // Handle string input
    inputDate = new Date(param)
  }
  
  return isNaN(inputDate.getTime()) ? null : inputDate.getTime()
}

export const toDateTime = (
  param: string | number | Date,
  calendar: Calendar = 'gregory',
  lang: Lang = 'en-US'
): DateTimeString | InvalidDateLiteral => {
  const inputDate = validate(param)
  if (inputDate === null) return 'INVALID_DATE'

  const datetimeParts = generateFormattedDateTimeObject(inputDate, calendar, lang)
  const datetimeStr = partsToDateTimeString(datetimeParts)

  return datetimeStr
}

export const toDateTimePersian = (param: string | number | Date): DateTimeString | InvalidDateLiteral => {
  return toDateTime(param, 'persian')
}

export const toDateTimePersianFa = (param: string | number | Date): DateTimeString | InvalidDateLiteral => {
  return toDateTime(param, 'persian', 'fa-IR')
}

export default {
  toDateTime,
  toDateTimePersian,
  toDateTimePersianFa,
  generateFormattedDateTimeObject
}
