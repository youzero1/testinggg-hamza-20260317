import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Todo } from '../entities/Todo';
import * as fs from 'fs';
import * as path from 'path';

const dbDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const dbPath = path.join(dbDir, 'todos.db');

let dataSource: DataSource | null = null;

export async function getDataSource(): Promise<DataSource> {
  if (dataSource && dataSource.isInitialized) {
    return dataSource;
  }

  dataSource = new DataSource({
    type: 'better-sqlite3',
    database: dbPath,
    entities: [Todo],
    synchronize: true,
    logging: false
  });

  await dataSource.initialize();
  return dataSource;
}
