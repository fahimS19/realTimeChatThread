
CREATE TABLE IF NOT EXISTS replies (
    id BIGSERIAL PRIMARY KEY, /* a unique reply id for every reply*/

    thread_id BIGINT NOT NULL REFERENCES threads(id) ON DELETE CASCADE, /* id of the thread on which this reply is given*/

    author_user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE, /* if a user id is deleted from the users table , then every reply related to that user id will be deleted*/

    body TEXT NOT NULL,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


CREATE INDEX IF NOT EXISTS idx_replies_thread_created_at
  ON replies (thread_id, created_at ASC);


/* same like replies ,just like instead of replies*/
CREATE TABLE IF NOT EXISTS thread_reactions (
  id BIGSERIAL PRIMARY KEY, /* an unique identifier of that particular like*/

  thread_id BIGINT NOT NULL REFERENCES threads(id) ON DELETE CASCADE, /*on which thread we have given that like,if a thread is deleted ,then automatically all the likes of that thread will be deleted */

  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT uniq_thread_reaction UNIQUE (thread_id, user_id) /* an entry with same threadId and UserId can't be entered twice ,since in a thread a user can like only once or you can say a unique like can't have two user id  */


);

CREATE INDEX IF NOT EXISTS idx_thread_reactions_thread
   ON thread_reactions (thread_id);