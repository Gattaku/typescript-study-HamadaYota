import { Compornent } from "./base-components";
import { Validatable, validate } from "../util/validation";
import { autobind } from "../decorators/autobind";
import { projectState } from "../state/project-state";

// ProjectInput Class
export class ProjectInput extends Compornent<HTMLDivElement, HTMLFormElement>{
    titleInputElement: HTMLInputElement;
    descriptionInputElement: HTMLInputElement;
    mandayInputElement: HTMLInputElement;

    constructor() {
        super("project-input", "app", true, "user-input");

        this.titleInputElement = this.element.querySelector("#title") as HTMLInputElement;
        this.descriptionInputElement = this.element.querySelector("#description") as HTMLInputElement;
        this.mandayInputElement = this.element.querySelector("#manday") as HTMLInputElement;

        this.configure();
    }

    configure() {
        // this.element.addEventListener("submit", this.submitHandler.bind(this)); bindメソッドで、submitHndler側のthisもこのクラスのオブジェクトを指すことを明示的に示す。他のやり方はデコレーターを使う
        this.element.addEventListener("submit", this.submitHandler);
    }

    renderContent() { }

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
            projectState.addProject(title, desc, manday);
            // console.log(title, desc, manday);
            this.clearInputs();
        }
    }


}