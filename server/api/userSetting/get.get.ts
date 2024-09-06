import { DatabaseUserSetting } from "~/server/utils/db";

export default defineEventHandler(async (event): Promise<Array<DatabaseUserSetting>> => {
  return event.context.settings;
});
