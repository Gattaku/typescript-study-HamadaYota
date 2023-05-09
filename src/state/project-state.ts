import { Project, ProjectStatus } from "../models/project";

// Project State Management
import { v4 as uuidv4 } from "uuid"; //なぜかuuidが使えなかった。。原因突き止められず
type Listener<T> = (items: T[]) => void;

abstract class State<T> {
    protected listeners: Listener<T>[] = [];

    addListener(listenerFn: Listener<T>) {
        this.listeners.push(listenerFn);
    }
}


export class ProjectState extends State<Project> {
    private projects: Project[] = [];
    private static instance: ProjectState;

    private constructor() { //シングルトーンにする場合にプライベートのコンストラクターを生成。外からインスタンス生成ができないように！！
        super()
    }

    static getInstance() {
        if (this.instance) {
            return this.instance;
        }
        this.instance = new ProjectState();
        return this.instance;
    }



    addProject(title: string, description: string, manday: number) {
        const newProject = new Project(
            Math.random().toString(),
            // uuidv4(),
            title,
            description,
            manday,
            ProjectStatus.Active,
        )
        this.projects.push(newProject);
        this.updateListeners();
        // const x = uuidv4();
        // console.log(uuidv4());
    }

    moveProject(projectId: string, newStatus: ProjectStatus) {
        const project = this.projects.find(prj => prj.id === projectId);
        if (project && project.status !== newStatus) {
            project.status = newStatus;
            this.updateListeners();
        }
    }

    private updateListeners() {
        for (const listenerFn of this.listeners) {
            listenerFn(this.projects.slice()); //オリジナルを渡すと参照先を渡すため参照先で変更可能。そのため、あちこちで変更したくないときはコピーで渡す
        }
    }

}
export const projectState = ProjectState.getInstance(); //シングルトーン　アプリ内で１つのインスタンスしか存在しないことを保証
