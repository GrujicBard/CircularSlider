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
        this.sliderOptions.forEach((sliderOpt, index) => {
            this.drawSlider(sliderOpt, index, svg_holder);
        });


    }

    drawSlider(sliderOpt, index, svg_holder){
        let slider = document.createElementNS(this.ns, "g");
        slider.setAttribute("data-slider", index);
        svg_holder.appendChild(slider);
        svg_holder.appendChild(slider);
        this.drawCircle(sliderOpt.radius, index, slider);
        this.drawPoint(sliderOpt.radius, sliderOpt.initialValue, sliderOpt.color, index, slider);
    }

    drawCircle(radius, index, svg) {
        let circle = document.createElementNS(this.ns, "circle");
        circle.setAttribute("data-circle", index);
        circle.setAttribute("cx", this.x);
        circle.setAttribute("cy", this.y);
        circle.setAttribute("r", radius);
        circle.setAttribute("stroke", "black");
        circle.setAttribute("fill", "none");
        svg.appendChild(circle);
    }

    drawPoint(radius, initialValue, color, index, svg) {
        let initialAngle = 360 * initialValue / (this.tempSliderOption.max - this.tempSliderOption.min);
        let point = document.createElementNS(this.ns, "circle");
        point.setAttribute("data-point", index);
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
            td_1.setAttribute("data-value", index);
            td_1.innerText = slider.initialValue ?? 0;

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

}