import {db} from "../db";
import {users} from "../db/schema";
import {and, eq} from "drizzle-orm";

export async function getAllUsers() {
    const userList = await db
        .select()
        .from(users)
        .where(
            and(
                eq(users.isActive, true),
                eq(users.isDeleted, false)
            )
        );
    return userList || null;
}