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
  /* https://stackoverflow.com/questions/18299806/how-to-check-file-mime-type-with-javascript-before-upload */
  /* https://gist.github.com/Qti3e/6341245314bf3513abb080677cd1c93b */
  return hubBlob().handleUpload(event, {
    formKey: 'files',
    multiple: false,
    ensure: {
      types: ['image/jpeg', 'image/png'],
      maxSize: "8MB"
    },
    put: {
      addRandomSuffix: true,
      prefix: `${ user.id }/preview`
    }
  })
});