const QUE_FILE_EXTENSION = '.que';
const ASSETS_START = '<assets>';
const ASSETS_END = '</assets>';

// .que 확장자 체크
const isQueueFile = (fileName: string) => {
  return fileName.endsWith(QUE_FILE_EXTENSION);
};

export const parseTheQueueFile = (queFile: File) => {
  console.log('queFile', queFile);
  console.log('isQueueFile', isQueueFile(queFile.name));

  const fileReader = new FileReader();

  fileReader.addEventListener('load', (event: ProgressEvent<FileReader>) => {
    const result = event.target.result;

    if (!!result && typeof result === 'string') {
      const assetsStartIndex = result.indexOf(ASSETS_START);
      const assetsEndIndex = result.indexOf(ASSETS_END);
      const assets = result
        .substring(assetsStartIndex + ASSETS_START.length, assetsEndIndex)
        .trim();

      const assetsObj = JSON.parse(assets);

      console.log('assetsObj', assetsObj);
    }
  });

  fileReader.readAsText(queFile);
};
