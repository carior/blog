## 基本类型
### 布尔值
```ts
let isDone: boolean = false
function alertName(): void {
  alert('测试')
}
let unusable:void = undefined
```
### 数字
```ts
let num: number = 0
let hexLiteral: number = 0xf00d
```
### 字符串
```ts
let myName: string = '小红' 
```
### 数组
```ts
// 方式1 元素类型[]
let list: number[] = [1, 2, 3];
// 方式2 Array<元素类型>
let list: Array<number> = [1, 2, 3];
```
### 元组 Tuple

> 元组类型允许表示一个已知元素数量和类型的数组，各元素的类型不必相同

```ts
let x: [string, number];
x = ['hello', 10]; // OK
x = [10, 'hello']; // Error
// 当访问一个已知索引的元素，会得到正确的类型：
console.log(x[0].substr(1)); // OK
console.log(x[1].substr(1)); // Error, 'number' does not have 'substr'
// 当访问一个越界的元素，会使用联合类型替代
x[3] = 'world'; // OK, 字符串可以赋值给(string | number)类型
console.log(x[5].toString()); // OK, 'string' 和 'number' 都有 toString
x[6] = true; // Error, 布尔不是(string | number)类型
```
### 枚举
```ts
enum Color {Red, Green, Blue}
let c: Color = Color.Green; // 1 默认从0开始编号
```
### Any
```ts
let notSure: any = 4;
notSure = "maybe a string instead";
let list: any[] = [1, true, "free"];
```
### Void
```ts
function warnUser(): void {
    console.log("This is my warning message");
}
// 声明一个void类型的变量没有什么大用，因为你只能为它赋予undefined和null：
let unusable: void = undefined;
```
### Null 和 Undefined
 - 默认情况下null和undefined是所有类型的子类型。 就是说你可以把 null和undefined赋值给number类型的变量。
 - 指定了strictNullChecks后，null和undefined只能赋值给void和它们各自

也许在某处你想传入一个 string或null或undefined，可以使用**联合类型**`let myName: string | undefined | null = '小红' `

### Never
> never类型表示的是那些永不存在的值的类型
例如：
- 总是会抛出异常
- 根本就不会有返回值的函数表达式 或 箭头函数表达式的返回值类型
- 变量也可能是 never类型，当它们被永不为真的类型保护所约束时
```ts
function error(message: string): never {
  throw new Error(message);
} 
// 推断的返回值类型为never
function fail() {
    return error("Something failed");
}
// 返回never的函数必须存在无法达到的终点
function infiniteLoop(): never {
    while (true) {
    }
}
```
### Object  
> object表示非原始类型，也就是除number，string，boolean，symbol，null或undefined之外的类型。
```ts
declare function create(o: object | null): void;

create({ prop: 0 }); // OK
create(null); // OK

create(42); // Error
create("string"); // Error
create(false); // Error
create(undefined); // Error
```

## 类型断言
> 类型断言好比其它语言里的类型转换，但是不进行特殊的数据检查和解构。 它没有运行时的影响，只是在编译阶段起作用,告诉编译器我知道自己是什么类型 也知道自己在干什么
```ts
// 写法一
let someValue: any = "this is a string";
let strLength: number = (<string>someValue).length;
// 写法二， JSX时候只有as语法断言是被允许的
let someValue: any = "this is a string";
let strLength: number = (someValue as string).length;
```
```ts
function getLength(str: string | number): number {
  if((str as string).length) {
  // if((<string>str).length) {
    return (<string>str).length
  }else {
    return str.toString().length
  }
}
```

