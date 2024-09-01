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
  const db = hubDatabase();
  const { data: body } = await readBody<IBody>(event);

  if (!event.context.session) {
    throw createError({
      statusCode: 403
    });
  }
  
  const title = body.title;
  if (
    typeof title !== "string" ||
    title.length < 1 ||
    title.length > 255
  ) {
    throw createError({
      message: 'Invalid title',
      statusCode: 400
    });
  }
  
  const description = body.description;
  if (
    typeof description !== "string" ||
    description.length < 1 ||
    description.length > 255
  ) {
    throw createError({
      message: 'Invalid description',
      statusCode: 400
    });
  }
  
  const user = event.context.user ?? { id: '' };
  const owner = body.owner;
  if (
    typeof owner !== "string" ||
    owner !== user.id
  ) {
    throw createError({
      message: 'Invalid user',
      statusCode: 400
    });
  }

  const templateSchema = array().of(
    object().shape({
      position: number().required(),
      icon: string().required(),
      title: string().min(2).max(50)
    })
  )

  const template = body.template;
  if (
    !template.name ||
    !template.categories ||
    !templateSchema.isValidSync(template.categories)
  ) {
    throw createError({
      message: 'Invalid Template',
      statusCode: 400
    })
  }

  const categories: Array<ArsenalCategoryJson> = [];
  template.categories.forEach((category) => {
    categories.push(new ArsenalCategory(category).toJSON())
  });

  const loadoutId = generateId(15);

  try {
    await db.prepare('INSERT INTO loadouts \
      (id, title, description, owner, collaborators, preview, tags, visibility, collections, categories) \
      VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
    .bind(
      loadoutId, 
      title, 
      description, 
      owner, 
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