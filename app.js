class Slider {

    constructor({ container, slider_options }) {
        this.container = document.querySelector(container);
        this.slider_options = slider_options

        this.svg_height = 500;
        this.svg_width = 500;
        this.centerX = this.svg_width / 2;          // Center of svg element
        this.centerY = this.svg_height / 2;         
        this.ns = "http://www.w3.org/2000/svg";     
        this.point_size = 14;                       // Size of the slider point
        this.isMouseDown = false;                   // Is mouse clicked
    }

    draw() {
        this.createLegend();

        // Svg container div
        let svg_container = document.createElement("div");
        svg_container.classList.add("svg_container");
        svg_container.setAttribute("data-svg-holder", true);
        // Svg holder
        let svg_holder = document.createElementNS(this.ns, "svg");
        svg_holder.setAttribute("style", "border: 1px solid black")
        svg_holder.setAttribute("width", this.svg_width);
        svg_holder.setAttribute("height", this.svg_width);
        svg_container.appendChild(svg_holder);
        this.container.appendChild(svg_container);

        // Draw sliders
        this.slider_options.forEach((slider_opt, index) => {
            this.drawSlider(slider_opt, index, svg_holder);
        });

        // Event listeners
        svg_container.addEventListener("mousedown", e => {
            this.mouseTouchStart(e);
            console.log("mousedown");
        });
        svg_container.addEventListener("mousemove", e => {
            this.mouseTouchMove(e);
            console.log("mousemove");
        });
        svg_container.addEventListener("mouseup", e => {
            this.mouseTouchEnd(e);
            console.log("mouseup");
        });
        svg_container.addEventListener("touchstart", e => {
            this.mouseTouchStart(e);
            console.log("touchstart");
        });
        svg_container.addEventListener("touchmove", e => {
            this.mouseTouchMove(e);
            console.log("touchmove");
        });
        svg_container.addEventListener("touchend", e => {
            this.mouseTouchEnd(e);
            console.log("touchend");
        });
    }

    drawSlider(slider_opt, index, svg_holder) {
        let slider = document.createElementNS(this.ns, "g");
        slider.setAttribute("data-slider", index);
        slider.setAttribute('transform', 'rotate(-90,' + this.centerX + ',' + this.centerY + ')');
        svg_holder.appendChild(slider);
        this.drawCircle(slider_opt.radius, index, slider);
        this.drawPoint(slider_opt.radius, slider_opt.min, slider_opt.max, slider_opt.initial_value, slider_opt.color, index, slider);
    }

    drawCircle(radius, index, svg) {
        let circle = document.createElementNS(this.ns, "circle");
        circle.setAttribute("data-circle", index);
        circle.setAttribute("cx", this.centerX);
        circle.setAttribute("cy", this.centerY);
        circle.setAttribute("r", radius);
        circle.setAttribute("stroke", "black");
        circle.setAttribute("fill", "none");
        svg.appendChild(circle);
    }

    /**
     * Draws a point for a slider
     * @param {number} radius 
     * @param {number} min 
     * @param {number} max 
     * @param {number} initial_value 
     * @param {string} color 
     * @param {number} index 
     * @param {SVGGElement} svg 
     */
    drawPoint(radius, min, max, initial_value, color, index, svg) {
        let initial_angle = this.calcAngleFromValue(min, max, initial_value);
        let point = document.createElementNS(this.ns, "circle");
        point.setAttribute("data-point", index);
        let pointPosition = this.calcPointPos(radius, initial_angle);
        point.setAttribute("cx", pointPosition.x);
        point.setAttribute("cy", pointPosition.y);
        point.setAttribute("r", this.point_size);
        point.setAttribute("fill", color);
        svg.appendChild(point);
    }

    redrawPoint({ x, y }) {
        var index = 0; // This is static for now!!!
        let point = document.querySelector("[data-point = '" + index + "']");
        let slider_opt = this.slider_options[index];
        let mouse_angle = this.calcMousePosAngle(x, y);
        let pointPosition = this.calcPointPos(slider_opt.radius, mouse_angle);

        point.setAttribute("cx", pointPosition.x);
        point.setAttribute("cy", pointPosition.y);

        this.updateLegend(slider_opt.min, slider_opt.max, mouse_angle, index);
    }

    /**
     * Creates a table legend with the slider data
     */
    createLegend() {
        // Legend div
        let div = document.createElement("div");
        div.classList.add("legend_container");
        // Table
        let table = document.createElement("table");
        table.classList.add("table");
        // Data for each slider
        this.slider_options.forEach((slider, index) => {

            let tr = document.createElement("tr");
            // Value
            let td_1 = document.createElement("td");
            td_1.setAttribute("data-value", index);
            td_1.innerText = slider.initial_value ?? 0;

            // Color
            let td_2 = document.createElement("td");
            let color_box = document.createElement("span");
            color_box.setAttribute("data-color", index);
            color_box.style.backgroundColor = slider.color ?? "#000000";
            color_box.classList.add('color_box');
            color_box.innerHTML = "&nbsp";
            td_2.appendChild(color_box);

            // Name
            let td_3 = document.createElement("td");
            td_3.setAttribute("data-name", index);
            td_3.innerText = slider.name ?? "No name";

            tr.appendChild(td_1);
            tr.appendChild(td_2);
            tr.appendChild(td_3);
            table.appendChild(tr);
        });
        div.appendChild(table);
        this.container.appendChild(div);
    }

    /**
     * Updates the legend with the slider current value
     * @param {number} min 
     * @param {number} max 
     * @param {number} angle 
     * @param {number} index 
     */
    updateLegend(min, max, angle, index) {
        let td = document.querySelector("[data-value = '" + index + "']");
        td.innerHTML = this.calcValueFromAngle(min, max, angle);
    }

    /**
     * Calculates the new position(x, y) of Point from radius and angle
     * @param {number} radius 
     * @param {number} angle 
     * @returns 
     */
    calcPointPos(radius, angle) {
        let x = this.centerX + radius * Math.cos(angle * Math.PI / 180);
        let y = this.centerY + radius * Math.sin(angle * Math.PI / 180);
        return { x, y };
    }

    /**
     * Calculates the angle from value, min value and max value
     * @param {number} min 
     * @param {number} max 
     * @param {number} value 
     * @returns 
     */
    calcAngleFromValue(min, max, value) {
        return 360 * value / (max - min);
    }

    /**
     * Calculates the value from angle, min value and max value
     * @param {number} min 
     * @param {number} max 
     * @param {number} angle 
     * @returns 
     */
    calcValueFromAngle(min, max, angle) {
        return Math.floor(angle * (max - min) / 360);
    }

    /**
     * Calculates the angle of the mouse position relative to the center of the svg
     * @param {number} x 
     * @param {number} y 
     * @returns 
     */
    calcMousePosAngle(x, y) {
        var angle = Math.atan2(this.centerY - y, this.centerX - x) * 180 / Math.PI - 90;

        if (angle < 0) {
            angle = angle + 360;
        }
        return angle;
    }

    /**
     * Calculates the new position(x, y) of Point from given radius and angle
     * @param {number} radius 
     * @param {number} angle 
     * @returns 
     */
    calcPointPos(radius, angle) {
        let x = this.centerX + radius * Math.cos(angle * Math.PI / 180);
        let y = this.centerY + radius * Math.sin(angle * Math.PI / 180);
        return { x, y };
    }

    /**
     * Get current pointer position on mouse and touch events
     */
    getMousePos(e) {
        let rect = document.querySelector("[data-svg-holder]").getBoundingClientRect();
        var x, y;
        if(e.type == 'touchstart' || e.type == 'touchmove' || e.type == 'touchend' || e.type == 'touchcancel'){
            var evt = (typeof e.originalEvent === 'undefined') ? e : e.originalEvent;
            var touch = evt.touches[0] || evt.changedTouches[0];
            x = touch.pageX;
            y = touch.pageY;
        } else if (e.type == 'mousedown' || e.type == 'mouseup' || e.type == 'mousemove' || e.type == 'mouseover'|| e.type=='mouseout' || e.type=='mouseenter' || e.type=='mouseleave') {
            x = e.clientX;
            y = e.clientY;
        }
        var x = x - rect.left;
        var y = y - rect.top;

        return { x, y };
    }
    /**
     * Sets isMouseDown to true on mousedown and touchstart event
     */
    mouseTouchStart() {
        this.isMouseDown = true;
    }
    /**
     * Redraws Point on mousemove and touchmove events
     */
    mouseTouchMove(e) {
        if (!this.isMouseDown) { return; }
        let pos = this.getMousePos(e);
        this.redrawPoint(pos);
    }
    /**
     * Redraws Point on mouseend and touchend events and sets isMouseDown to false
     */
    mouseTouchEnd(e) {
        if (!this.isMouseDown) { return; }
        let pos = this.getMousePos(e);
        this.isMouseDown = false;
        this.redrawPoint(pos);
    }
}




