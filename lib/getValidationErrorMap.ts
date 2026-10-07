export type Lang = "en" | "ar"

type Issue = { code: string; [key: string]: any }

const typeLabels: Record<Lang, Record<string, string>> = {
  en: {
    string: "a string",
    number: "a number",
    boolean: "a boolean",
    array: "an array",
    object: "an object",
    date: "a date",
    bigint: "a bigint",
    nan: "a number",
    null: "null",
    undefined: "a value",
    map: "a map",
    set: "a set",
    symbol: "a symbol",
    function: "a function",
    unknown: "a value",
    promise: "a promise",
    void: "nothing",
    never: "never",
  },
  ar: {
    string: "نص",
    number: "رقم",
    boolean: "قيمة منطقية (صح/غلط)",
    array: "قائمة",
    object: "كائن (أوبجكت)",
    date: "تاريخ",
    bigint: "رقم كبير جدًا",
    nan: "رقم",
    null: "قيمة فاضية",
    undefined: "قيمة",
    map: "خريطة (Map)",
    set: "مجموعة (Set)",
    symbol: "رمز",
    function: "دالة",
    unknown: "قيمة",
    promise: "وعد (Promise)",
    void: "ولا حاجة",
    never: "قيمة مستحيلة",
  },
}

const unitLabels: Record<Lang, Record<string, [string, string]>> = {
  en: {
    string: ["character", "characters"],
    array: ["item", "items"],
    set: ["item", "items"],
    file: ["byte", "bytes"],
    number: ["", ""],
    bigint: ["", ""],
    date: ["", ""],
  },
  ar: {
    string: ["حرف", "حروف"],
    array: ["عنصر", "عناصر"],
    set: ["عنصر", "عناصر"],
    file: ["بايت", "بايت"],
    number: ["", ""],
    bigint: ["", ""],
    date: ["", ""],
  },
}

const formatLabels: Record<Lang, Record<string, string>> = {
  en: {
    email: "email address",
    url: "URL",
    uuid: "UUID",
    emoji: "emoji",
    ipv4: "IPv4 address",
    ipv6: "IPv6 address",
    cidrv4: "IPv4 range",
    cidrv6: "IPv6 range",
    base64: "base64 string",
    base64url: "base64url string",
    json_string: "JSON string",
    e164: "E.164 phone number",
    date: "date (YYYY-MM-DD)",
    time: "time",
    datetime: "date and time",
    duration: "duration",
    jwt: "JWT",
    nanoid: "NanoID",
    cuid: "CUID",
    cuid2: "CUID2",
    ulid: "ULID",
    guid: "GUID",
    regex: "valid format",
    starts_with: "text starting with the required prefix",
    ends_with: "text ending with the required suffix",
    includes: "text containing the required value",
    lowercase: "lowercase text",
    uppercase: "uppercase text",
    trim: "trimmed text",
    xid: "XID",
    ksuid: "KSUID",
  },
  ar: {
    email: "إيميل صح",
    url: "لينك (رابط) صح",
    uuid: "UUID",
    emoji: "إيموجي",
    ipv4: "عنوان IPv4 صح",
    ipv6: "عنوان IPv6 صح",
    cidrv4: "نطاق IPv4 صح",
    cidrv6: "نطاق IPv6 صح",
    base64: "نص base64 صح",
    base64url: "نص base64url صح",
    json_string: "نص JSON صح",
    e164: "رقم موبايل بصيغة E.164",
    date: "تاريخ بصيغة (YYYY-MM-DD)",
    time: "وقت صح",
    datetime: "تاريخ ووقت صح",
    duration: "مدة زمنية صح",
    jwt: "توكن JWT صح",
    nanoid: "NanoID صح",
    cuid: "CUID صح",
    cuid2: "CUID2 صح",
    ulid: "ULID صح",
    guid: "GUID صح",
    regex: "صيغة صح",
    starts_with: "نص يبدأ بالمقدمة المطلوبة",
    ends_with: "نص ينتهي باللاحقة المطلوبة",
    includes: "نص فيه القيمة المطلوبة",
    lowercase: "نص بحروف صغيرة",
    uppercase: "نص بحروف كبيرة",
    trim: "نص من غير مسافات زيادة",
    xid: "XID صح",
    ksuid: "KSUID صح",
  },
}

