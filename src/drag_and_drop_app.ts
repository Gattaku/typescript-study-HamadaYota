// validation
interface Validatable {
    value: string | number;
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
}
function validate(validatableInput: Validatable) {
    let isValid = true;
    if (validatableInput.required) {
        isValid = isValid && validatableInput.value.toString().trim().length !== 0;
    }
    if (validatableInput.minLength != null &&
        typeof validatableInput.value === "string"
    ) {
        isValid =
            isValid && validatableInput.value.length >= validatableInput.minLength;
    }
    if (validatableInput.maxLength != null &&
        typeof validatableInput.value === "string"
    ) {
        isValid =
            isValid && validatableInput.value.length <= validatableInput.maxLength;
    }
    if (validatableInput.min != null &&
        typeof validatableInput.value === "number"
    ) {
        isValid =
            isValid && validatableInput.value >= validatableInput.min;
    }
    if (validatableInput.max != null &&
        typeof validatableInput.value === "number"
    ) {
        isValid =
            isValid && validatableInput.value <= validatableInput.max;
    }
    return isValid;
}

// autobind decorator
function autobind(
    target: any,
    methodName: string,
    descriptor: PropertyDescriptor
) {
    const originalMethod = descriptor.value;
    const adjDescriptor: PropertyDescriptor = {
        configurable: true, //propertyを変更できるようにするため
        get() {
            const boundFn = originalMethod.bind(this);
            return boundFn;
        }
    }
    return adjDescriptor;
}


class ProjectInput {
    templateElement: HTMLTemplateElement;
    hostElement: HTMLDivElement;
    element: HTMLFormElement;
    titleInputElement: HTMLInputElement;
    descriptionInputElement: HTMLInputElement;
    mandayInputElement: HTMLInputElement;

    constructor() {
        this.templateElement = document.getElementById("project-input")! as HTMLTemplateElement;
        this.hostElement = document.getElementById("app")! as HTMLDivElement;

        const importedNode = document.importNode(this.templateElement.content, true);
        this.element = importedNode.firstElementChild as HTMLFormElement;
        this.element.id = "user-input";

        this.titleInputElement = this.element.querySelector("#title") as HTMLInputElement;
        this.descriptionInputElement = this.element.querySelector("#description") as HTMLInputElement;
        this.mandayInputElement = this.element.querySelector("#manday") as HTMLInputElement;

        this.configure();
        this.attach();
    }

    private gatherUserInput(): [string, string, number] | void { //union型でvoid型を入れることでalartのようにタプルを返さない条件分岐もOKにする。
        const enteredTitle = this.titleInputElement.value;
        const enteredDescription = this.descriptionInputElement.value;
        const enteredManday = this.mandayInputElement.value;

        const titleValidatable: Validatable = {
            value: enteredTitle,
            required: true,
        }
        const descriptionValidatable: Validatable = {
            value: enteredDescription,
            required: true,
            minLength: 5,
        }
        const mandayValidatable: Validatable = {
            value: parseFloat(enteredManday),
            required: true,
            min: 1,
            max: 1000,
        }

        if ( // validationを設定する方法
            // enteredTitle.trim().length === 0 ||
            // enteredDescription.trim().length === 0 ||
            // enteredManday.trim().length === 0
            !validate(titleValidatable) ||
            !validate(descriptionValidatable) ||
            !validate(mandayValidatable)
        ) {
            alert("入力値が正しくありません。再度お試しください");
        } else {
            return [enteredTitle, enteredDescription, parseFloat(enteredManday)];
        }
    }

    private clearInputs() {
        this.titleInputElement.value = "";
        this.descriptionInputElement.value = "";
        this.mandayInputElement.value = "";
    }

    @autobind
    private submitHandler(event: Event) {
        event.preventDefault();
        const userInput = this.gatherUserInput();
        if (Array.isArray(userInput)) {
            const [title, desc, manday] = userInput;
            console.log(title, desc, manday);
            this.clearInputs();
        }
    }

    private configure() {
        // this.element.addEventListener("submit", this.submitHandler.bind(this)); bindメソッドで、submitHndler側のthisもこのクラスのオブジェクトを指すことを明示的に示す。他のやり方はデコレーターを使う
        this.element.addEventListener("submit", this.submitHandler);
    }

    private attach() {
        this.hostElement.insertAdjacentElement("afterbegin", this.element);
    }
}
const prjInput = new ProjectInput();
