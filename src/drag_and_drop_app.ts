// import { Draggable, DragTarget } from "./models/drag-drop.js"

/// <reference path="./models/drag-drop.ts" />
/// <reference path="./models/project.ts" />
/// <reference path="./state/project-state.ts" />
/// <reference path="./util/validation.ts" />
/// <reference path="./decorators/autobind.ts" />
/// <reference path="./components/base-components.ts" />
/// <reference path="./components/project-input.ts" />
/// <reference path="./components/project-item.ts" />
/// <reference path="./components/project-list.ts" />

namespace App {

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


    const prjInput = new ProjectInput();
    const activePjtList = new ProjectList("active");
    const finishedPjtList = new ProjectList("finished");

}