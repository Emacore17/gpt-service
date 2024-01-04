import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
export const getConfig = (): PostgresConnectionOptions => ({
  type: 'postgres',
  database: 'openaidb',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'postgres',
  //   ssl: {
  //     rejectUnauthorized: true,
  //   },
  entities: [`${__dirname}/src/db/entities/*{.ts,.js}`],
  synchronize: true, // puoi anche controllare questa variabile d'ambiente
});
