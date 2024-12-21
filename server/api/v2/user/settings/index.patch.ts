/** 
 * @file index.patch.ts
 * @description API to update user settings
 * 
 * @route /api/v2/user/:id/settings
 * @method PATCH
 */

import UserRepository from "~/server/repositories/user";

interface IBody {
  setting: string;
  value: string;
}

export default defineEventHandler(async (event) => {
  const lucia = event.context.lucia;
  const userRepository = new UserRepository(event.context.db);
  const body = await readBody<IBody>(event);

  /* Check if user is logged in to valid session */
  const { user } = await validateSession(event.context.session, lucia);

  try {
    await userRepository.updateSettings(user.id, body.setting, body.value);
  } catch (e: any) {
    throw createError({
      message: 'Something went wrong',
      statusCode: 500
    })
  }
});
