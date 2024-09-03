export default eventHandler(async (event) => {
  const lucia = event.context.lucia;

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

  return hubBlob().handleUpload(event, {
    formKey: 'files',
    multiple: false,
    ensure: {
      types: ['image/jpeg', 'image/png'],
    },
    put: {
      addRandomSuffix: true,
      prefix: `${ user.id }/preview`
    }
  })
});