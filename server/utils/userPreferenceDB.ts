const db = hubDatabase();

/* Create loadout table */
db.prepare(`CREATE TABLE IF NOT EXISTS userPreference (
  id BIGINT NOT NULL PRIMARY KEY
  user_id TEXT NOT NULL,
  key TEXT NOT NULL,
  value TEXT NOT NULL
  FOREIGN KEY (user_id) REFERENCES user(id)
)`).run();

/* Declare a loadout interface */
export interface DatabasePreference {
  id: number;
  user_id: string;
  key: string;
  value: string;
};