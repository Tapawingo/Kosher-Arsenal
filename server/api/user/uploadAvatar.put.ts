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

  /* @TODO: ensure glob file type with magic numbers to prevent image spoofing */
  return hubBlob().handleUpload(event, {
    formKey: 'files',
    multiple: false,
    ensure: {
      types: ['image/jpeg', 'image/png'],
      maxSize: "8MB"
    },
    put: {
      addRandomSuffix: true,
      prefix: `${ user.id }/avatar`
    }
  })
});