## 接口
> 它能合并众多类型声明至一个类型声明,作用就是为这些类型命名和为你的代码或第三方代码定义契约
### 接口初探
```js
interface LabelledValue {
  label: string;
}

function printLabel(labelledObj: LabelledValue) {
  console.log(labelledObj.label);
}

let myObj = {size: 10, label: "Size 10 Object"};
printLabel(myObj)
```
#### 可选属性
```ts
interface SquareConfig {
  color?: string;
  width?: number;
}
```
#### 只读属性
一些对象属性只能在对象刚刚创建的时候修改其值。 你可以在属性名前用 readonly来指定只读属性:
```ts
interface Point {
    readonly x: number;
    readonly y: number;
}

let p1: Point = { x: 10, y: 20 };
p1.x = 5; // error!
```
- ReadonlyArray
```ts
let a: number[] = [1, 2, 3, 4];
let ro: ReadonlyArray<number> = a;
ro[0] = 12; // error!
ro.push(5); // error!
ro.length = 100; // error!
a = ro; // error!
// 可以通过类型断言重写
a = ro as number[];
```
#### 额外的属性检查
- 最佳的方式是能够添加一个**字符串索引签名**
```ts
interface SquareConfig {
    color?: string;
    width?: number;
    [propName: string]: any;
}

function createSquare(config: SquareConfig): { color: string; area: number } {
  let newSquare = {color: "white", area: 100};
  if (config.color) {
    newSquare.color = config.color;
  }
  if (config.width) {
    newSquare.area = config.width * config.width;
  }
  return newSquare;
}

let mySquare = createSquare({ width: 100, colour: 'red' });

```
#### 函数类型
它就像是一个只有参数列表和返回值类型的函数定义。参数列表里的每个参数都需要名字和类型。
```ts
// 接口可以描述函数类型(参数的类型与返回的类型)
interface SearchFunc {
  (source: string, subString: string): boolean;
}
let mySearch: SearchFunc;
// 参数名称不用对应
mySearch = function(src: string, sub: string): boolean {
  let result = src.search(sub);
  return result > -1;
}
```
#### 可索引的类型
```ts
// 这个索引签名表示了当用 number去索引StringArray时会得到string类型的返回值。
interface StringArray {
  [index: number]: string;
}

let myArray: StringArray;
myArray = ["Bob", "Fred"];

let myStr: string = myArray[0];

interface NumberArray {
  [index: number]: number
}
let arr3: NumberArray = [1,2,3]
```

```ts
// 使用字符串作为索引签名去索引
interface NumberDictionary {
  [index: string]: number;
  length: number;    // 可以，length是number类型
  name: number       // 可以，name是number类型
}
let myArray: NumberDictionary;
myArray = {name: 1, length: 9, text: 10};
let myStr: number = myArray['length'];
console.log(myStr);

```
### 类类型(类构造函数的类型)
#### 类实现接口
> 接口描述了类的公共部分，而不是公共和私有两部分。 它不会帮你检查类是否具有某些私有成员。
```ts
interface ClockInterface {
    currentTime: Date;
    setTime(d: Date);
}

class Clock implements ClockInterface {
    currentTime: Date;
    setTime(d: Date) {
        this.currentTime = d;
    }
    constructor(h: number, m: number) { }
}
```
#### 类静态部分与实例部分的区别（⭐）
> 注意类是具有两个类型的 **静态部分的类型**和**实例的类型**，当一个类实现了一个接口时，只对其**实例部分**进行类型检查，而类里的constructor属于静态部分，所以不检查。
```ts
// 错误的演示
interface ClockConstructor {
    new (hour: number, minute: number);
}

class Clock implements ClockConstructor {
    currentTime: Date;
    // 不能检查constructor，而你又在接口里面写了 所以报错
    constructor(h: number, m: number) { }
}
```
```ts
// 如果一定要用类实现接口，并且要在接口里用构造器签名的 正确的做法
// 为构造函数所用 静态部分 不再检查的范围 直接操作类的静态部分
interface ClockConstructor {
  new (hour: number, minute: number): ClockInterface;
}
// 为实例方法所用 实例部分
interface ClockInterface {
  tick():void;
}

// 也可以定义一个构造函数 createClock，它用传入的类型创建实例
// function createClock(ctor: ClockConstructor, hour: number, minute: number): ClockInterface {
//   return new ctor(hour, minute);
// }

class DigitalClock implements ClockInterface {
  constructor(h: number, m: number) { }
  tick() {
      console.log("beep beep");
  }
}
class AnalogClock implements ClockInterface {
  constructor(h: number, m: number) { }
  tick() {
      console.log("tick tock");
  }
}
let digital = new DigitalClock(12, 17)
let analog = new AnalogClock(7, 32)
digital.tick()
analog.tick()

// let digital = createClock(DigitalClock, 12, 17);
// let analog = createClock(AnalogClock, 7, 32);

```

