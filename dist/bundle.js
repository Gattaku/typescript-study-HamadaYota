var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define("components/base-components", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Compornent = void 0;
    // Compornent Class
    class Compornent {
        constructor(templateId, hostElementId, insertAtStart, newElementId) {
            this.templateElement = document.getElementById(templateId);
            this.hostElement = document.getElementById(hostElementId);
            const importedNode = document.importNode(this.templateElement.content, true);
            this.element = importedNode.firstElementChild;
            if (newElementId) {
                this.element.id = newElementId;
            }
            this.attach(insertAtStart);
        }
        attach(insertAtBeginning) {
            this.hostElement.insertAdjacentElement(insertAtBeginning ? "afterbegin" : "beforeend", this.element);
        }
    }
    exports.Compornent = Compornent;
});
define("util/validation", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.validate = void 0;
    function validate(validatableInput) {
        let isValid = true;
        if (validatableInput.required) {
            isValid = isValid && validatableInput.value.toString().trim().length !== 0;
        }
        if (validatableInput.minLength != null &&
            typeof validatableInput.value === "string") {
            isValid =
                isValid && validatableInput.value.length >= validatableInput.minLength;
        }
        if (validatableInput.maxLength != null &&
            typeof validatableInput.value === "string") {
            isValid =
                isValid && validatableInput.value.length <= validatableInput.maxLength;
        }
        if (validatableInput.min != null &&
            typeof validatableInput.value === "number") {
            isValid =
                isValid && validatableInput.value >= validatableInput.min;
        }
        if (validatableInput.max != null &&
            typeof validatableInput.value === "number") {
            isValid =
                isValid && validatableInput.value <= validatableInput.max;
        }
        return isValid;
    }
    exports.validate = validate;
});
define("decorators/autobind", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.autobind = void 0;
    // autobind decorator
    function autobind(_, _2, descriptor) {
        const originalMethod = descriptor.value;
        const adjDescriptor = {
            configurable: true,
            get() {
                const boundFn = originalMethod.bind(this);
                return boundFn;
            }
        };
        return adjDescriptor;
    }
    exports.autobind = autobind;
});
define("models/project", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Project = exports.ProjectStatus = void 0;
    // Project Type
    var ProjectStatus;
    (function (ProjectStatus) {
        ProjectStatus[ProjectStatus["Active"] = 0] = "Active";
        ProjectStatus[ProjectStatus["Finished"] = 1] = "Finished";
    })(ProjectStatus = exports.ProjectStatus || (exports.ProjectStatus = {}));
    class Project {
        constructor(id, title, description, manday, status) {
            this.id = id;
            this.title = title;
            this.description = description;
            this.manday = manday;
            this.status = status;
        }
    }
    exports.Project = Project;
});
define("state/project-state", ["require", "exports", "models/project"], function (require, exports, project_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.projectState = exports.ProjectState = void 0;
    class State {
        constructor() {
            this.listeners = [];
        }
        addListener(listenerFn) {
            this.listeners.push(listenerFn);
        }
    }
    class ProjectState extends State {
        constructor() {
            super();
            this.projects = [];
        }
        static getInstance() {
            if (this.instance) {
                return this.instance;
            }
            this.instance = new ProjectState();
            return this.instance;
        }
        addProject(title, description, manday) {
            const newProject = new project_js_1.Project(Math.random().toString(), title, description, manday, project_js_1.ProjectStatus.Active);
            this.projects.push(newProject);
            this.updateListeners();
        }
        moveProject(projectId, newStatus) {
            const project = this.projects.find(prj => prj.id === projectId);
            if (project && project.status !== newStatus) {
                project.status = newStatus;
                this.updateListeners();
            }
        }
        updateListeners() {
            for (const listenerFn of this.listeners) {
                listenerFn(this.projects.slice()); //オリジナルを渡すと参照先を渡すため参照先で変更可能。そのため、あちこちで変更したくないときはコピーで渡す
            }
        }
    }
    exports.ProjectState = ProjectState;
    exports.projectState = ProjectState.getInstance(); //シングルトーン　アプリ内で１つのインスタンスしか存在しないことを保証
});
define("components/project-input", ["require", "exports", "components/base-components", "util/validation", "decorators/autobind", "state/project-state"], function (require, exports, base_components_js_1, validation_js_1, autobind_js_1, project_state_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ProjectInput = void 0;
    // ProjectInput Class
    class ProjectInput extends base_components_js_1.Compornent {
        constructor() {
            super("project-input", "app", true, "user-input");
            this.titleInputElement = this.element.querySelector("#title");
            this.descriptionInputElement = this.element.querySelector("#description");
            this.mandayInputElement = this.element.querySelector("#manday");
            this.configure();
        }
        configure() {
            // this.element.addEventListener("submit", this.submitHandler.bind(this)); bindメソッドで、submitHndler側のthisもこのクラスのオブジェクトを指すことを明示的に示す。他のやり方はデコレーターを使う
            this.element.addEventListener("submit", this.submitHandler);
        }
        renderContent() { }
        gatherUserInput() {
            const enteredTitle = this.titleInputElement.value;
            const enteredDescription = this.descriptionInputElement.value;
            const enteredManday = this.mandayInputElement.value;
            const titleValidatable = {
                value: enteredTitle,
                required: true,
            };
            const descriptionValidatable = {
                value: enteredDescription,
                required: true,
                minLength: 5,
            };
            const mandayValidatable = {
                value: parseFloat(enteredManday),
                required: true,
                min: 1,
                max: 1000,
            };
            if ( // validationを設定する方法
            // enteredTitle.trim().length === 0 ||
            // enteredDescription.trim().length === 0 ||
            // enteredManday.trim().length === 0
            !(0, validation_js_1.validate)(titleValidatable) ||
                !(0, validation_js_1.validate)(descriptionValidatable) ||
                !(0, validation_js_1.validate)(mandayValidatable)) {
                alert("入力値が正しくありません。再度お試しください");
            }
            else {
                return [enteredTitle, enteredDescription, parseFloat(enteredManday)];
            }
        }
        clearInputs() {
            this.titleInputElement.value = "";
            this.descriptionInputElement.value = "";
            this.mandayInputElement.value = "";
        }
        submitHandler(event) {
            event.preventDefault();
            const userInput = this.gatherUserInput();
            if (Array.isArray(userInput)) {
                const [title, desc, manday] = userInput;
                project_state_js_1.projectState.addProject(title, desc, manday);
                // console.log(title, desc, manday);
                this.clearInputs();
            }
        }
    }
    __decorate([
        autobind_js_1.autobind
    ], ProjectInput.prototype, "submitHandler", null);
    exports.ProjectInput = ProjectInput;
});
define("models/drag-drop", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("components/project-item", ["require", "exports", "components/base-components", "decorators/autobind"], function (require, exports, base_components_js_2, autobind_js_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ProjectItem = void 0;
    // ProjectItem Class
    class ProjectItem extends base_components_js_2.Compornent {
        get manday() {
            if (this.project.manday < 20) {
                return `${this.project.manday.toString()}人日`;
            }
            else {
                return `${(this.project.manday / 20).toString()}人月`;
            }
        }
        constructor(hostId, project) {
            super("single-project", hostId, false, project.id);
            this.project = project;
            this.configure();
            this.renderContent();
        }
        dragStartHandler(event) {
            event.dataTransfer.setData("text/plain", this.project.id);
            event.dataTransfer.effectAllowed = "move";
        }
        dragEndHandler(_) {
            console.log("Drag終了");
        }
        configure() {
            this.element.addEventListener("dragstart", this.dragStartHandler);
            this.element.addEventListener("dragend", this.dragEndHandler);
        }
        renderContent() {
            this.element.querySelector("h2").textContent = this.project.title;
            this.element.querySelector("h3").textContent = this.manday; //getter, setterはプロパティーのようにふるまうので、関数演算子の()は不要
            this.element.querySelector("p").textContent = this.project.description;
        }
    }
    __decorate([
        autobind_js_2.autobind
    ], ProjectItem.prototype, "dragStartHandler", null);
    __decorate([
        autobind_js_2.autobind
    ], ProjectItem.prototype, "dragEndHandler", null);
    exports.ProjectItem = ProjectItem;
});
define("components/project-list", ["require", "exports", "components/base-components", "components/project-item", "models/project", "decorators/autobind", "state/project-state"], function (require, exports, base_components_js_3, project_item_js_1, project_js_2, autobind_js_3, project_state_js_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ProjectList = void 0;
    // ProjectList Class
    class ProjectList extends base_components_js_3.Compornent {
        constructor(type) {
            super("project-list", "app", false, `${type}-projects`);
            this.type = type;
            this.assignedProjects = [];
            this.configure();
            this.renderContent();
        }
        dragOverHandler(event) {
            if (event.dataTransfer && event.dataTransfer.types[0] === "text/plain") {
                event.preventDefault(); //これをしないと、ドロップイベントが発生しない。addEventListenerで監視できない
                const listEl = this.element.querySelector("ul");
                listEl.classList.add("droppable");
            }
        }
        dropHandler(event) {
            const prjId = event.dataTransfer.getData("text/plain");
            project_state_js_2.projectState.moveProject(prjId, this.type === "active" ?
                project_js_2.ProjectStatus.Active
                :
                    project_js_2.ProjectStatus.Finished);
        }
        dragLeaveHandler(_) {
            const listEl = this.element.querySelector("ul");
            listEl.classList.remove("droppable");
        }
        configure() {
            this.element.addEventListener("dragover", this.dragOverHandler);
            this.element.addEventListener("drop", this.dropHandler);
            this.element.addEventListener("dragleave", this.dragLeaveHandler);
            project_state_js_2.projectState.addListener((projects) => {
                const relevantProjects = projects.filter((prj) => {
                    if (this.type === "active") {
                        return prj.status === project_js_2.ProjectStatus.Active;
                    }
                    return prj.status === project_js_2.ProjectStatus.Finished;
                });
                this.assignedProjects = relevantProjects;
                this.renderProjects();
            });
        }
        renderContent() {
            const listId = `${this.type}-projects-list`;
            this.element.querySelector("ul").id = listId;
            this.element.querySelector("h2").textContent =
                this.type === "active" ? "実行中プロジェクト" : "完了プロジェクト";
        }
        renderProjects() {
            const listEl = document.getElementById(`${this.type}-projects-list`);
            listEl.innerHTML = "";
            for (const pjtItem of this.assignedProjects) {
                new project_item_js_1.ProjectItem(listEl.id, pjtItem);
            }
        }
    }
    __decorate([
        autobind_js_3.autobind
    ], ProjectList.prototype, "dragOverHandler", null);
    __decorate([
        autobind_js_3.autobind
    ], ProjectList.prototype, "dropHandler", null);
    __decorate([
        autobind_js_3.autobind
    ], ProjectList.prototype, "dragLeaveHandler", null);
    exports.ProjectList = ProjectList;
});
define("drag_and_drop_app", ["require", "exports", "components/project-input", "components/project-list"], function (require, exports, project_input_js_1, project_list_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    // import { Draggable, DragTarget } from "./models/drag-drop.js"
    // Drag & Drop
    // interface Draggable {
    //     dragStartHandler(event: DragEvent): void;
    //     dragEndHandler(event: DragEvent): void;
    // }
    // interface DragTarget {
    //     dragOverHandler(event: DragEvent): void;
    //     dropHandler(event: DragEvent): void;
    //     dragLeaveHandler(event: DragEvent): void;
    // }
    const prjInput = new project_input_js_1.ProjectInput();
    const activePjtList = new project_list_js_1.ProjectList("active");
    const finishedPjtList = new project_list_js_1.ProjectList("finished");
});
//# sourceMappingURL=bundle.js.map