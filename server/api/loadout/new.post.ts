import { ArsenalCategory, type ArsenalCategoryJson } from '~/classes/ArsenalCategory';
import { generateId } from 'lucia';
import { array, number, object, string } from 'yup';

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
  const db = event.context.db;
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
    title: string().min(2).max(255).required(),
    description: string().min(2).max(1024).required(),
    owner: string().oneOf([user.id], 'Invalid user ID').required(),
    preview: object().shape({
      type: number(),
      path: string().default('/arsenal/preview/default.png')
    }),
    tags: array().default([]),
    visibility: number().oneOf([0, 1, 2]).default(0),
    template: object().shape({
      name: string().min(2).max(50),
      categories: array().of(
        object().shape({
          position: number(),
          icon: string(),
          title: string()
        })
      ).required()
    })
  });
  
  let validatedBody;
  try {
    validatedBody = await schema.validate(body)
  } catch (e: any) {
    throw createError({
      message: e.message,
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
      validatedBody.title,
      validatedBody.description,
      validatedBody.owner,
      JSON.stringify([]),
      JSON.stringify(validatedBody.preview),
      JSON.stringify(validatedBody.tags), 
      validatedBody.visibility, 
      JSON.stringify([]),
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