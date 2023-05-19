const fs = require('fs');
const { SourceMapConsumer } = require("source-map");
const path = require("path");

const fileWithMapPath = 'c:\\SourceJavaScriptObfuscation\\IG-Downloader\\js\\extension.js';
const rootDir = 'c:\\SourceJavaScriptObfuscation\\parsed';

fs.readFile(fileWithMapPath, 'utf8' , async (err, data) => {
  if (err) return console.error(err);

  const sourceMapData = data.split('sourceMappingURL=data:application/json;charset=utf-8;base64,')[1];
  let buff = new Buffer.from(sourceMapData, 'base64');
  let rawSourceMap = buff.toString('ascii');

  let sourcemapObj = Buffer.from(sourceMapData, "base64").toString();
  sourcemapObj = JSON.parse(sourcemapObj);

  // fs.writeFile('rawSourceMap.js', rawSourceMap, function (err) {
  //   if (err) return console.log(err);
  // });
  // const foo = {
  //   version: 3,
  //   file: "js/extension.js"
  // };
  // var json = JSON.stringify(foo);
  //const json = JSON.parse(rawSourceMap.slice(1, -1));
  //const parsed = await new SourceMapConsumer(Object.assign(rawSourceMap));

  //  const parsed = await new SourceMapConsumer(rawSourceMap);

  //  fs.writeFile('example.ts', parsed.sourcesContent, function (err) {
  //    if (err) return console.log(err);
  //  });

  //  parsed.destroy();

  const targetDirname = path.join(rootDir, path.basename(fileWithMapPath));
  if (!fs.existsSync(targetDirname)) {
    fs.mkdirSync(targetDirname);
  }

  if ("object" == typeof sourcemapObj && Array.isArray(sourcemapObj.sources) && Array.isArray(sourcemapObj.sourcesContent)) {
    sourcemapObj.sourcesContent.forEach(async function (value, i) {
      const prefix = 'webpack://instagram_downloader/.';
      const cutted = sourcemapObj.sources[i].substring(prefix.length);
      const dir1 = path.dirname(cutted);
      const dir2 = path.join(targetDirname, dir1);
      if (!fs.existsSync(dir2)) {
        fs.mkdirSync(dir2, { recursive: true });
      }
      const fileName = path.basename(sourcemapObj.sources[i]);
      const fpath = path.join(dir2, fileName);
      await fs.writeFile(fpath, value, function (err) {
        if (err) return console.log(err);
      });
  });
  }
});
