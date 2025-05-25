type BaseType =
  | StringConstructor
  | NumberConstructor
  | BooleanConstructor
  | ArrayConstructor
  | ObjectConstructor;
type SchemaRule = {
  type: BaseType;
  required?: boolean;
  pattern?: RegExp;
  enum?: string[];
  validate?: (value: any, allValues?: Record<string, any>) => boolean | string;
};
type Schema = Record<string, SchemaRule>;

export function validateAgainstSchema<T>(
  obj: Record<string, any>,
  schema: Schema,
): { valid: boolean; errors: string[]; values: T } {
  const errors: string[] = [];
  let values = {};
  for (const key in schema) {
    const rule = schema[key];
    const value = obj[key];
    values = { ...values, [key]: obj[key] };

    if (rule.required && (value === undefined || value === null || value === '')) {
      errors.push(`${key} is required`);
      continue;
    }

    if (!rule.required && (value === undefined || value === null)) {
      continue;
    }

    switch (rule.type) {
      case String:
        if (typeof value !== 'string') errors.push(`${key} must be a string`);
        break;
      case Number:
        if (typeof value !== 'number') errors.push(`${key} must be a number`);
        break;
      case Boolean:
        if (typeof value !== 'boolean') errors.push(`${key} must be a boolean`);
        break;
      case Array:
        if (!Array.isArray(value)) errors.push(`${key} must be an array`);
        break;
      case Object:
        if (typeof value !== 'object' || Array.isArray(value))
          errors.push(`${key} must be an object`);
        break;
    }

    if (rule.pattern && typeof value === 'string' && !rule.pattern.test(value)) {
      errors.push(`${key} is in an invalid format`);
    }

    if (rule.enum && !rule.enum.includes(value)) {
      errors.push(`${key} must be one of: ${rule.enum.join(', ')}`);
    }

    if (rule.validate) {
      const result = rule.validate(value, obj);
      if (result !== true) {
        errors.push(typeof result === 'string' ? result : `${key} failed custom validation`);
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    values: values as T,
  };
}

export const EventSchema: Schema = {
  timestamp: {
    type: String,
    required: true,
    validate: (value) => !isNaN(Date.parse(value)) || 'timestamp must be a valid ISO date',
  },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'in_transit', 'delivered', 'cancelled'],
  },
  location: {
    type: String,
    required: false,
  },
  details: {
    type: String,
    required: false,
  },
};
