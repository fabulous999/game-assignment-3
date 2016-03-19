module objects {
    // MouseControls Class +++++++++++++++
    export class MouseControls {
        // PUBLIC INSTANCE VARIABLES +++++++++
        public sensitivity: number;
        public yaw: number; // look left and right - y-axis
        public pitch: number; // look up and down - x-axis
        public enabled: boolean;
//public sensentivity : number; public yaw : number; pitch : number;enable : number;    
        // CONSTRUCTOR +++++++++++++++++++++++
        constructor() {
            this.enabled = false;
            this.sensitivity = 0.1;
            this.yaw = 0;
            this.pitch = 0;
            
            document.addEventListener('mousemove', this.OnMouseMove.bind(this), false);
        }
     //  this.sensentivity = 0.1; public yaw : number; pitch : number;enable : number;    
                 public OnMouseMove(event: MouseEvent):void {
            this.yaw = -event.movementX * this.sensitivity;
            
            this.pitch = -event.movementY * this.sensitivity * 0.1;
        }
        }
    }
