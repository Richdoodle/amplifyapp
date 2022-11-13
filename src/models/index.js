// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { Trades, Portfolio, Note } = initSchema(schema);

export {
  Trades,
  Portfolio,
  Note
};