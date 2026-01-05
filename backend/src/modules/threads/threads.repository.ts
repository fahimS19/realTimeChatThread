import { query } from "../../db/db.js";
import { BadRequestError, NotFoundError } from "../../lib/errors.js";
import {
  Category,
  CategoryRow,
  mapCategoryRow,
  mapThreadDetailRow,
  mapThreadSummaryRow,
  ThreadDetail,
  ThreadDetailRow,
  ThreadListFilter,
  ThreadSummary,
  ThreadSummaryRow,
} from "./threads.types.js";

export function parseThreadListFilter(queryObj: {
  page?: unknown;
  pageSize?: unknown;
  category?: unknown;
  q?: unknown;
  sort?: unknown;
}): ThreadListFilter {
  const page = Number(queryObj.page) || 1;
  const rawPageSize = Number(queryObj.pageSize) || 20;
  const pageSize = Math.min(Math.max(rawPageSize, 1), 50);

  const categorySlug =
    typeof queryObj.category === "string" && queryObj.category.trim()
      ? queryObj.category.trim()
      : undefined;

  const search =
    typeof queryObj.q === "string" && queryObj.q.trim()
      ? queryObj.q.trim()
      : undefined;

  const sort: "new" | "old" = queryObj.sort === "old" ? "old" : "new";

  return {
    page,
    pageSize,
    search,
    sort,
    categorySlug,
  };
}

export async function listCategories(): Promise<Category[]> {
  const result = await query<CategoryRow>(
    `
        SELECT id, slug, name, description
        FROM categories
        ORDER BY name ASC
    `
  );

  return result.rows.map(mapCategoryRow);
}

export async function createdThread(params: {
  categorySlug: string;
  authorUserId: number;
  title: string;
  body: string;
}): Promise<ThreadDetail> {
  const { categorySlug, authorUserId, title, body } = params;

  const categoryRes = await query<{ id: number }>(
    // checking in categories table whether a category with that slug exist or not ,since categories are fixed ,it should exist ,other wise it will return nothing
    `
        SELECT id
        FROM categories
        WHERE slug = $1
        LIMIT 1
        `,
    [categorySlug] //returns the id of that category if that exists
  );

  if (categoryRes.rows.length === 0) {
    //this means this category was not found
    throw new BadRequestError("Invalid category");
  }

  const categoryId = categoryRes.rows[0].id; // extracting the id of the category

  const insertRes = await query<{ id: number }>(
    `
        INSERT INTO threads (category_id, author_user_id, title, body)
        values ($1, $2, $3, $4)
        RETURNING id
        `,
    [categoryId, authorUserId, title, body] //we are inserting a new thread of that category with all the necessary information .This will return the thread id of the newly inserted thread
  );

  const threadId = insertRes.rows[0].id; //the threadId we got from the previous query

  return getThreadById(threadId); // returns the whole info of the thread
}

export async function getThreadById(id: number): Promise<ThreadDetail> {
  const result = await query<ThreadDetailRow>(
    `
        SELECT
          t.id,
          t.title,
          t.body,
          t.created_at,
          t.updated_at,
          c.slug AS category_slug,
          c.name AS category_name,
          u.display_name AS author_display_name,
          u.handle AS author_handle
        FROM threads t
        JOIN categories c ON c.id = t.category_id
        JOIN users u ON u.id = t.author_user_id
        WHERE t.id = $1
        LIMIT 1
        `,
    [id]
  );

  const row = result.rows[0]; // data retured from the previous query

  if (!row) {
    throw new NotFoundError("Thread not found");
  }

  return mapThreadDetailRow(row);
}

export async function listThreads(
  filter: ThreadListFilter
): Promise<ThreadSummary[]> {
  const { page, pageSize, categorySlug, sort, search } = filter;

  const conditions: string[] = [];

  const params: unknown[] = [];

  let idx = 1;

  if (categorySlug) {
    conditions.push(`c.slug = $${idx++}`);
    params.push(categorySlug);
  }

  if (search) {
    conditions.push(`(t.title ILIKE $${idx} OR t.body ILIKE $${idx})`);

    params.push(`%${search}%`);

    idx++;
  }

  const whereClause = conditions.length
    ? `WHERE ${conditions.join(" AND ")}`
    : "";

  const orderClause =
    sort === "old" ? "ORDER BY t.created_at ASC" : "ORDER BY t.created_at DESC";

  const offset = (page - 1) * pageSize;

  params.push(pageSize, offset);

  const result = await query<ThreadSummaryRow>(
    `
    SELECT
      t.id,
      t.title,
      LEFT(t.body, 200) AS excerpt,
      t.created_at,
      c.slug AS category_slug,
      c.name AS category_name,
      u.display_name AS author_display_name,
      u.handle AS author_handle
    FROM threads t
    JOIN categories c ON c.id = t.category_id
    JOIN users u ON u.id = t.author_user_id
    ${whereClause}
    ${orderClause}
    LIMIT $${idx++} OFFSET $${idx}
    `,
    params
  );

  return result.rows.map(mapThreadSummaryRow);
}
