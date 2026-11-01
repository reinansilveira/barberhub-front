const MAX_FILE_SIZE = 5 * 1024 * 1024;
const MAX_AVATAR_LENGTH = 80_000;

const readFile = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Não foi possível ler a imagem."));
    reader.readAsDataURL(file);
  });

const loadImage = (source: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Não foi possível abrir a imagem."));
    image.src = source;
  });

export async function prepareAvatar(file: File) {
  if (!file.type.startsWith("image/")) {
    throw new Error("Escolha um arquivo de imagem.");
  }
  if (file.size > MAX_FILE_SIZE) {
    throw new Error("A imagem deve ter no máximo 5 MB.");
  }

  const source = await readFile(file);
  const image = await loadImage(source);
  const dimension = Math.min(512, image.naturalWidth, image.naturalHeight);
  const sourceSize = Math.min(image.naturalWidth, image.naturalHeight);
  const sourceX = (image.naturalWidth - sourceSize) / 2;
  const sourceY = (image.naturalHeight - sourceSize) / 2;
  const canvas = document.createElement("canvas");
  canvas.width = dimension;
  canvas.height = dimension;
  const context = canvas.getContext("2d");

  if (!context) throw new Error("Não foi possível processar a imagem.");

  context.drawImage(
    image,
    sourceX,
    sourceY,
    sourceSize,
    sourceSize,
    0,
    0,
    dimension,
    dimension,
  );

  let quality = 0.86;
  let result = canvas.toDataURL("image/jpeg", quality);
  while (result.length > MAX_AVATAR_LENGTH && quality > 0.42) {
    quality -= 0.08;
    result = canvas.toDataURL("image/jpeg", quality);
  }

  if (result.length > MAX_AVATAR_LENGTH) {
    throw new Error("A imagem ficou muito pesada. Escolha outra foto.");
  }

  return result;
}
