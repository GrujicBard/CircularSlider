class Slider {

    constructor({ container, slider_options }) {
        this.container = document.querySelector(container);
        this.slider_options = slider_options

        this.svg_height = 500;
        this.svg_width = 500;
        this.center_x = this.svg_width / 2;          // Center of svg element
        this.center_y = this.svg_height / 2;
        this.ns = "http://www.w3.org/2000/svg";
        this.handle_size = 14;                       // Size of the slider handle
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
        svg_holder.setAttribute("style", "border: 1px solid #cfcfcf")
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

    drawSlider(slider_opt, index, svg_holder) {
        // Group of slider elements
        let slider = document.createElementNS(this.ns, "g");
        slider.setAttribute("data-slider", index);
        slider.setAttribute("data-active", false);
        slider.setAttribute("data-radius", slider_opt.radius);
        slider.setAttribute('transform', 'rotate(-90,' + this.center_x + ',' + this.center_y + ')');
        svg_holder.appendChild(slider);
        this.drawCircle(slider_opt.radius, index, slider);
        this.drawHandle(slider_opt.radius, slider_opt.min, slider_opt.max, slider_opt.initial_value, slider_opt.color, index, slider);
    }

    drawCircle(radius, index, svg) {
        let circle = document.createElementNS(this.ns, "circle");
        circle.setAttribute("data-circle", index);
        circle.setAttribute("cx", this.center_x);
        circle.setAttribute("cy", this.center_y);
        circle.setAttribute("r", radius);
        circle.setAttribute("stroke", "#cfcfcf");
        circle.setAttribute("fill", "none");
        svg.appendChild(circle);
    }

    /**
     * Draws a handle for a slider
     * @param {number} radius 
     * @param {number} min 
     * @param {number} max 
     * @param {number} initial_value 
     * @param {string} color 
     * @param {number} index 
     * @param {SVGGElement} svg 
     */
    drawHandle(radius, min, max, initial_value, color, index, svg) {
        let initial_angle = this.calcAngleFromValue(min, max, initial_value);
        let handle = document.createElementNS(this.ns, "circle");
        handle.setAttribute("data-handle", index);
        let handlePosition = this.calcHandlePos(radius, initial_angle);
        handle.setAttribute("cx", handlePosition.x);
        handle.setAttribute("cy", handlePosition.y);
        handle.setAttribute("r", this.handle_size);
        handle.setAttribute("fill", color);
        svg.appendChild(handle);
    }

    redrawHandle({ x, y }) {
        let activeSlider = document.querySelector("[data-slider][data-active='true'");
        // Check if active slider exsists
        if(activeSlider != null){
            let index = (activeSlider.getAttribute("data-slider"));
            let handle = document.querySelector("[data-handle = '" + index + "']");
            let slider_opt = this.slider_options[index];
            let mouse_angle = this.calcPointerPosAngle(x, y);
            let handlePosition = this.calcHandlePos(slider_opt.radius, mouse_angle);
    
            handle.setAttribute("cx", handlePosition.x);
            handle.setAttribute("cy", handlePosition.y);
    
            this.updateLegend(slider_opt.min, slider_opt.max, mouse_angle, index);
        }
    }

    /**
     * Finds nearest slider according to mouse distance and sets it to active
     */
    findNearestSlider(pointerPos) {
        // Pointer distance from center
        let pointerDistance = this.calcDistanceFromCenter(pointerPos.x, pointerPos.y);
        // Get all sliders
        let sliders = document.querySelectorAll("[data-slider]");

        // Subtract pointer distance to slider radiuses
        let distanceArr = [];
        sliders.forEach(slider => {
            var distance = Math.abs(slider.getAttribute("data-radius") - pointerDistance);
            distanceArr = [...distanceArr, distance];
        });

        // Index of smallest distance from array of distances
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
     * Calculates the new position(x, y) of a handle
     * @param {number} radius 
     * @param {number} angle 
     * @returns 
     */
    calcHandlePos(radius, angle) {
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
        return Math.floor(angle * (max - min) / 360);
    }

    /**
     * Calculates the angle of the pointer position relative to the center of the svg
     * @param {number} x 
     * @param {number} y 
     * @returns 
     */
    calcPointerPosAngle(x, y) {
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
     * Get current pointer position on mouse and touch events
     */
    getPointerPos(e) {
        let rect = document.querySelector("[data-svg-holder]").getBoundingClientRect();
        var x, y;
        if (e.type == 'touchstart' || e.type == 'touchmove' || e.type == 'touchend' || e.type == 'touchcancel') {
            var evt = (typeof e.originalEvent === 'undefined') ? e : e.originalEvent;
            var touch = evt.touches[0] || evt.changedTouches[0];
            x = touch.pageX;
            y = touch.pageY;
        } else if (e.type == 'mousedown' || e.type == 'mouseup' || e.type == 'mousemove' || e.type == 'mouseover' || e.type == 'mouseout' || e.type == 'mouseenter' || e.type == 'mouseleave') {
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
    mouseTouchStart(e) {
        this.isMouseDown = true;
        let pos = this.getPointerPos(e);
        this.findNearestSlider(pos);
    }
    /**
     * Redraws slider on mousemove and touchmove events
     */
    mouseTouchMove(e) {
        if (!this.isMouseDown) { return; }
        let pos = this.getPointerPos(e);
        this.redrawHandle(pos);
    }
    /**
     * Redraws slider on mouseend and touchend events and sets isMouseDown to false
     */
    mouseTouchEnd(e) {
        if (!this.isMouseDown) { return; }
        let pos = this.getPointerPos(e);
        this.isMouseDown = false;
        this.redrawHandle(pos);
    }
}




