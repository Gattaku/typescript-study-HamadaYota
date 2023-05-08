namespace App {
    // ProjectItem Class
    export class ProjectItem extends Compornent<HTMLUListElement, HTMLLIElement>
        implements Draggable { // implements : Draggableの「型を持つことを約束する」という意味
        private project: Project;

        get manday() {
            if (this.project.manday < 20) {
                return `${this.project.manday.toString()}人日`
            } else {
                return `${(this.project.manday / 20).toString()}人月`
            }
        }

        constructor(hostId: string, project: Project) {
            super("single-project", hostId, false, project.id);
            this.project = project;

            this.configure();
            this.renderContent();
        }

        @autobind
        dragStartHandler(event: DragEvent) {
            event.dataTransfer!.setData("text/plain", this.project.id);
            event.dataTransfer!.effectAllowed = "move";
        }

        @autobind
        dragEndHandler(_: DragEvent) {
            console.log("Drag終了");
        }

        configure() {
            this.element.addEventListener("dragstart", this.dragStartHandler);
            this.element.addEventListener("dragend", this.dragEndHandler);
        }
        renderContent() {
            this.element.querySelector("h2")!.textContent = this.project.title;
            this.element.querySelector("h3")!.textContent = this.manday; //getter, setterはプロパティーのようにふるまうので、関数演算子の()は不要
            this.element.querySelector("p")!.textContent = this.project.description;
        }
    }

}