class Slider {
    
    constructor({ container, sliders }) {
        this.container = document.querySelector(container);
        this.sliders = sliders
    }

    draw() {
        this.createLegend();
    }

    createLegend() {
        const div = document.createElement("div");
        div.classList.add("legend");

        const table = document.createElement("table");
        table.classList.add("table");

        this.sliders.forEach((slider, index) => {
            const tr = document.createElement("tr");

            const td_1 = document.createElement("td");
            td_1.setAttribute("value", index);
            td_1.innerText = slider.initialValue ?? 0;


            const td_2 = document.createElement("td");
            const colorBox = document.createElement("span");
            colorBox.style.backgroundColor = slider.color ?? "#FF5733";
            colorBox.classList.add('colorBox');
            colorBox.innerHTML = "&nbsp";
            td_2.appendChild(colorBox);

            const td_3 = document.createElement("td");
            td_3.setAttribute("name", index);
            td_3.innerText = slider.name ?? "Missing name";

            tr.appendChild(td_1);
            tr.appendChild(td_2);
            tr.appendChild(td_3);
            table.appendChild(tr);
        });
        div.appendChild(table);
        this.container.appendChild(div);
    }


}