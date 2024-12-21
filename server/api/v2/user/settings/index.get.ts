/** 
 * @file index.get.ts
 * @description API to Get user settings
 * 
 * @route /api/v2/user/settings
 * @method GET
 */

export default defineEventHandler(async (event) => {
  return event.context.settings;
});
