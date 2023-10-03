class Slider {

    constructor({ container, slider_options }) {
        this.container = document.querySelector(container);
        this.slider_options = slider_options

        this.svg_height = 500;
        this.svg_width = 500;
        this.centerX = this.svg_height / 2; // Center of svg element
        this.centerY = this.svg_width / 2;
        this.ns = "http://www.w3.org/2000/svg";
        this.point_size = 14;   // Size of the slider point
    }

    draw() {
        this.createLegend();

        let svg_container = document.createElement("div");
        svg_container.classList.add("svg_container");
        svg_container.setAttribute("data-svg-holder", true);
        let svg_holder = document.createElementNS(this.ns, "svg");
        svg_holder.setAttribute("width", this.svg_width);
        svg_holder.setAttribute("height", this.svg_width);
        svg_container.appendChild(svg_holder);
        this.container.appendChild(svg_container);
        this.slider_options.forEach((slider_opt, index) => {
            this.drawSlider(slider_opt, index, svg_holder);
        });
        svg_container.addEventListener("click", this.getMousePos.bind(this), false);
    }

    drawSlider(slider_opt, index, svg_holder) {
        let slider = document.createElementNS(this.ns, "g");
        slider.setAttribute("data-slider", index);
        svg_holder.appendChild(slider);
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

    drawPoint(radius, min, max, initial_value, color, index, svg) {
        let initial_angle = 360 * initial_value / (max - min);
        let point = document.createElementNS(this.ns, "circle");
        point.setAttribute("data-point", index);
        let x = this.centerX + radius * Math.cos((initial_angle - 90) * Math.PI / 180);
        let y = this.centerY + radius * Math.sin((initial_angle - 90) * Math.PI / 180);
        point.setAttribute("cx", x);
        point.setAttribute("cy", y);
        point.setAttribute("r", this.point_size);
        point.setAttribute("fill", color);
        svg.appendChild(point);
    }

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

    redrawPoint(x, y){
        let point = document.querySelector("[data-point = '0']");
        let mouse_angle = this.getMousePosAngle(x, y); 
        let handleCenter = this.calculatePointPos(200, mouse_angle);
        
        point.setAttribute("cx", handleCenter.x);
        point.setAttribute("cy", handleCenter.y);
    }

    /**
     * Calculates the angle of the mouse position relative to the center of the svg
     *  */
    getMousePosAngle(x, y){
        return Math.atan2(this.centerY - y, this.centerX - x) * 180 / Math.PI;
    }

    /**
     * Calculates the new position(x, y) of Point from given radius and angle
     *  */
    calculatePointPos (radius, angle) {
        let x = this.centerX + radius * Math.cos((angle-180) * Math.PI / 180);
        let y = this.centerY + radius * Math.sin((angle-180) * Math.PI / 180);
        return { x, y };
    }

    // Event handlers

    /**
     * Get current mouse position on mouse click and hold
     */ 
    getMousePos(e) {
        let rect = document.querySelector("[data-svg-holder]").getBoundingClientRect();
        var client_x = e.clientX;
        var client_y = e.clientY;
        
        // Touch Event triggered
        if (window.TouchEvent && e instanceof TouchEvent) 
        {
            client_x = e.touches[0].pageX;
            client_y = e.touches[0].pageY;
        }
        var x = client_x - rect.left;
        var y = client_y - rect.top;

        console.log("X: " + x + " - Y: " + y);
        this.redrawPoint(x, y);
    }





}