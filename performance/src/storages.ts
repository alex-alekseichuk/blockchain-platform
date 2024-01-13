import { Dict } from './util';

export type Record = Dict<number>;
export type Results = Array<Record>;

export interface IStorage {
  save(table: string, record: Record): void;
  getResults(table: string): Results;
}

export class MemoryStorage implements IStorage {
  tables: Dict<Array<Record>> = {};

  constructor(key: string = 'storage') {
    this.key = key;
  }

  save(table: string, record: Record): void {
    let records = this.tables[table];
    if (!records) {
      records = new Array<Record>();
      this.tables[table] = records;
    }
    records.push(record);
  }

  getResults(table: string): Results {
    return this.tables[table];
  }

  private key: string;
}
