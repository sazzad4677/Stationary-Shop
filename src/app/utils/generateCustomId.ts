import moment from 'moment';
import { Model } from 'mongoose';

export const generateCustomID = async (
  model: Model<any>,
  field: string,
  prefix: string = '',
): Promise<string> => {
  //  Get the current timestamp in YYYYMMDD-HHMMSS format
  const timestamp = moment().format('YYYYMMDD-HHMMSS');

  // Fetch the maximum `field` value from the database sorted by descending
  const lastRecord = await model
    .findOne()
    .sort({ [field]: -1 })
    .select(field);

  // Extract the sequence number from the last record's ID
  let nextSequence = 1;
  if (lastRecord && lastRecord[field]) {
    const lastID = lastRecord[field];
    const sequencePart = lastID.split('-').pop();
    nextSequence = sequencePart ? parseInt(sequencePart) + 1 : 1;
  }

  //  Combine the parts to generate the custom ID
  const customID = `${prefix}${timestamp}-${String(nextSequence).padStart(3, '0')}`; // Pad the sequence with leading zeros

  return customID;
};
