export default defineEventHandler(async (event): Promise<string> => {
  const { files } = await readBody<{ files: Array<File> }>(event)

  const filename = await storeFileLocally(
    files[0],         // the file object
      8,            // you can add a name for the file or length of Unique ID that will be automatically generated!
      '/previews'  // the folder the file will be stored in
  )

  return filename
})

interface File {
  name: string
  content: string
  size: string 
  type: string
  lastModified: string
}