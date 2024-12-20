import { array, number, object, string } from 'yup';
import { ArsenalLoadoutJson } from '~/classes/ArsenalLoadout';

interface IBody {
  data: ArsenalLoadoutJson
}

export default eventHandler(async (event) => {
  const db = event.context.db;
  const lucia = event.context.lucia;
  const { data: body } = await readBody<IBody>(event);

  if (!event.context.session) {
    console.error('Invalid Session');
    throw createError({
      statusCode: 403
    });
  }

  const { session, user } = await lucia.validateSession(event.context.session.id);
  if (!session) {
    console.error('Invalid User');
    throw createError({
      message: 'Unauthenticated User',
      statusCode: 403
    });
  }

  const schema = object({
    title: string().min(2).max(255),
    description: string().min(2).max(1024),
    owner: string().oneOf([user.id]),
    collaborators: array(),
    preview: object().shape({
      type: number(),
      path: string()
    }),
    tags: array(),
    visibility: number().oneOf([0, 1, 2]),
    collections: array(),
    categories: array()
  });

  try {
    await schema.validate(body)
  } catch (e: any) {
    console.error(e);
    throw createError({
      message: e.message,
      statusCode: 400
    })
  }

  try {
    await db.prepare('UPDATE loadouts SET ' +
      'title = ?, description = ?, collaborators = ?, preview = ?, tags = ?, visibility = ?, collections = ?, categories = ? ' +
      'WHERE id = ? AND owner = ?'
    ).bind(
      body.title,
      body.description,
      JSON.stringify(body.collaborators),
      JSON.stringify(body.preview),
      JSON.stringify(body.tags),
      body.visibility,
      JSON.stringify(body.collections),
      JSON.stringify(body.categories),
      body.id,
      user.id
    ).run();

  } catch (e: any) {
    console.log(e);
    throw createError({
      message: e.message,
      statusCode: 500
    });
  }
});