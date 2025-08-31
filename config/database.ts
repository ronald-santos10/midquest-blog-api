import path from 'path';

export default ({ env }) => {
  const client = env('DATABASE_CLIENT');

  return {
    connection: {
      client: client === 'postgres' ? 'postgres' : 'sqlite',
      ... (client === 'postgres' ? {
        connection: {
          connectionString: env('DATABASE_URL'),
          ssl: env.bool('DATABASE_SSL', false),
        },
      } : {
        connection: {
          filename: path.join(__dirname, '..', '..', env('DATABASE_FILENAME', '.tmp/data.db')),
        },
        useNullAsDefault: true,
      })
    },
  };
};