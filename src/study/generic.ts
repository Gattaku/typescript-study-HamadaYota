//***************************************************:: */
// ◆generic関数の作成
// generic関数を使用しなかった場合、引数、戻り値の正しい型がTypeScriptは把握できず、
//  その中のプロパティーやメソッドにアクセスすることができない。
//  そのため、<>を使用して、型に制約をつける。また、extendsをつけることで、より冗長的に書ける

function merge<T extends object, U extends object>(objA: T, objB: U) {
    return Object.assign(objA, objB);
}

const mergedObj = merge({ name: "Max" }, { age: 30 });
console.log(mergedObj.age);

interface Lengty {
    length: number;
}

function countAndDescribe<T extends Lengty>(elm: T): [T, string] {
    let descriptionText = "値がありません";
    if (elm.length > 0) {
        descriptionText = `値は${elm.length}個です。`;
    }
    return [elm, descriptionText];
}
// console.log(countAndDescribe("こんにちは！"));

console.log(countAndDescribe("お疲れ様です。"));
// console.log(countAndDescribe(10));

//***************************************************:: */
// ◆keyofの制約
// 第１引数のオブジェクトに対して、第２引数のキーを取ってきたいときに、
// そもそも、第二引数の文字列をプロパティーに持っているかはわからない。
// その際に、型として持っていないといけないという制約を下記のようにつけることができる

function extractAndConvert<T extends object, U extends keyof T>(
    obj: T,
    key: U,
) {
    return `Value:${obj[key]}`;
}
extractAndConvert({ name: "max" }, "name");

//***************************************************:: */
// ◆genericクラス
// numberやstringなどに制約を設けずに、あるインスタンスの時はstring、あるインスタンスの時はnumber
// のように汎用性の効くクラスを作成する際に便利。あくまで、ジェネリック型のTが引き継がれていく

class DataStorage<T extends string | number | boolean> {
    private data: T[] = [];

    addItem(item: T) {
        this.data.push(item);
    }
    removeItem(item: T) {
        if (this.data.indexOf(item) === -1) {
            return;
        }
        this.data.splice(this.data.indexOf(item), 1);
    }
    getItems() {
        return [...this.data];
    }
}
const textStorage = new DataStorage<string>();
textStorage.addItem("Data1");
textStorage.addItem("Data2");
textStorage.addItem("Data3");
textStorage.removeItem("Data2");
console.log(textStorage.getItems());

const numberStorage = new DataStorage<number>();
numberStorage.addItem(1);
numberStorage.addItem(2);
numberStorage.addItem(3);
console.log(numberStorage.getItems());

const numberTextStorage = new DataStorage<number | string>();
numberTextStorage.addItem(10);
numberTextStorage.addItem("hello");
numberTextStorage.addItem("5");
console.log(numberTextStorage.getItems());


interface CouserGoal {
    title: string;
    description: string;
    completeUntile: Date;
}

// function createCourseGoal(
//     title: string,
//     description: string,
//     date: Date,
// ): CouserGoal {
//     return {
//         title: title,
//         description: description,
//         completeUntile: date,
//     }
// }

function createCourseGoal(
    title: string,
    description: string,
    date: Date,
): CouserGoal {
    let couserGoal: Partial<CouserGoal> = {};
    couserGoal.title = title;
    couserGoal.description = description;
    couserGoal.completeUntile = date;
    return couserGoal as CouserGoal;
}

const names: Readonly<string[]> = ["Max", "Anna"];
// names.push("Manu");