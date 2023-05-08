import { DragTarget } from "../models/drag-drop.js";
import { Compornent } from "./base-components.js";
import { ProjectItem } from "./project-item.js";
import { Project, ProjectStatus } from "../models/project.js";
import { autobind } from "../decorators/autobind.js";
import { projectState } from "../state/project-state.js";

// ProjectList Class
export class ProjectList extends Compornent<HTMLDivElement, HTMLElement>
    implements DragTarget {
    assignedProjects: Project[];

    constructor(private type: "active" | "finished") {
        super("project-list", "app", false, `${type}-projects`)
        this.assignedProjects = [];

        this.configure();
        this.renderContent();
    }

    @autobind
    dragOverHandler(event: DragEvent) {
        if (event.dataTransfer && event.dataTransfer.types[0] === "text/plain") {
            event.preventDefault(); //これをしないと、ドロップイベントが発生しない。addEventListenerで監視できない
            const listEl = this.element.querySelector("ul")!;
            listEl.classList.add("droppable");

        }
    }

    @autobind
    dropHandler(event: DragEvent) {
        const prjId = event.dataTransfer!.getData("text/plain");
        projectState.moveProject(
            prjId, this.type === "active" ?
            ProjectStatus.Active
            :
            ProjectStatus.Finished)
    }

    @autobind
    dragLeaveHandler(_: DragEvent) {
        const listEl = this.element.querySelector("ul")!;
        listEl.classList.remove("droppable");
    }

    configure() {
        this.element.addEventListener("dragover", this.dragOverHandler);
        this.element.addEventListener("drop", this.dropHandler);
        this.element.addEventListener("dragleave", this.dragLeaveHandler);

        projectState.addListener((projects: Project[]) => {
            const relevantProjects = projects.filter((prj) => {
                if (this.type === "active") {
                    return prj.status === ProjectStatus.Active;
                }
                return prj.status === ProjectStatus.Finished;
            })
            this.assignedProjects = relevantProjects;
            this.renderProjects();
        })
    }

    renderContent() {
        const listId = `${this.type}-projects-list`;
        this.element.querySelector("ul")!.id = listId;
        this.element.querySelector("h2")!.textContent =
            this.type === "active" ? "実行中プロジェクト" : "完了プロジェクト";
    }

    private renderProjects() {
        const listEl = document.getElementById(`${this.type}-projects-list`)! as HTMLUListElement;
        listEl.innerHTML = "";
        for (const pjtItem of this.assignedProjects) {
            new ProjectItem(listEl.id, pjtItem);
        }
    }
}