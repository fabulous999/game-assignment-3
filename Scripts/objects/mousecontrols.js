var objects;
(function (objects) {
    // MouseControls Class +++++++++++++++
    var MouseControls = (function () {
        //public sensentivity : number; public yaw : number; pitch : number;enable : number;    
        // CONSTRUCTOR +++++++++++++++++++++++
        function MouseControls() {
            this.enabled = false;
            this.sensitivity = 0.1;
            this.yaw = 0;
            this.pitch = 0;
            document.addEventListener('mousemove', this.OnMouseMove.bind(this), false);
        }
        //  this.sensentivity = 0.1; public yaw : number; pitch : number;enable : number;    
        MouseControls.prototype.OnMouseMove = function (event) {
            this.yaw = -event.movementX * this.sensitivity;
            this.pitch = -event.movementY * this.sensitivity * 0.1;
        };
        return MouseControls;
    }());
    objects.MouseControls = MouseControls;
})(objects || (objects = {}));
//# sourceMappingURL=mousecontrols.js.map