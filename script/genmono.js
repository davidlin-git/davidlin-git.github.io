function filterClear() {
    let input;
    input = document.getElementById("input-search");
    input.value = "";
    filterItem();
}

function filterItem() {

    let input, tables, table, rows, cols, td, i, j, k, showRow, txtValue, count, total, result;

    total = 0;
    input = document.getElementById("input-search");

    filter = input.value.toUpperCase();

    tables = document.getElementsByClassName("table");

    for (i = 0; i < tables.length; i++) {

        count = 0;
        table = tables[i];
        rows = table.getElementsByTagName("tr");

        for (j = 1; j < rows.length; j++) {

            showRow = false;
            cols = rows[j].getElementsByTagName("td");

            for (k = 1; k < cols.length; k++) {
                if (showRow == false) {
                    td = cols[k];
                    if (td) {
                        txtValue = td.textContent || td.innerText;
                        if (txtValue.toUpperCase().indexOf(filter) > -1) {
                            showRow = true;
                        }
                    }
                }
            }
            if (showRow) {
                rows[j].style.display = "";
                count++;
            } else {
                rows[j].style.display = "none";
            }
        }

        if (count > 0) {
            table.style.display = "";
        } else {
            table.style.display = "none";
        }

        total = total + count;

    }

    result = document.getElementById("filter-result");
    if (filter.length > 0) {
        result.innerText = "「" + input.value + "」，共符合 " + total + " 個項目。";
    } else {
        result.innerText = "";
    }
    input.value = "";

}