```ts
// 或者使用这种方式
interface ClockConstructor {
  new (hour: number, minute: number);
}

interface ClockInterface {
  tick();
}

const Clock: ClockConstructor = class Clock implements ClockInterface {
  constructor(h: number, m: number) {}
  tick() {
    console.log("beep beep");
  }
};

let c =new Clock(12,4);
```
### 公共，私有与受保护的修饰符
 * public 共有的 任何地方都可以访问到
 * private 私有的 不能在类的外部使用 子类不能使用
 * protected 受保护的方法 子类可以使用
```ts
 class Animal {
  public name: string
  // 只读属性必须在声明时或构造函数里被初始化
  readonly name: string = 'abc'

  public constructor(name: string) {
    this.name = name
  }

  public run(distance: number = 0) {
    console.log(`${this.name} run ${distance}m`)
  }
}

class Person extends Animal {
  private age: number = 18
  protected sex: string = '男'

  run(distance: number = 5) {
    console.log('Person jumping...')
    super.run(distance)
  }
}

class Student extends Person {
  run(distance: number = 6) {
    console.log('Student jumping...')

    console.log(this.sex) // 子类能看到父类中受保护的成员
    // console.log(this.age) //  子类看不到父类中私有的成员

    super.run(distance)
  }
}
console.log(new Person('abc').name) // 公开的可见
console.log(new Person('abc').sex) // 受保护的不可见
console.log(new Person('abc').age) //  私有的不可见
```
### 继承接口
> 和类一样，接口也可以相互继承。 这让我们能够从一个接口里复制成员到另一个接口里，可以更灵活地将接口分割到可重用的模块里。
```ts
interface Shape {
    color: string;
}

interface Square extends Shape {
    sideLength: number;
}

let square = <Square>{};
square.color = "blue";
square.sideLength = 10;
```
也可以继承多个
```ts
interface PenStroke {
    penWidth: number;
}
interface Square extends Shape, PenStroke {
    sideLength: number;
}
```

### 接口混合类型
例如一个对象可以同时做为**函数**和**对象**使用，并带有额外的属性。
```ts
interface Counter {
    (start: number): string;
    interval: number;
    reset(): void;
}

function getCounter(): Counter {
    let counter = <Counter>function (start: number) { };
    counter.interval = 123;
    counter.reset = function () { };
    return counter;
}

let c = getCounter();
c(10);
c.reset();
c.interval = 5.0;
```
### 接口继承类
这意味着当你创建了一个接口继承了一个拥有私有或受保护的成员的类时，这个接口类型只能被这个类或其子类所实现（implement）。
```ts
class Control {
    private state: any;
}
// 当接口继承了一个类类型时,它会继承类的成员但不包括其实现。
// 就好像接口声明了所有类中存在的成员，但并没有提供具体实现一样。
// 接口同样会继承到类的private和protected成员。
interface SelectableControl extends Control {
    select(): void;
}
// SelectableControl 接口类型只能被这个类或其子类所实现（implement）
class Button extends Control implements SelectableControl {
    select() { }
}

class TextBox extends Control {
    select() { }
}

// 错误：“Image”类型缺少“state”属性。
// SelectableControl包含了Control的所有成员，包括私有成员state
// 因为 state 是私有成员，所以只能够是Control的子类们才能实现SelectableControl接口。
class Image implements SelectableControl {
    select() { }
}
```

## 类

