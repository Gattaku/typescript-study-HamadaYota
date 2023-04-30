"use strict";
var _a;
const e1 = {
    name: "Max",
    privileges: ["create-server"],
    startDate: new Date(),
};
function add(a, b) {
    if (typeof a === "string" || typeof b === "string") {
        return a.toString() + b.toString();
    }
    return a + b;
}
function printEmployeeInfromation(emp) {
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
    loadCargo(amount) {
        console.log("荷物を載せています..." + amount);
    }
}
const v1 = new Car();
const v2 = new Truck();
function useVehicle(vehicle) {
    vehicle.drive();
    if (vehicle instanceof Truck) {
        vehicle.loadCargo(1000);
    }
}
useVehicle(v1);
useVehicle(v2);
function moveAnimal(animal) {
    let speed;
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
// const userInput = <HTMLInputElement>document.getElementById("input-element")!;
const userInput = document.getElementById("input-element");
userInput.value = "こんにちは";
const errorBag = {
    email: "正しいメールアドレスではありません",
    userName: "ユーザー名に記号を含めることはできません"
};
function add2(a, b) {
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
console.log((_a = fetchUserData === null || fetchUserData === void 0 ? void 0 : fetchUserData.job) === null || _a === void 0 ? void 0 : _a.title);
console.log(fetchUserData.job && fetchUserData.job.title);
//***************************************************:: */
// ◆ナリッシュコアリシン・・・null or undefinedだけを処理したいとき
//Ａ　？？　Ｂ　で書くと、　Ａがnull/undefiendの時のみＢを実行、それ以外はＡを実行
const userInputData = undefined;
const storeData = userInputData !== null && userInputData !== void 0 ? userInputData : "DEFAULT";
console.log(storeData);
