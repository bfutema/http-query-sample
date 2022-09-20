import { Connection, createConnection, getConnectionOptions } from 'typeorm';

async function connect(): Promise<Connection> {
  const defaultOptions = await getConnectionOptions();

  return createConnection(Object.assign(defaultOptions));
}

export { connect };