### 介绍
```ts
class Greeter {
    greeting: string;
    constructor(message: string) {
        this.greeting = message;
    }
    greet() {
        return "Hello, " + this.greeting;
    }
}

let greeter = new Greeter("world");
```
### 继承
 基于类的程序设计中一种最基本的模式是允许使用继承来扩展现有的类。类从基类中继承了属性和方法。这里， Snake，Horse 是一个**派生类**，它派生自 Animal **基类**，通过 extends关键字。 派生类通常被称作 **子类**，基类通常被称作 **超类**，派生类包含了一个构造函数，它 必须调用 **super()**，它会执行基类的构造函数。而且，在构造函数里访问 this的属性之前，我们 一定要调用 **super()**。 这个是TypeScript强制执行的一条重要规则。
 ```ts
class Animal {
    name: string;
    constructor(theName: string) { this.name = theName; }
    move(distanceInMeters: number = 0) {
        console.log(`${this.name} moved ${distanceInMeters}m.`);
    }
}

class Snake extends Animal {
    // 这个构造函数会在我们使用 new创建类实例的时候被调用
    constructor(name: string) { super(name); }
    // 重写父类的方法
    move(distanceInMeters = 5) {
        console.log("Slithering...");
        super.move(distanceInMeters);
    }
}

class Horse extends Animal {
    // 这个构造函数会在我们使用 new创建类实例的时候被调用
    constructor(name: string) { super(name); }
    // 重写父类的方法
    move(distanceInMeters = 45) {
        console.log("Galloping...");
        super.move(distanceInMeters);
    }
}

let sam = new Snake("Sammy the Python");
//  注意，即使 tom被声明为 Animal类型，但因为它的值是 Horse，调用 tom.move(34)时，它会调用 Horse里重写的方法
let tom: Animal = new Horse("Tommy the Palomino");

sam.move();
tom.move(34);
 ```
### 存取器
通过getters/setters来截取对对象成员的访问。只带有 get不带有 set的存取器自动被推断为 readonly。
```ts
// 这是一个简单的对对象成员的设置
class Employee {
    fullName: string;
}

let employee = new Employee();
employee.fullName = "Bob Smith";
if (employee.fullName) {
    console.log(employee.fullName);
}
```
```ts
// 我们把对 fullName的直接访问改成了可以检查密码的 set方法
let passcode = "secret passcode";

class Employee {
    private _fullName: string;

    get fullName(): string {
        return this._fullName;
    }

    set fullName(newName: string) {
        if (passcode && passcode == "secret passcode") {
            this._fullName = newName;
        }
        else {
            console.log("Error: Unauthorized update of employee!");
        }
    }
}

let employee = new Employee();
employee.fullName = "Bob Smith";
if (employee.fullName) {
    alert(employee.fullName);
}
```
### 静态属性
静态属性存在于类本身上面而不是类的实例上。每个实例想要访问这个属性的时候，都要在 origin前面加上类名。 如同在实例属性上使用 this.前缀来访问属性一样。
```ts
class Grid {
    static origin = {x: 0, y: 0};
    calculateDistanceFromOrigin(point: {x: number; y: number;}) {
        let xDist = (point.x - Grid.origin.x);
        let yDist = (point.y - Grid.origin.y);
        return Math.sqrt(xDist * xDist + yDist * yDist) / this.scale;
    }
    constructor (public scale: number) { }
}

let grid1 = new Grid(1.0);  // 1x scale
let grid2 = new Grid(5.0);  // 5x scale

console.log(grid1.calculateDistanceFromOrigin({x: 10, y: 10}));
console.log(grid2.calculateDistanceFromOrigin({x: 10, y: 10}));
```

### 抽象类
- 抽象类做为其它派生类的基类使用
- 它们一般不会直接被实例化, 不能创建一个抽象类的实例
- abstract关键字是用于定义抽象类和在抽象类内部定义抽象方法
- 抽象类中的抽象方法不包含具体实现并且必须在派生类中实现
- 抽象方法的语法与接口方法相似。 两者都是定义方法签名但不包含方法体,包含 abstract关键字并且可以包含访问修饰符
- 抽象子类进行实例化后，不能调用一个在抽象类中不存在的方法
```ts
abstract class Department {

    constructor(public name: string) {
    }

    printName(): void {
        console.log('Department name: ' + this.name);
    }

    abstract printMeeting(): void; // 必须在派生类中实现
}

class AccountingDepartment extends Department {

    constructor() {
        super('Accounting and Auditing'); // 在派生类的构造函数中必须调用 super()
    }

    printMeeting(): void {
        console.log('The Accounting Department meets each Monday at 10am.');
    }

    generateReports(): void {
        console.log('Generating accounting reports...');
    }
}

let department: Department; // 允许创建一个对抽象类型的引用
department = new Department(); // 错误: 不能创建一个抽象类的实例
department = new AccountingDepartment(); // 允许对一个抽象子类进行实例化和赋值
department.printName();
department.printMeeting();
department.generateReports(); // 错误: 方法在声明的抽象类中不存在
```
### 高级技巧
#### 构造函数

