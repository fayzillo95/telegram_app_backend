// error-map.ts
export const prismaErrorMap = new Map<string, { code: string; message: string }>([
  ['P2000', { code: 'P2000', message: 'Field value is too long for the column type.' }],
  ['P2002', { code: 'P2002', message: 'Unique constraint failed on the field(s).' }],
  ['P2003', { code: 'P2003', message: 'Foreign key constraint failed on the field.' }],
  ['P2004', { code: 'P2004', message: 'A constraint failed on the database.' }],
  ['P2005', { code: 'P2005', message: 'Value is invalid for the column type.' }],
  ['P2006', { code: 'P2006', message: 'The provided value is not valid.' }],
  ['P2007', { code: 'P2007', message: 'Data validation error.' }],
  ['P2009', { code: 'P2009', message: 'Query parsing error.' }],
  ['P2010', { code: 'P2010', message: 'Raw query failed. Code or message not available.' }],
  ['P2011', { code: 'P2011', message: 'Null constraint violation.' }],
  ['P2014', { code: 'P2014', message: 'Relation violation: record required.' }],
  ['P2015', { code: 'P2015', message: 'No record found or multiple records found.' }],
  ['P2016', { code: 'P2016', message: 'Query interpretation error.' }],
  ['P2025', { code: 'P2025', message: 'Record to delete does not exist.' }],
]);
