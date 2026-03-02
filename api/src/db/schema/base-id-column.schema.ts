import {uuid} from "drizzle-orm/pg-core";

export function baseIdColumn() {
    return {
        id: uuid('id').primaryKey().defaultRandom()
    }
}