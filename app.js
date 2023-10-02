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
    }

    createCanvas() {
        const div = document.createElement("div");
        div.classList.add("canvas_container");
        const canvas = document.createElement("canvas");
        canvas.setAttribute("id","slider_canvas");
        canvas.width = this.height;
        canvas.height = this.width;
        div.appendChild(canvas);
        this.container.appendChild(div);

        this.drawCircle(canvas);
        this.drawPoint(canvas, 0);
        this.drawPoint(canvas, 90);
        this.drawPoint(canvas, 180);
        this.drawPoint(canvas, 270);
    }

    drawCircle(canvas) {
        const ctx = canvas.getContext("2d");
        this.sliders.forEach(slider => {
            ctx.beginPath();
            ctx.arc(this.height/2, this.width/2,slider.radius,0,2*Math.PI);
            ctx.stroke();
        });
    }

    drawPoint(canvas, angle){
        const ctx = canvas.getContext("2d");
        var x = this.width/2 + 200 * Math.cos(-angle*Math.PI/180);
        var y = this.height/2 + 200 * Math.sin(-angle*Math.PI/180);
    
        ctx.beginPath();
        ctx.arc(x, y, this.point_size, 0, 2 * Math.PI);
        ctx.fill();
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