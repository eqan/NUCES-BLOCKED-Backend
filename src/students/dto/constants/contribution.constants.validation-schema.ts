import * as Ajv from 'ajv';

export const dataValidationSchema = {
  type: 'object',
  discriminator: { propertyName: 'dataType' },
  required: ['dataType'],
  oneOf: [
    {
      properties: {
        dataType: { enum: ['ADMIN'] },
        id: { type: 'string' },
        type: { enum: ['CGPA'] },
        contribution: { type: 'string' },
      },
      additionalProperties: false,
      required: ['id', 'type', 'contribution'],
    },
    {
      properties: {
        dataType: { enum: ['SOCIETY_HEAD'] },
        studentId: { type: 'string' },
        type: { enum: ['UNIVERSITY_EVENT', 'COMPETITION_ACHIEVEMENT'] },
        contribution: { type: 'string' },
      },
      additionalProperties: false,
      required: ['studentId', 'type', 'contribution'],
    },
    {
      properties: {
        dataType: { enum: ['TEACHER'] },
        studentId: { type: 'string' },
        type: { enum: ['TA_SHIP', 'RESEARCH'] },
        contribution: { type: 'string' },
      },
      additionalProperties: false,
      required: ['studentId', 'type', 'contribution'],
    },
    {
      properties: {
        dataType: { enum: ['CAREER_COUNSELLOR'] },
        studentId: { type: 'string' },
        type: { enum: ['TA_SHIP', 'RESEARCH'] },
        contribution: { type: 'string' },
      },
      additionalProperties: false,
      required: ['studentId', 'type', 'contribution'],
    },
  ],
};

/**
 * validate union type json schema
 * @param value json to validate
 * @param schema to match value with
 */

export const validate = (value: unknown, schema: any): object | never => {
  if (typeof value !== 'object') {
    throw new Error('invalid input type');
  }
  const ajv = new Ajv({
    formats: {
      reserved: true,
    },
    allErrors: true,
  });
  const validate = ajv.compile(schema);
  const valid = validate(value);
  if (!valid) throw new Error(validate.errors[0].message);
  return value;
};
