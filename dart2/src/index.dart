// @dart=2.9

@JS('__js2dart__')
library main;

import 'dart:html';

import 'package:js/js.dart';

// import 'package:react/react.dart';
import 'package:react/react_dom.dart' as react_dom;

import 'importer.dart' as Importer;

external Root();

void main() {
  Importer.main();

  var r = Root();

  react_dom.render(r, querySelector('#root'));
}
