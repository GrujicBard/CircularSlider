class Slider {

    constructor({ container, sliders }) {
        this.container = document.querySelector(container);
        this.sliders = sliders

        this.height = 200;
        this.width = 200;
    }

    draw() {
        this.createLegend();
        this.createCanvas();

    }


    createCanvas() {
        const div = document.createElement("div");
        div.classList.add("canvas_container");
        const canvas = document.createElement("canvas");
        canvas.setAttribute("id","slider_canvas");
        const height = canvas.width = 400;
        const width = canvas.height = 400;
        div.appendChild(canvas);
        this.container.appendChild(div);
        const ctx = canvas.getContext("2d");
        this.sliders.forEach(slider => {
            ctx.beginPath();
            ctx.arc(height/2, width/2,slider.radius,0,2*Math.PI);
            ctx.stroke();
        });
    }


    drawCircle() {

    }

    createLegend() {

        // Legend div
        const div = document.createElement("div");
        div.classList.add("legend_container");
        // Table
        const table = document.createElement("table");
        table.classList.add("table");
        // Data for each slider
        this.sliders.forEach((slider, index) => {

            const tr = document.createElement("tr");
            // Value
            const td_1 = document.createElement("td");
            td_1.setAttribute("value", index);
            td_1.innerText = slider.initialValue ?? 0;

            // Color
            const td_2 = document.createElement("td");
            const colorBox = document.createElement("span");
            colorBox.style.backgroundColor = slider.color ?? "#000000";
            colorBox.classList.add('color_box');
            colorBox.innerHTML = "&nbsp";
            td_2.appendChild(colorBox);

            // Name
            const td_3 = document.createElement("td");
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