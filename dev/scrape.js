(async function () {
    return new Promise((r, rj) => {

        function makeCsv(data) {
            console.log(data)
            var csv = data.map((row) => row.join(",")).join("\n");
            var encodedUri = encodeURI("data:text/csv;charset=utf-8," + csv);
            window.open(encodedUri);
            var link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", "my_data.csv");
            document.body.appendChild(link); // Required for FF
            link.click();
        }

        function getCabinetData() {
            var fullAddress = $("div[data-local-attribute] span:nth-child(2)").text();
            var segments = fullAddress.split(",");
            var cabinet = {
                title: $("div[data-attrid=\"title\"]").text().replace(/[,]/g, " "),
                phone: $("a[data-number]").attr("data-number"),
                website: ($("a[role=\"button\"]")[2]).href,
                address: (segments[0]) ? segments[0] : "Not Avaliable",
                city: (segments[1]) ? segments[1] : "Not Avaliable",
                state: (segments[2]) ? segments[2].match(/[A-z]*/g)[1] : "Not Avaliable",
                fullAddress: fullAddress.replace(/[,]/g, " ")
            };

            if (cabinet.website.match(/google/g))
                cabinet.website = "No Website Avaliable";
            if (cabinet.fullAddress.match(/\(\d*\)/g))
                fullAddress = "Not Avaliable";
            return cabinet;
        }

        function makeRow(cabs) {
            return cabs.reduce((row, collumn) => {
                var col = document.createElement("td");
                col.innerHTML = collumn;
                row.appendChild(col);
                return row;
            }, document.createElement("tr"));
        }

        var style = `<style>
        
        td{
            border:3px solid black;
            margin:1.5%;
            text-wrap:wrap;
        }
        
        </style>`;

        var c = getCabinetData();
        var columns = [];
        var data = [];
        for (var i in c) {
            columns.push(i);
            data.push(c[i]);
        }

        var container = document.createElement("table");

        var headerRow = makeRow(columns);

        container.appendChild(headerRow);
        container.appendChild(makeRow(data));

        var masterData = [columns];

        var items = Array.from($("div[role=\"heading\"]"));
        console.log(items);
        items.map((item, index) => {
            setTimeout(() => {
                $(item).click();
                var cab = getCabinetData();
                var dat = [];
                for (var c in cab)
                    dat.push(cab[c]);
                masterData.push(dat);
                container.appendChild(makeRow(dat));
                console.log(index, items.length);
                if (index + 1 == 3) {
                    console.log(index + 1, items.length);
                    makeCsv(masterData);
                    r(style + container.outerHTML);
                }

            }, 5000 * index);
        });



    });
})();