#### 把类当做接口使用
类定义会创建两个东西：类的实例类型和一个构造函数。因为类可以创建出类型，所以你能够在允许使用接口的地方使用类。
```ts
class Point {
    x: number;
    y: number;
}

interface Point3d extends Point {
    z: number;
}

let point3d: Point3d = {x: 1, y: 2, z: 3};
```

## 函数
#### 为函数定义类型
我们可以给每个参数添加类型之后再为函数本身添加返回值类型。 TypeScript能够根据返回语句自动推断出返回值类型，因此我们通常省略它。
```ts
function add(x: number, y: number): number {
    return x + y;
}

let myAdd = function(x: number, y: number): number { return x + y; };
```
#### 书写完整函数类型
```ts
let myAdd: (x: number, y: number) => number =
    function(x: number, y: number): number { return x + y; };
```
#### 推断类型
你在赋值语句的一边指定了类型但是另一边没有类型的话，TypeScript编译器会自动识别出类型：
```ts
// myAdd has the full function type
let myAdd = function(x: number, y: number): number { return x + y; };

// The parameters `x` and `y` have the type number
let myAdd: (baseValue: number, increment: number) => number =
    function(x, y) { return x + y; };
```

### 可选参数和默认参数
- TypeScript里的每个函数参数都是必须的。传递给一个函数的参数个数必须与函数期望的参数个数一致。
```ts
function buildName(firstName: string, lastName: string) {
    return firstName + " " + lastName;
}

let result1 = buildName("Bob");                  // error, too few parameters
let result2 = buildName("Bob", "Adams", "Sr.");  // error, too many parameters
let result3 = buildName("Bob", "Adams");         // ah, just right
```

- JavaScript里，每个参数都是可选的，可传可不传。 没传参的时候，它的值就是undefined。 在TypeScript里我们可以在参数名旁使用 ?实现可选参数的功能。 比如，我们想让last name是可选的：
```ts
function buildName(firstName: string, lastName?: string) {
    if (lastName)
        return firstName + " " + lastName;
    else
        return firstName;
}

let result1 = buildName("Bob");  // works correctly now
let result2 = buildName("Bob", "Adams", "Sr.");  // error, too many parameters
let result3 = buildName("Bob", "Adams");  // ah, just right
```
- 可以为参数提供一个默认值当用户没有传递这个参数或传递的值是undefined时
```ts
function buildName(firstName: string, lastName = "Smith") {
    return firstName + " " + lastName;
}

let result1 = buildName("Bob");                  // works correctly now, returns "Bob Smith"
let result2 = buildName("Bob", undefined);       // still works, also returns "Bob Smith"
let result3 = buildName("Bob", "Adams", "Sr.");  // error, too many parameters
let result4 = buildName("Bob", "Adams");         // ah, just right
```
### 剩余参数
```ts
function buildName(firstName: string, ...restOfName: string[]) {
  return firstName + " " + restOfName.join(" ");
}

let employeeName = buildName("Joseph", "Samuel", "Lucas", "MacKinzie");
```
### this
JavaScript里，this的值在函数被调用的时候才会指定。
### 重载
JavaScript本身是个动态语言。 JavaScript里函数根据传入不同的参数而返回不同类型的数据是很常见的。
```ts
// 为同一个函数提供多个函数类型定义来进行函数重载
let suits = ["hearts", "spades", "clubs", "diamonds"];

function pickCard(x: {suit: string; card: number; }[]): number;
function pickCard(x: number): {suit: string; card: number; };
function pickCard(x): any {
    // Check to see if we're working with an object/array
    // if so, they gave us the deck and we'll pick the card
    if (typeof x == "object") {
        let pickedCard = Math.floor(Math.random() * x.length);
        return pickedCard;
    }
    // Otherwise just let them pick the card
    else if (typeof x == "number") {
        let pickedSuit = Math.floor(x / 13);
        return { suit: suits[pickedSuit], card: x % 13 };
    }
}

let myDeck = [{ suit: "diamonds", card: 2 }, { suit: "spades", card: 10 }, { suit: "hearts", card: 4 }];
let pickedCard1 = myDeck[pickCard(myDeck)];
alert("card: " + pickedCard1.card + " of " + pickedCard1.suit);

let pickedCard2 = pickCard(15);
alert("card: " + pickedCard2.card + " of " + pickedCard2.suit);
```

