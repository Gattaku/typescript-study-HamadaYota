import { ProjectInput } from "./components/project-input";
import { ProjectList } from "./components/project-list";

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

const prjInput = new ProjectInput();
const activePjtList = new ProjectList("active");
const finishedPjtList = new ProjectList("finished");
