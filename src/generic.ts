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

console.log(countAndDescribe("お疲れ様です。"));
// console.log(countAndDescribe(10));