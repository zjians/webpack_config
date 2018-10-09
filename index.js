import './style.css'
@testable
class MyTestableClass {
  // ...
}

function testable(target) {
  console.log(target)
  target.isTestable = true;
}

console.log(MyTestableClass.isTestable)
