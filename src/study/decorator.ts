// function Logger(constructor: Function) { //クラスに対するデコレーターは１つの引数が必要
//     console.log("ログ出力中...");
//     console.log(constructor);
// }

//上記のデコレーター関数をデコレーターファクトリとして宣言
//factory化することで、デコレーター関数内に任意の引数を渡せる
function Logger(decoratorArg: string) {
    return function (constructor: Function) {
        console.log(decoratorArg);
        console.log(constructor);
    }

}

function WithTemplate(template: string, hookId: string) {
    return function (constructor: any) {
        const hookEl = document.getElementById(hookId);
        const p = new constructor()
        if (hookEl) {
            hookEl.innerHTML = template;
            hookEl.querySelector("h1")!.textContent = p.name;
            console.log("WithTemplateで作成中...")
        }
    }
}


@Logger("ログ出力中　―　Personクラス")
@WithTemplate("<h1>デコレーター使用中</h1>", "decorator")
class Person {
    name = "Max";

    constructor() {
        console.log("Personオブジェクトを作成中...");
    }
}

const pers = new Person();
console.log(pers);


// .....

function Log(target: any, propertyName: string | Symbol) {
    console.log("propertyデコレーター");
    console.log(target, propertyName);
}

//アクセサのデコレーター
function Log2(target: any, name: string | Symbol, descriptor: PropertyDescriptor) {
    console.log("Accessor デコレーター");
    console.log(target);
    console.log(name);
    console.log(descriptor);
}

function Log3(target: any, name: string | Symbol, descriptor: PropertyDescriptor) {
    console.log("Method デコレーター");
    console.log(target);
    console.log(name);
    console.log(descriptor);
}

function Log4(target: any, name: string | Symbol, position: number) {
    console.log("Parameter デコレーター");
    console.log(target);
    console.log(name);
    console.log(position);
}

class Product {

    @Log
    title: string;
    private _price: number;

    @Log2
    set price(val: number) {
        if (val > 0) {
            this._price = val;
        } else {
            throw new Error("不正な価格です。０以下の数字は設定できません。")
        }
    }

    constructor(t: string, p: number) {
        this.title = t;
        this._price = p;
    }

    @Log3
    getPriceWithTax(@Log4 tax: number) {
        return this._price * (1 + tax);
    }
}

//Autobindデコレーター自作
function Autobind(_: any, _2: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    const adjDescriptor: PropertyDescriptor = {
        configurable: true,
        // enumerable: false,
        get() {
            const boundFn = originalMethod.bind(this);
            return boundFn;
        }
    }
    return adjDescriptor;
}

class Message {
    message = "クリックされました";

    @Autobind
    showMessage() {
        console.log(this.message);
    }
}

// const p = new Message();
// const button = document.querySelector("button")!;
// button.addEventListener("click", p.showMessage);


// ----

// const validateCourse = (title: string, price: number): boolean => {
//     if (title.trim().length > 0 && price > 0) {
//         return true;
//     }
//     return false;
// }

interface ValidatorConfig {
    [prop: string]: {
        [validatableProp: string]: string[]
    }
}

const registeredValidators: ValidatorConfig = {};
function RequiredCourse(target: any, propName: string) {
    registeredValidators[target.constructor.name] = {
        ...registeredValidators[target.constructor.name],
        [propName]: ["required"],
    }
}

function PositiveNumber(target: any, propName: string) {
    registeredValidators[target.constructor.name] = {
        ...registeredValidators[target.constructor.name],
        [propName]: ["positive"],
    }
}

function validateCourse(obj: any) {
    const objValidatorConfig = registeredValidators[obj.constructor.name];
    if (!objValidatorConfig) {
        return true;
    }
    let isValid = true;
    for (const prop in objValidatorConfig) {
        for (const validator of objValidatorConfig[prop]) {
            switch (validator) {
                case "required":
                    isValid = isValid && !!obj[prop];
                    break;
                case "positive":
                    isValid = isValid && obj[prop] > 0;
                    break;
            }
        }
    }
    return isValid;
}




class Course {
    @RequiredCourse
    title: string;
    @PositiveNumber
    price: number;

    constructor(t: string, p: number) {
        this.title = t;
        this.price = p;
    }
}

// const courseForm = document.querySelector("form")!;
// courseForm.addEventListener("submit", (event) => {
//     event.preventDefault();
//     const titleEl = document.getElementById("title") as HTMLInputElement;
//     const priceEl = document.getElementById("price") as HTMLInputElement;

//     const title = titleEl.value;
//     const price = +priceEl.value;

//     // const validateResult = validateCourse(title, price);
//     // if (validateResult) {
//     const createdCourse = new Course(title, price);
//     if (!validateCourse(createdCourse)) {
//         alert("入力が正しくありません");
//     } else {
//         console.log(createdCourse);
//     }


//     // } else {
//     //     console.log("入力が正しくありません");
//     // }
// })