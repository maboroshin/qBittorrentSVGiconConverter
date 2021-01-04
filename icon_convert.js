/*
  qBittorrent SVG icon Converter
  ver 2021-01-04
  https://github.com/maboroshin/qBittorrentSVGiconConverter

  This used in "src" forlder.
  Make #nnnnnn the color of your choice in the right.
  Check the result in icons_index.html
*/

var arrayForReplace = [
  [/^stalled/, // filename
    [/path d="/, 'path fill="#aaaaaa" d="'] // search, replace
  ],
  [/^error/,
    [/path fill="red"/, 'path fill="#aa6775"']
  ],
  [/^paused/,
    [/fill="salmon"/, 'fill="#c98929"']
  ],
  [/./, // All red
    [/"#733737"/g, '"#aa6775"']
  ],
  [/./, // All blue
    [/"#375273"/g, '"#6e8dad"']
  ],
  [/./, // All green
    [/"#427337"/g, '"#5e8d60"']
  ],
];

unPackFolder("icons_original");
debug("converted");

function unPackFolder(path) {
  fso = new ActiveXObject("Scripting.FileSystemObject");
  var i = fso.GetFolder(path);
  with (new Enumerator(i.files))
    for (; !atEnd(); moveNext()) {
      var f = fso.GetFile(item());
      var extSVG = /\.svg$/;

      for (var i in arrayForReplace) {

        if (extSVG.test(f.Name)) {
            var convertPath = f.Path.replace("icons_original", "icons");
            var convertPathTmp = convertPath + ".tmp";
              //debug(convertPath);

            rewriteAllUTF8(f.Path, convertPathTmp, arrayForReplace, f.Name);
            charConv(convertPathTmp, convertPath);
            fso.deleteFile(convertPathTmp);
            //WScript.quit();
          }
      }
    }
}

function replaceSVG(s, arrayForReplace, name) {
  for (var i in arrayForReplace) {
    var checkName = arrayForReplace[i][0];
    var replaceStringArray = arrayForReplace[i][1];
    var searchString = replaceStringArray[0];
    var replaceString = replaceStringArray[1];
    if (checkName.test(name)) {
      s = s.replace(searchString, replaceString);
    }
  }
  return s;
}

function readAllUTF8(path) {
  var adodbstreamLoad = new ActiveXObject("ADODB.Stream");
  adodbstreamLoad.Charset = "UTF-8";
  adodbstreamLoad.Open();
  adodbstreamLoad.LoadFromFile(path);
  var s = adodbstreamLoad.ReadText(-2)

  adodbstreamLoad.Close();
  return s;
}

function rewriteAllUTF8(input, output, arrayForReplace, name) {
  var adodbstreamLoad = new ActiveXObject("ADODB.Stream");
  adodbstreamLoad.Open();
  adodbstreamLoad.Type = 2;
  adodbstreamLoad.Charset = "UTF-8";

  var adodbstreamBuffReplace = new ActiveXObject("ADODB.Stream");
  adodbstreamBuffReplace.Open();
  adodbstreamBuffReplace.Type = 2;
  adodbstreamBuffReplace.Charset = "UTF-8";

  adodbstreamLoad.LoadFromFile(input);
  var s = adodbstreamLoad.ReadText( -1 ); // -1 :ReadAll ,2 : ReadEachLine
  adodbstreamLoad.Close();
  s = replaceSVG(s, arrayForReplace, name);
  adodbstreamBuffReplace.WriteText(s);

  adodbstreamBuffReplace.SaveToFile(output, 2);  // 2 : overwrite
  adodbstreamBuffReplace.Close();
}

function charConv(inputfile, outputfile) {
  var adodbstreamLoad = new ActiveXObject("ADODB.Stream");
  adodbstreamLoad.Open();
  adodbstreamLoad.Type = 2;
  adodbstreamLoad.Charset = "UTF-8"; 

  var adodbstreamBuff = new ActiveXObject("ADODB.Stream");
  adodbstreamBuff.Open();
  adodbstreamBuff.Type = 2;
  adodbstreamBuff.Charset = "UTF-8";

  adodbstreamLoad.LoadFromFile(inputfile);
  adodbstreamLoad.CopyTo(adodbstreamBuff);
  adodbstreamLoad.Close();
  
  adodbstreamBuff.Position = 0;
  adodbstreamBuff.Type = 1;
  adodbstreamBuff.Position = 3;

  var adodbstreamSave = new ActiveXObject("ADODB.Stream");
  adodbstreamSave.Open();
  adodbstreamSave.Type = 1;
  adodbstreamBuff.CopyTo(adodbstreamSave);

  adodbstreamSave.SaveToFile(outputfile, 2);
  adodbstreamSave.Close();
  adodbstreamBuff.Close();
}

function debug(s) {
  WScript.echo(s);
  WScript.quit();
}