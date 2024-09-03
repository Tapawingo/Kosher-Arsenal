export default eventHandler(async (event) => {
  return hubBlob().handleUpload(event, {
    formKey: 'files',
    multiple: false,
    ensure: {
      types: ['image/jpeg', 'image/png'],
    },
    put: {
      addRandomSuffix: true,
      prefix: 'preview'
    }
  })
})