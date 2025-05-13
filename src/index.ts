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

export const getFormatter = (calendar: Calendar = 'gregory', lang: Lang = 'en-US'): Intl.DateTimeFormat => {
  const key = `${calendar}|${lang}`
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

const partsToDateString = (parts: DateTimeParts): DateString => {
  const dateStr = `${parts.year}-${parts.month}-${parts.day}` as const
  return dateStr
}

const partsToTimeString = (parts: DateTimeParts): TimeString => {
  const timeStr = `${parts.hour}:${parts.minute}:${parts.second}` as const
  return timeStr
}

export const partsToDateTimeString = (parts: DateTimeParts): DateTimeString => {
  const dateStr = partsToDateString(parts)
  const timeStr = partsToTimeString(parts)
  const datetimeStr = `${dateStr}T${timeStr}` as const
  return datetimeStr
}

const validate = (param: string | number | Date): number | null => {
  const inputDate = param instanceof Date ? param : new Date(param)
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