const templates: Record<Lang, Record<string, (iss: any) => string>> = {
  en: {
    invalid_type: (iss) => {
      if (iss.received === "undefined") {
        return `Required — expected ${typeLabels.en[iss.expected] ?? iss.expected}`
      }
      if (iss.received === "null") {
        return `Cannot be null — expected ${typeLabels.en[iss.expected] ?? iss.expected}`
      }
      return `Expected ${typeLabels.en[iss.expected] ?? iss.expected}, received ${typeLabels.en[iss.received] ?? iss.received}`
    },

    too_small: (iss) => {
      const [singular, plural] = unitLabels.en[iss.origin] ?? ["", ""]
      const unit = iss.minimum === 1 ? singular : plural
      if (iss.exact) return `Must be exactly ${iss.minimum} ${unit}`.trim()
      const cmp = iss.inclusive ? "at least" : "more than"
      return `Must be ${cmp} ${iss.minimum} ${unit}`.trim()
    },

    too_big: (iss) => {
      const [singular, plural] = unitLabels.en[iss.origin] ?? ["", ""]
      const unit = iss.maximum === 1 ? singular : plural
      if (iss.exact) return `Must be exactly ${iss.maximum} ${unit}`.trim()
      const cmp = iss.inclusive ? "at most" : "less than"
      return `Must be ${cmp} ${iss.maximum} ${unit}`.trim()
    },

    not_multiple_of: (iss) => `Must be a multiple of ${iss.divisor}`,
    not_finite: () => "Number must be finite",
    unrecognized_keys: (iss) => (iss.keys.length === 1 ? `Unrecognized field: ${iss.keys[0]}` : `Unrecognized fields: ${iss.keys.join(", ")}`),
    invalid_union: () => "Value does not match any of the expected formats",
    invalid_key: () => "Invalid key",
    invalid_element: () => "Invalid element",
    invalid_value: (iss) => {
      const values = (iss.values ?? []).map(String)
      if (values.length === 1) return `Must be exactly: ${values[0]}`
      return `Must be one of: ${values.join(", ")}`
    },
    invalid_enum_value: (iss) => {
      const options = (iss.options ?? []).map(String)
      return `Must be one of: ${options.join(", ")}`
    },
    invalid_date: () => "Invalid date",
    invalid_arguments: () => "Invalid function arguments",
    invalid_return_type: () => "Invalid function return type",
    invalid_intersection_types: () => "Intersection results could not be merged",
    invalid_literal: (iss) => `Must be exactly: ${iss.expected}`,
    invalid_format: (iss) => {
      if (iss.format === "starts_with") return `Must start with "${iss.prefix}"`
      if (iss.format === "ends_with") return `Must end with "${iss.suffix}"`
      if (iss.format === "includes") return `Must include "${iss.includes}"`
      if (iss.format === "regex") return "Invalid format"
      const label = formatLabels.en[iss.format]
      return label ? `Must be a valid ${label}` : "Invalid format"
    },
    custom: (iss) => iss.message ?? "Invalid value",
  },

  ar: {
    invalid_type: (iss) => {
      if (iss.received === "undefined") {
        return `الحقل ده مطلوب — لازم يكون ${typeLabels.ar[iss.expected] ?? iss.expected}`
      }
      if (iss.received === "null") {
        return `مينفعش تسيبه فاضي — لازم يكون ${typeLabels.ar[iss.expected] ?? iss.expected}`
      }
      return `لازم يكون ${typeLabels.ar[iss.expected] ?? iss.expected}، بس انت كتبت ${typeLabels.ar[iss.received] ?? iss.received}`
    },

    too_small: (iss) => {
      const [singular, plural] = unitLabels.ar[iss.origin] ?? ["", ""]
      const unit = iss.minimum === 1 ? singular : plural
      if (iss.exact) return `لازم يكون بالظبط ${iss.minimum} ${unit}`.trim()
      if (iss.inclusive) return `لازم يكون ${iss.minimum} ${unit} على الأقل`.trim()
      return `لازم يكون أكتر من ${iss.minimum} ${unit}`.trim()
    },

    too_big: (iss) => {
      const [singular, plural] = unitLabels.ar[iss.origin] ?? ["", ""]
      const unit = iss.maximum === 1 ? singular : plural
      if (iss.exact) return `لازم يكون بالظبط ${iss.maximum} ${unit}`.trim()
      if (iss.inclusive) return `مينفعش يزيد عن ${iss.maximum} ${unit}`.trim()
      return `لازم يكون أقل من ${iss.maximum} ${unit}`.trim()
    },

    not_multiple_of: (iss) => `لازم يكون من مضاعفات ${iss.divisor}`,
    not_finite: () => "الرقم لازم يكون منتهي، مش لانهائي",
    unrecognized_keys: (iss) => (iss.keys.length === 1 ? `فيه حقل مش معروف: ${iss.keys[0]}` : `فيه حقول مش معروفة: ${iss.keys.join("، ")}`),
    invalid_union: () => "القيمة مش مطابقة لأي صيغة من الصيغ المتوقعة",
    invalid_key: () => "المفتاح ده غلط",
    invalid_element: () => "العنصر ده غلط",
    invalid_value: (iss) => {
      const values = (iss.values ?? []).map(String)
      if (values.length === 1) return `لازم تكون القيمة بالظبط: ${values[0]}`
      return `لازم تكون القيمة واحدة من دول: ${values.join("، ")}`
    },
    invalid_enum_value: (iss) => {
      const options = (iss.options ?? []).map(String)
      return `لازم تكون القيمة واحدة من دول: ${options.join("، ")}`
    },
    invalid_date: () => "التاريخ ده غلط",
    invalid_arguments: () => "الوسائط اللي اتبعتت للدالة غلط",
    invalid_return_type: () => "نوع القيمة اللي راجعة من الدالة غلط",
    invalid_intersection_types: () => "مقدرناش ندمج نتايج التقاطع",
    invalid_literal: (iss) => `لازم تكون القيمة بالظبط: ${iss.expected}`,
    invalid_format: (iss) => {
      if (iss.format === "starts_with") return `لازم يبدأ بـ "${iss.prefix}"`
      if (iss.format === "ends_with") return `لازم ينتهي بـ "${iss.suffix}"`
      if (iss.format === "includes") return `لازم يحتوي على "${iss.includes}"`
      if (iss.format === "regex") return "الصيغة غلط"
      const label = formatLabels.ar[iss.format]
      return label ? `لازم يكون ${label}` : "الصيغة غلط"
    },
    custom: (iss) => iss.message ?? "القيمة دي غلط",
  },
}

export function localizedZodError(lang: Lang) {
  return (iss: Issue): string => {
    const fn = templates[lang]?.[iss.code]
    if (fn) return fn(iss)
    return lang === "ar" ? "القيمة دي غلط" : "Invalid value"
  }
}
