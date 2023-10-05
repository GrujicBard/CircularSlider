class Slider {

    constructor({ container, slider_options }) {
        this.container = document.querySelector(container);
        this.slider_options = slider_options

        this.svg_height = 500;                      // Height of the svg element
        this.svg_width = 500;                       // Width of the svg element
        this.center_x = this.svg_width / 2;         // Center of svg element
        this.center_y = this.svg_height / 2;
        this.ns = "http://www.w3.org/2000/svg";
        this.handle_size = 16;                      // Size of the slider handle
        this.path_width = 28;                       // Width of the slider path
        this.path_dash_size = 10;                   // Size of the dashes of the background path
        this.path_dash_gap = 2;                     // Gap of the dashes of the background path
        this.is_mouse_down = false;                 // Is mouse clicked
        this.symbol = "$";                          // Symbol before the values in the legend
        this.value_width = 90;                      // Width of the values in the legend
    }

    /**
     * Creates all the sliders
     */
    create() {
        // Legend
        this.createLegend();

        // Svg container div
        let svg_container = document.createElement("div");
        svg_container.classList.add("svg_container");
        svg_container.setAttribute("data-svg-holder", true);

        // Svg holder
        let svg_holder = document.createElementNS(this.ns, "svg");
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
        });
        svg_container.addEventListener("mousemove", e => {
            this.mouseTouchMove(e);
        });
        svg_container.addEventListener("mouseup", e => {
            this.mouseTouchEnd(e);
        });
        svg_container.addEventListener("touchstart", e => {
            this.mouseTouchStart(e);
        });
        svg_container.addEventListener("touchmove", e => {
            this.mouseTouchMove(e);
        });
        svg_container.addEventListener("touchend", e => {
            this.mouseTouchEnd(e);
        });
    }

    /**
     * Draws a single slider
     * @param {object} slider_opt 
     * @param {number} index 
     * @param {object} svg_holder 
     */
    drawSlider(slider_opt, index, svg_holder) {
        // Group of the elements of a single slider
        let slider = document.createElementNS(this.ns, "g");
        slider.setAttribute("data-slider", index);
        slider.setAttribute("data-active", false);
        slider.setAttribute("data-radius", slider_opt.radius);
        slider.setAttribute("transform", `rotate(-90, ${this.center_x},${this.center_y})`);
        svg_holder.appendChild(slider);
        // Get angle of the initial data
        let initial_angle = this.calcAngleFromValue(slider_opt.min, slider_opt.max, slider_opt.initial_value);
        // Add all the slider elements to the slider group
        this.drawCircle(slider_opt.radius, index, slider);
        this.drawPath(slider_opt.radius, initial_angle, slider_opt.color, index, slider)
        this.drawHandle(slider_opt.radius, initial_angle, index, slider);
    }

    /**
     * Draws the background circle
     * @param {number} radius 
     * @param {number} index 
     * @param {object} svg 
     */
    drawCircle(radius, index, svg) {
        let circle = document.createElementNS(this.ns, "circle");
        circle.setAttribute("data-circle", index);
        circle.setAttribute("cx", this.center_x);
        circle.setAttribute("cy", this.center_y);
        circle.setAttribute("r", radius);
        circle.setAttribute("stroke-dasharray", `${this.path_dash_size} ${this.path_dash_gap}`);
        circle.setAttribute("fill", "none");
        circle.style.stroke = "#cfcfcf"
        circle.style.strokeWidth = this.path_width;
        svg.appendChild(circle);
    }

    /**
     * Draws the path of the slider that represents its current value
     * @param {number} radius 
     * @param {number} initial_angle 
     * @param {string} color 
     * @param {number} index 
     * @param {object} svg 
     */
    drawPath(radius, initial_angle, color, index, svg) {
        let path = document.createElementNS(this.ns, "path");
        path.setAttribute("d", this.definePath(radius, 0, initial_angle));
        path.setAttribute("data-path", index);
        path.setAttribute("fill", "none");
        path.setAttribute("stroke-opacity", "0.9");
        path.style.stroke = color;
        path.style.strokeWidth = this.path_width;
        svg.appendChild(path);
    }

    /**
     *  Defines the shape of the path
     * @param {number} radius 
     * @param {number} angle_start 
     * @param {number} angle_end 
     * @returns {string}
     */
    definePath(radius, angle_start, angle_end) {
        // Calculate the position from the angles
        let startPos = this.calcPosFromAngle(radius, angle_start);
        let endPos = this.calcPosFromAngle(radius, angle_end);
        // Determines if arc should be large or small
        let sweep = 1;
        if (angle_end <= 180) {
            sweep = 0;
        }

        return `M ${startPos.x} ${startPos.y} A ${radius} ${radius} 1 ${sweep} 1 ${endPos.x} ${endPos.y}`;
    }

    /**
     * Draws the handle for a slider
     * @param {number} radius 
     * @param {number} initial_value 
     * @param {number} index 
     * @param {object} svg 
     */
    drawHandle(radius, initial_angle, index, svg) {
        let handle = document.createElementNS(this.ns, "circle");
        handle.setAttribute("data-handle", index);
        let handlePosition = this.calcPosFromAngle(radius, initial_angle);
        handle.setAttribute("cx", handlePosition.x);
        handle.setAttribute("cy", handlePosition.y);
        handle.setAttribute("r", this.handle_size);
        handle.setAttribute("fill", "#f6f7f7");
        handle.style.stroke = "#cfcfcf"
        handle.style.strokeWidth = 1;
        svg.appendChild(handle);
    }

    /**
     * Redraws the active slider from the current pointer position
     * @param {number} x 
     * @param {number} y 
     */
    redrawSlider(x, y) {
        // Get the active slider
        let activeSlider = document.querySelector("[data-slider][data-active='true'");
        // Check if active slider exsists
        if (activeSlider != null) {
            // Get the current index of the active slider
            let index = activeSlider.getAttribute("data-slider");
            // Get the active slider data
            let slider_opt = this.slider_options[index];
            // Get the active slider elements
            let handle = document.querySelector(`[data-handle = "${index}"]`);
            let path = document.querySelector(`[data-path = "${index}"]`);

            // Get new angle from the current mouse pointer position
            let mouse_angle = this.calcPointerAngle(x, y);

            // Redraw Path
            path.setAttribute("d", this.definePath(slider_opt.radius, 0, mouse_angle));

            // Redraw Handle
            let newPos = this.calcPosFromAngle(slider_opt.radius, mouse_angle);
            handle.setAttribute("cx", newPos.x);
            handle.setAttribute("cy", newPos.y);

            // Update legend data
            this.updateLegend(slider_opt.min, slider_opt.max, slider_opt.step, mouse_angle, index);
        }
    }

    /**
     * Finds nearest slider according to mouse distance and sets it to active
     */
    findNearestSlider(x, y) {
        // Pointer distance from center
        let pointerDistance = this.calcDistanceFromCenter(x, y);
        // Get all sliders
        let sliders = document.querySelectorAll("[data-slider]");

        // Subtract pointer distance to slider radiuses to get the pointer distances from the sliders
        let distanceArr = [];
        sliders.forEach(slider => {
            var distance = Math.abs(slider.getAttribute("data-radius") - pointerDistance);
            distanceArr = [...distanceArr, distance];
        });

        // Get index of the smallest distance from array of distances
        let min_distance = Math.min(...distanceArr)
        let index = distanceArr.indexOf(min_distance);
        // Slider with smallest distance is set to active, others are set to false
        for (let i = 0; i < sliders.length; i++) {
            // Only set slider to active if distance is equal or less than 20
            if (i == index && min_distance <= 20) {
                sliders[i].setAttribute("data-active", true);
            }
            else {
                sliders[i].setAttribute("data-active", false);
            }
        };
    }

    /**
     * Creates a table legend with the initial slider data
     */
    createLegend() {
        // Legend div
        let div = document.createElement("div");
        div.classList.add("legend_container");
        // Table
        let table = document.createElement("table");
        table.classList.add("table");
        // Set initial data for each slider
        this.slider_options.forEach((slider, index) => {

            let tr = document.createElement("tr");

            // Slider value
            let td_1 = document.createElement("td");
            td_1.setAttribute("data-value", index);
            td_1.style.minWidth = `${this.value_width}px`;
            td_1.innerText = this.symbol + slider.initial_value ?? 0;

            // Slider color
            let td_2 = document.createElement("td");
            let color_box = document.createElement("span");
            color_box.setAttribute("data-color", index);
            color_box.style.backgroundColor = slider.color ?? "#000000";
            color_box.classList.add("color_box");
            color_box.innerHTML = "&nbsp";
            td_2.appendChild(color_box);

            // Slider name
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
     * Updates the table legend with the slider current value
     * @param {number} min 
     * @param {number} max 
     * @param {number} step
     * @param {number} angle 
     * @param {number} index 
     */
    updateLegend(min, max, step, angle, index) {
        let td = document.querySelector(`[data-value = "${index}"]`);
        // Get value from the current mouse angle
        let value = this.calcValueFromAngle(min, max, angle);
        // Set the step increment by rounding the value
        value = Math.round(value / step) * step;
        td.innerHTML = this.symbol + value;
    }

    /**
     * Calculates the new position(x, y) from radius and angle
     * @param {number} radius 
     * @param {number} angle 
     * @returns 
     */
    calcPosFromAngle(radius, angle) {
        let x = this.center_x + radius * Math.cos(angle * Math.PI / 180);
        let y = this.center_y + radius * Math.sin(angle * Math.PI / 180);
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
        return Math.floor((angle * (max - min) / 360) + min);
    }

    /**
     * Calculates the angle of the current pointer position relative to the center of the svg
     * @param {number} x 
     * @param {number} y 
     * @returns 
     */
    calcPointerAngle(x, y) {
        var angle = Math.atan2(this.center_y - y, this.center_x - x) * 180 / Math.PI - 90;

        if (angle < 0) {
            angle = angle + 360;
        }
        return angle;
    }

    /**
     * Calculates the distance from the point(x, y) to the center of the svg
     * @param {number} x 
     * @param {number} y 
     * @returns 
     */
    calcDistanceFromCenter(x, y) {
        return Math.sqrt(Math.pow(x - this.center_x, 2) + Math.pow(y - this.center_y, 2));
    }

    /**
     * Get current pointer position(x, y) on mouse and touch events
     */
    getPointerPos(e) {
        let rect = document.querySelector("[data-svg-holder]").getBoundingClientRect();
        var x, y;
        if (e.type == "touchstart" || e.type == "touchmove" || e.type == "touchend" || e.type == "touchcancel") {
            var evt = (typeof e.originalEvent === "undefined") ? e : e.originalEvent;
            var touch = evt.touches[0] || evt.changedTouches[0];
            x = touch.pageX;
            y = touch.pageY;
        } else if (e.type == "mousedown" || e.type == "mouseup" || e.type == "mousemove" || e.type == "mouseover" || e.type == "mouseout" || e.type == "mouseenter" || e.type == "mouseleave") {
            x = e.clientX;
            y = e.clientY;
        }
        var x = x - rect.left;
        var y = y - rect.top;
        return { x, y };
    }

    /**
     * Sets the nearest slider to active and sets is_mouse_down to true on mousedown and touchstart events
     */
    mouseTouchStart(e) {
        this.is_mouse_down = true;
        let pos = this.getPointerPos(e);
        this.findNearestSlider(pos.x, pos.y);
    }

    /**
     * Redraws the active slider on mousemove and touchmove events
     */
    mouseTouchMove(e) {
        if (!this.is_mouse_down) { return; }
        let pos = this.getPointerPos(e);
        this.redrawSlider(pos.x, pos.y);
    }

    /**
     * Redraws the active slider on mouseend and touchend events and sets is_mouse_down to false
     */
    mouseTouchEnd(e) {
        if (!this.is_mouse_down) { return; }
        this.is_mouse_down = false;
        let pos = this.getPointerPos(e);
        this.redrawSlider(pos.x, pos.y);
    }
}




