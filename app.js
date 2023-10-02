class Slider {

    constructor({ container, sliders }) {
        this.container = document.querySelector(container);
        this.sliders = sliders

        this.height = 500;
        this.width = 500;
        this.point_size = 14;
    }

    draw() {
        this.createLegend();
        this.createCanvas();
        this.sliders.forEach(slider => {
            this.drawCircle(slider.radius);
            this.drawPoint(slider.radius, 0);
        });

    }

    createCanvas() {
        let div = document.createElement("div");
        div.classList.add("canvas_container");
        let canvas = document.createElement("canvas");
        canvas.setAttribute("id", "slider_canvas");
        canvas.width = this.height;
        canvas.height = this.width;
        div.appendChild(canvas);
        this.container.appendChild(div);
    }

    drawCircle(radius) {
        let canvas = document.getElementById("slider_canvas");
        let ctx = canvas.getContext("2d");
        ctx.beginPath();
        ctx.arc(this.height / 2, this.width / 2, radius, 0, 2 * Math.PI);
        ctx.stroke();
    }

    drawPoint(radius, angle) {
        let canvas = document.getElementById("slider_canvas");
        let ctx = canvas.getContext("2d");
        let x = this.width / 2 + radius * Math.cos(-angle * Math.PI / 180);
        let y = this.height / 2 + radius * Math.sin(-angle * Math.PI / 180);

        ctx.beginPath();
        ctx.arc(x, y, this.point_size, 0, 2 * Math.PI);
        ctx.fill();
    }

    createLegend() {

        // Legend div
        let div = document.createElement("div");
        div.classList.add("legend_container");
        // Table
        let table = document.createElement("table");
        table.classList.add("table");
        // Data for each slider
        this.sliders.forEach((slider, index) => {

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