import { ArsenalCategory, type ArsenalCategoryJson } from '~/classes/ArsenalCategory';
import { generateId } from 'lucia';
import { array, number, object, string } from 'yup';
import { initializeDB } from '~/server/utils/db';

interface IBody {
  data: {
    title: string;
    description: string;
    owner: string;
    template: {
      name: string;
      categories: Array<{
        position: number;
        icon: string;
        title: string;
      }>;
    };
  }
}

export default eventHandler(async (event) => {
  const db = initializeDB(hubDatabase());
  const lucia = event.context.lucia;
  const { data: body } = await readBody<IBody>(event);

  if (!event.context.session) {
    throw createError({
      statusCode: 403
    });
  }

  const { session, user } = await lucia.validateSession(event.context.session.id);
  if (!session) {
    throw createError({
      message: 'Unauthenticated User',
      statusCode: 403
    });
  }

  const schema = object({
    title: string().min(2).max(255),
    description: string().min(2).max(1024),
    owner: string().oneOf([user.id]),
    template: object().shape({
      position: number().required(),
      icon: string().required(),
      title: string().min(2).max(50),
      categories: array().of(
        object().shape({
          position: number(),
          icon: string(),
          title: string()
        })
      )
    })
  })
  
  if (!await schema.isValid(body)) {
    throw createError({
      message: 'Invalid loadout',
      statusCode: 400
    })
  }

  const categories: Array<ArsenalCategoryJson> = [];
  body.template.categories.forEach((category) => {
    categories.push(new ArsenalCategory(category).toJSON())
  });

  const loadoutId = generateId(15);

  try {
    await db.prepare('INSERT INTO loadouts ' +
      '(id, title, description, owner, collaborators, preview, tags, visibility, collections, categories) ' + 
      'VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
    ).bind(
      loadoutId,
      body.title,
      body.description,
      body.owner,
      JSON.stringify([]),
      JSON.stringify({ type: 0, path: "" }),
      JSON.stringify([]), 1, JSON.stringify([]),
      JSON.stringify(categories)
    ).run();
    
    return loadoutId;
  } catch (e: any) {
    throw createError({
      message: e.message,
      statusCode: 500
    });
  }
});