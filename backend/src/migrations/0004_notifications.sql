CREATE TABLE IF NOT EXISTS notifications (
    id BIGSERIAL PRIMARY KEY, /* id of that notification */

    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE, /* user id to which notification would be sent */

    actor_user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE, /* user id of the actor who liked or commented */

    thread_id BIGINT NOT NULL REFERENCES threads(id) ON DELETE CASCADE, /* hread id on which the actor is replying or commenting */

    type TEXT NOT NULL CHECK (type IN ('REPLY_ON_THREAD', 'LIKE_ON_THREAD')), /*as type we can enter just two of these types */
 
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    read_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_notifications_user_read
   ON notifications (user_id, read_at);