## 泛型
我们不知道传入的类型是什么，但是我们需要一种方法使返回值的类型与传入参数的类型是相同的。因此，我们使用了 **类型变量**，它是一种特殊的变量，只用于表示**类型**而不是值。
### 泛型之Hello World
我们给identity添加了类型变量T。 T帮助我们捕获用户传入的类型（比如：number），之后我们就可以使用这个类型
```ts
function identity<T>(arg: T): T {
    return arg;
}
identity<string>('xx')
identity<number>(11)
```
定义了泛型函数后，有两种方法可以使用。

1. 传入所有的参数，包含类型参数, 使用<>传入类型参数为string
```ts
let output = identity<string>("myString");  // type of output will be 'string'
```
2. 类型推论 -- 即编译器会根据传入的参数自动地帮助我们确定T的类型：
```ts
let output = identity("myString");  // type of output will be 'string'
```
### 使用泛型变量
你可以这样理解loggingIdentity的类型：泛型函数loggingIdentity，接收类型参数T和参数arg，它是个元素类型是T的数组，并返回元素类型是T的数组。 如果我们传入数字数组，将返回一个数字数组，因为此时 T的的类型为number。 这可以让我们把泛型变量T当做类型的一部分使用，而不是整个类型，增加了灵活性。
```ts
function loggingIdentity<T>(arg: T[]): T[] {
// 也可以这样写 
// function loggingIdentity<T>(arg: Array<T>): Array<T> {
    console.log(arg.length);  // Array has a .length, so no more error
    return arg;
}
```
### 泛型类型
- 泛型函数的类型与非泛型函数的类型没什么不同，只是有一个类型参数在最前面
```ts
function identity<T>(arg: T): T {
    return arg;
}

let myIdentity: <T>(arg: T) => T = identity;
```
- 使用不同的泛型参数名,只要在数量上和使用方式上能对应上就可以。
```ts
function identity<T>(arg: T): T {
    return arg;
}

let myIdentity: <U>(arg: U) => U = identity;
```
- 还可以使用带有调用签名的对象字面量来定义泛型函数：
```ts
function identity<T>(arg: T): T {
    return arg;
}

let myIdentity: {<T>(arg: T): T} = identity;
```
- 第一个**泛型接口**
```ts
// 我们把上面例子里的对象字面量拿出来做为一个接口
interface GenericIdentityFn {
    <T>(arg: T): T;
}

function identity<T>(arg: T): T {
    return arg;
}

let myIdentity: GenericIdentityFn = identity;
```
- 把泛型参数当作整个接口的一个参数,这样我们就能清楚的知道使用的具体是哪个泛型类型。这样接口里的其它成员也能知道这个参数的类型了。
```ts
interface GenericIdentityFn<T> {
    (arg: T): T;
}

function identity<T>(arg: T): T {
    return arg;
}

let myIdentity: GenericIdentityFn<number> = identity;
```
### 泛型类
```ts
class GenericNumber<T> {
    zeroValue: T;
    add: (x: T, y: T) => T;
}

let myGenericNumber = new GenericNumber<number>();
myGenericNumber.zeroValue = 0;
myGenericNumber.add = function(x, y) { return x + y; };
```
我们在类那节说过，类有两部分：静态部分和实例部分。 **泛型类**指的是**实例部分**的类型，所以类的**静态属性**不能使用这个**泛型类型**。
### 泛型约束
我们定义一个接口来描述约束条件。 创建一个包含 .length属性的接口，使用这个接口和extends关键字来实现约束：
```ts
interface Lengthwise {
    length: number;
}

function loggingIdentity<T extends Lengthwise>(arg: T): T {
    console.log(arg.length);  // Now we know it has a .length property, so no more error
    return arg;
}
```
现在这个泛型函数被定义了约束，因此它不再是适用于任意类型：
```ts
loggingIdentity(3);  // Error, number doesn't have a .length property
```
我们需要传入符合约束类型的值，必须包含必须的属性：
```ts
loggingIdentity({length: 10, value: 3});
```
#### 在泛型约束中使用类型参数
你可以声明一个类型参数，且它被另一个类型参数所约束。 比如，现在我们想要用属性名从对象里获取这个属性。 并且我们想要确保这个属性存在于对象 obj上，因此我们需要在这两个类型之间使用约束。
```ts
function getProperty(obj: T, key: K) {
    return obj[key];
}

let x = { a: 1, b: 2, c: 3, d: 4 };

getProperty(x, "a"); // okay
getProperty(x, "m"); // error: Argument of type 'm' isn't assignable to 'a' | 'b' | 'c' | 'd'.
```
#### 在泛型里使用类类型
在TypeScript使用泛型创建工厂函数时，需要引用构造函数的类类型。比如，
[如何在typescript中表示一个类构造函数的类型](https://blog.csdn.net/qq_34629352/article/details/119643642)
```ts
function create<T>(c: {new(): T; }): T {
    return new c();
}
```
一个更高级的例子，使用原型属性推断并约束构造函数与类实例的关系。
```ts
class BeeKeeper {
    hasMask: boolean;
}

class ZooKeeper {
    nametag: string;
}

class Animal {
    numLegs: number;
}

class Bee extends Animal {
    keeper: BeeKeeper;
}

class Lion extends Animal {
    keeper: ZooKeeper;
}

function createInstance<A extends Animal>(c: new () => A): A {
    return new c();
}

createInstance(Lion).keeper.nametag;  // typechecks!
createInstance(Bee).keeper.hasMask;   // typechecks!
```

## 枚举

## 类型推论

## 高级类型

## 装饰器
js 元编程
IOC 注入
## ts中的一些特殊符号
- ! 非空断言操作符
- ?. 可选链
- ?? 空值合并运算符
- ?: 可选属性
- & 多种类型叠加
- | 多种类型中的一种
- _ 数字分隔符如1_123_678
- <> TypeScript 泛型
- @ 装饰器预发
- # 类的私有字段
- -? 移除了可选属性中的`?`
- ?: 可选参数

## 高级类型
- ConstructorParameters: 类构造函数的参数类型的元祖
- Exclude: 从另一个类型中排除了一个类型
- Extract： 选择给可分配给另一种类型的子类型
- InstanceTypes： 获取构造函数的实例类型
- NonNullable: 从类型中排除null和undefined 
- parameters: 函数参数类型的元祖
- Partial: 将对象中的所有属性设为可选
- Readonly: 使对象中的所有属性为只读
- ReadonlyArray: 制作给定类型的不可变数组
- PicK: 从一个复合类型中，取出几个想要的类型组合
- Record:  从键类型到值类型的映射
- Required: 将对象中的所有属性设为必须
- ReturnYype: 获取函数类型的返回类型

## ts代码提示
先安装插件 jsdoc
```js
/**
 * 一个方法： 生成错误的提示信息
 *
 * @param {string} message {string} 提示信息
 * @param {(number | string)} code {number | string} 错误码
 * @param {(("demo1" | 'demo2'))} [type] type类型 请写`demo1`或者 `demo2`
 * @returns {string} 错误信息
 * 
 * [还不懂？请点击这里](www.baidu.com)
 * ```js
 * // demo
 * getErrorMessage('demo', 10086)
 * ```
 */
function getErrorMessage(message: string, code: number | string, type?:("demo1" | 'demo2')):string {
  return message || '网络异常' + code
}
```

## 参考链接
- (ts官网)[https://www.tslang.cn/docs/handbook/basic-types.html]
- (ts+vue3)[http://huaxhe.gitee.io/vue3_study_docs/chapter1/03_HelloWorld.html#%E7%B1%BB%E5%9E%8B%E6%B3%A8%E8%A7%A3]
- (深入理解ts)[https://jkchao.github.io/typescript-book-chinese/project/compilationContext.html#%E5%9F%BA%E7%A1%80]  
- (一份不可多得的 TS 学习指南)[https://juejin.cn/post/6872111128135073806#heading-90]   