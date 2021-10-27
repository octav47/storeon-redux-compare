// ignore_for_file: import_of_legacy_library_into_null_safe

@JS()
library callable_function;

import 'package:js/js.dart';
import 'package:react/react.dart';

/// Allows assigning a function to be callable from `window.functionName()`
@JS('__dart2js__.Picker')
external set _Picker (void Function() f);

/// Allows calling the assigned function from Dart as well.
@JS()
external void Picker();

class CoolWidgetComponent extends Component2 {
  String get value => props['value'];
  List get options => props['options'];
  dynamic get onChange => props['onChange'];

  render() {
    return span({},
      h1({}, value),
      select({
        'value': value,
        'onChange': (SyntheticEvent e) => onChange(e.target.value),
      }, options.map((o) => option({
        'key': o,
        'value': o
      }, o)))
    );
  }
}

dynamic _someDartFunction() {
  var CoolWidget = registerComponent2(() => CoolWidgetComponent());

  return CoolWidget;
}

void main() {
  _Picker = allowInterop(_someDartFunction);
  // JavaScript code may now call `functionName()` or `window.functionName()`.
}