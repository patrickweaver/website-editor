export async function getDataURLFromFile(file: File) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function isImageFile(file: File) {
  if (!file.type.startsWith("image/")) {
    return false;
  }
  return true;
}

// Chromium only
// https://developer.mozilla.org/en-US/docs/Web/API/FileSystemWritableFileStream/write
export async function saveFile(data: string) {
  console.log("**", typeof data);
  // create a new handle
  const newHandle = await window.showSaveFilePicker({
    startIn: "desktop",
    suggestedName: "index.html",
    types: [{ description: "HTML", accept: { "text/markdown": [".html"] } }],
  });
  // create a FileSystemWritableFileStream to write to
  const writableStream = await newHandle.createWritable();
  // write our file
  await writableStream.write(data);
  // close the file and write the contents to disk.
  await writableStream.close();
}
