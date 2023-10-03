class Slider {

    constructor({ container, sliderOptions }) {
        this.container = document.querySelector(container);
        this.sliderOptions = sliderOptions

        this.svgHeight = 500;
        this.svgWidth = 500;
        this.x = this.svgHeight / 2;
        this.y = this.svgWidth / 2;
        this.ns = "http://www.w3.org/2000/svg";
        this.point_size = 14;   // Size of the slider point
        this.path_width = 15;   // Width of the slider path
        this.tau = 2 * Math.PI; // Tau constant

        this.tempSliderOption = this.sliderOptions[0];
    }

    draw() {
        this.createLegend();

        let svgContainer = document.createElement("div");
        svgContainer.classList.add("svg_container");
        svgContainer.setAttribute("data-svg-holder", true);
        let svg_holder = document.createElementNS(this.ns, "svg");
        svg_holder.setAttribute("width", this.svgWidth);
        svg_holder.setAttribute("height", this.svgWidth);
        svgContainer.appendChild(svg_holder);
        this.container.appendChild(svgContainer);
        this.sliderOptions.forEach(slider => {
            this.drawCircle(slider.radius, svg_holder);
            this.drawPoint(slider.radius, slider.initialValue, slider.color, svg_holder);
        });
    }

    drawCircle(radius, svg) {
        let circle = document.createElementNS(this.ns, "circle");
        circle.setAttribute("data-circle", 1);
        circle.setAttribute("cx", this.x);
        circle.setAttribute("cy", this.y);
        circle.setAttribute("r", radius);
        circle.setAttribute("stroke", "black");
        circle.setAttribute("fill", "none");
        svg.appendChild(circle);
    }

    drawPoint(radius, initialValue, color, svg) {
        let initialAngle = 360 * initialValue / (this.tempSliderOption.max - this.tempSliderOption.min);
        let point = document.createElementNS(this.ns, "circle");
        point.setAttribute("data-point", 1);
        let x = this.x + radius * Math.cos((initialAngle - 90) * Math.PI / 180);
        let y = this.y + radius * Math.sin((initialAngle - 90) * Math.PI / 180);
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
        this.sliderOptions.forEach((slider, index) => {

            let tr = document.createElement("tr");
            // Value
            let td_1 = document.createElement("td");
            td_1.setAttribute("value", index);
            td_1.innerText = slider.initialValue ?? 0;

            // Color
            let td_2 = document.createElement("td");
            let colorBox = document.createElement("span");
            colorBox.style.backgroundColor = slider.color ?? "#000000";
            colorBox.classList.add('color_box');
            colorBox.innerHTML = "&nbsp";
            td_2.appendChild(colorBox);

            // Name
            let td_3 = document.createElement("td");
            td_3.setAttribute("name", index);
            td_3.innerText = slider.name ?? "No name";

            tr.appendChild(td_1);
            tr.appendChild(td_2);
            tr.appendChild(td_3);
            table.appendChild(tr);
        });
        div.appendChild(table);
        this.container.appendChild(div);
    }

}