/*
  qBittorrent SVG icon Converter
  ver 2021-01-02 test
  https://github.com/maboroshin/qBittorrentSVGiconConverter
*/

unPackFolder("icons_original");

function unPackFolder(path) {
  fso = new ActiveXObject("Scripting.FileSystemObject");
  var i = fso.GetFolder(path);
  with (new Enumerator(i.files))
    for (; !atEnd(); moveNext()) {
      var f = fso.GetFile(item());
      var r = /\.svg$/;

      if (r.test(f.Name)) {
      WScript.echo(
        readAllUTF8(f)
      );
      WScript.quit();
      }
    }
}

function readAllUTF8(path) {
  var adodbstreamLoad = new ActiveXObject("ADODB.Stream");
  adodbstreamLoad.Charset = "UTF-8"; // 変換後文字コード
  adodbstreamLoad.Open();
  adodbstreamLoad.LoadFromFile(path);
  var s = adodbstreamLoad.ReadText(-2)

  adodbstreamLoad.Close();
  return s;
}