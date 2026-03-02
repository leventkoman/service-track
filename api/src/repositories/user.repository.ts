import {db} from "../db";
import {users} from "../db/schema";
import {and, eq} from "drizzle-orm";

export async function getAll() {
    const allUsers = await db
        .select()
        .from(users)
        .where(
            and(
               eq(users.isActive, true),
                eq(users.isDeleted, false)
            )
        );
    return allUsers || null;
}