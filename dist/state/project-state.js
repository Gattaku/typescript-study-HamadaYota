import { Project, ProjectStatus } from "../models/project.js";
class State {
    constructor() {
        this.listeners = [];
    }
    addListener(listenerFn) {
        this.listeners.push(listenerFn);
    }
}
export class ProjectState extends State {
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
        const newProject = new Project(Math.random().toString(), 
        // uuidv4(),
        title, description, manday, ProjectStatus.Active);
        this.projects.push(newProject);
        this.updateListeners();
        // const x = uuidv4();
        // console.log(uuidv4());
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
export const projectState = ProjectState.getInstance(); //シングルトーン　アプリ内で１つのインスタンスしか存在しないことを保証
//# sourceMappingURL=project-state.js.map