//***************************************************:: */
// ◆交差型
// ・＆を使用することで、
// 　Objectの場合はどちらかに存在するプロパティを設定できる
// 　stringやNumbgerの場合は、両方に存在するもののみを許容する。
// ・typeで書く場合は「&」だが、interfaceで書く場合は、extendsで複数指定する
type Admin = {
    name: string;
    privileges: string[];
}
type Employee = {
    name: string;
    startDate: Date;
}
// interface ElevatedeEmployee extends Admin, Employee { }
type ElevatedeEmployee = Admin & Employee;
const e1: ElevatedeEmployee = {
    name: "Max",
    privileges: ["create-server"],
    startDate: new Date(),
}
// console.log(e1.name);
//***************************************************:: */

// ◆型ガード
// ・複数の型を取りえる場合は、どちらかにしかないメソッドやプロパティーは自動補完できない。
// 　そのような場合は、型を条件分岐してあげることで型を保証する。そうすると自動補完できる

type Combinable = string | number;
type Numeric = number | boolean;
type Universal = Combinable & Numeric;

function add(a: Combinable, b: Combinable) {
    if (typeof a === "string" || typeof b === "string") {
        return a.toString() + b.toString();
    }
    return a + b;
}

// どちらの型のデータが入っているかわからないときの型ガードの仕方は
// ①　key in 変数
// ②　変数　instanceof クラス **これはクラス生成のみに使用できる。interfaceには不可

type UnknownEmployee = Employee | Admin;

function printEmployeeInfromation(emp: UnknownEmployee) {
    console.log(emp.name);
    if ("privileges" in emp) {
        console.log("startDate:" + emp.privileges);
    }
    if ("startDate" in emp) {
        console.log("startDate:" + emp.startDate);
    }
}
// printEmployeeInfromation(e1);

class Car {
    drive() {
        console.log("運転中...");
    }
}

class Truck {
    drive() {
        console.log("トラックを運転中...");
    }
    loadCargo(amount: number) {
        console.log("荷物を載せています..." + amount);
    }
}

type Vehicle = Car | Truck;
const v1 = new Car();
const v2 = new Truck();

function useVehicle(vehicle: Vehicle) {
    vehicle.drive();
    if (vehicle instanceof Truck) {
        vehicle.loadCargo(1000);
    }
}
useVehicle(v1);
useVehicle(v2);

//***************************************************:: */

// ◆判別可能なUnion型
// ・interfaceの際は、「変数 instanceof クラス名」で型ガードができない。
// 　その際は、interfaceに同じプロパティーをリテラル型で定義して、switch文を用いて条件分岐する

interface Bird {
    type: "bird";
    flyingSpeed: number;
}
interface Horse {
    type: "horse";
    runningSpeed: number;
}

type Animal = Bird | Horse;

function moveAnimal(animal: Animal) {
    let speed: number;
    switch (animal.type) {
        case "bird":
            speed = animal.flyingSpeed;
            break;
        case "horse":
            speed = animal.runningSpeed;
            break;
        // default:
        //     break;
    }
    console.log(`移動速度：${speed}`);
}
moveAnimal({ type: "bird", flyingSpeed: 10 });

//***************************************************:: */
// ◆型ｷｬｽﾄ
// ①取得するDOMの前に＜＞で書く
// ②後ろに「as タグ名」で書く
// どちらも同じ。
// また、「!」は必ずNullでないことをUserが保証する場合に使用。
// その際、Nullでない認識で進む。
// もしくは、型ガードを書く。

// // const userInput = <HTMLInputElement>document.getElementById("input-element")!;
// const userInput = document.getElementById("input-element")! as HTMLInputElement;
// userInput.value = "こんにちは";

// const userInput = document.getElementById("input-element");
// if (userInput) {
//     (userInput as HTMLInputElement).value = "こんにちは";
// }
//******************************************************************** */

//***************************************************:: */
// ◆インデックス型
// 何個、どんなプロパティが存在するかわかっていないが、型がわかっている場合に使用できる。
// ①キーは[prop: string]が示すようにstringで判別できないといけない。
// ②型をstringにすると、すべてのキーの値はstringでないといけない制約を受ける

interface ErrorContainer {
    [prop: string]: string;
}

const errorBag: ErrorContainer = {
    email: "正しいメールアドレスではありません",
    userName: "ユーザー名に記号を含めることはできません"
}

//***************************************************:: */
// ◆関数オーバーロード・・・１つの関数に対して複数の関数シグネチャーを定義できる
// 引数の組み合わせに対しての返り値の型を明示的に示せる。
// 書き方は、実際の関数の上に記載。この際は｛｝は不要

type Combinable2 = string | number;

function add2(a: number, b: number): number;
function add2(a: string, b: string): string;
function add2(a: number, b: string): string;
function add2(a: string, b: number): string;
function add2(a: Combinable2, b: Combinable2) {
    if (typeof a === "string" || typeof b === "string") {
        return a.toString() + b.toString();
    }
    return a + b;
}
const result = add2("hello", "TypeScript");
result.split(" ");

//***************************************************:: */
// ◆オプショナルチェーン
// APIなどでバックエンドからデータを取得してきた場合にJobが入ってるかわからない時、
// 　？でもしもあった場合のみ実行することができる。生JSではその下の行のように＆＆で書くこともできる
const fetchUserData = {
    id: "u1",
    name: "user1",
    job: {
        title: "Developer",
        description: "TypeScript",
    },
};
console.log(fetchUserData?.job?.title);
console.log(fetchUserData.job && fetchUserData.job.title);

//***************************************************:: */
// ◆ナリッシュコアリシン・・・null or undefinedだけを処理したいとき
//Ａ　？？　Ｂ　で書くと、　Ａがnull/undefiendの時のみＢを実行、それ以外はＡを実行

const userInputData = undefined;
const storeData = userInputData ?? "DEFAULT";
console.log(storeData);