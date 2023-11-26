var textfile = null;

erro.onclick = function() {
    var resultados = document.getElementById("resultados");
    var divs = resultados.getElementsByClassName("resultados");
    for (var i = 0; i < divs.length; i++) {
        var div = divs[i];
        var prompt = div.getElementsByTagName("textarea")[0]
        var completion = div.getElementsByTagName("textarea")[1]
        if (prompt.value[prompt.value.length - 1] != ":") {
            prompt.focus();
            return;
        }
        if (completion.value[0] != " ") {
            completion.focus();
            return;
        }
    }
}

iniciar.onclick = function() {
    file = document.getElementById("respostas").files[0];
    if (file.length == 0) {
        alert("Selecione um arquivo");
        return;
    }
    var reader = new FileReader();
    reader.onload = function fileReadCompleted() {
        var content = reader.result;
        var lines = content.split("\r\n");
        for (var i = 0; i < lines.length; i++) {
            var json = JSON.parse(lines[i]);
            add_json_to_html(json);
        }
    }
    reader.readAsText(file);
}

adicionar.onclick = function() {
    add_json_to_html({"prompt":"", "completion":""});
}

salvar.onclick = function() {
    var resultados = document.getElementById("resultados");
    var divs = resultados.getElementsByClassName("resultados");
    var text = "";
    for (var i = 0; i < divs.length; i++) {
        var div = divs[i];
        var prompt = div.getElementsByTagName("textarea")[0].value;
        var completion = div.getElementsByTagName("textarea")[1].value;
        var json = {"prompt":prompt, "completion":completion};
        text += JSON.stringify(json) + "\r\n";
    }
    var blob = new Blob([text], {type: "text/plain;charset=utf-8"});
    saveAs(blob, "dataset.jsonl");
}

function add_json_to_html(json) {
    var prompt = json.prompt;
    var completion = json.completion;

    var resultados = document.getElementById("resultados");

    var div = document.createElement("div");
    div.setAttribute("class", "resultados card");

    var h2_prompt = document.createElement("h2");
    h2_prompt.innerHTML = "Prompt";

    var textarea_prompt = document.createElement("textarea");
    textarea_prompt.setAttribute("class", "prompt");
    textarea_prompt.setAttribute("rows", "5");
    textarea_prompt.setAttribute("cols", "100");
    textarea_prompt.innerHTML = prompt;

    var h2_completion = document.createElement("h2");
    h2_completion.innerHTML = "Completion";

    var textarea_completion = document.createElement("textarea");
    textarea_completion.setAttribute("class", "completion");
    textarea_completion.setAttribute("rows", "3");
    textarea_completion.setAttribute("cols", "100");
    textarea_completion.innerHTML = completion;

    var button = document.createElement("button");
    button.setAttribute("onclick", "this.parentNode.parentNode.removeChild(this.parentNode)");
    button.innerHTML = "Remover";

    var br = document.createElement("br");
    var hr = document.createElement("hr");

    div.appendChild(h2_prompt);
    div.appendChild(textarea_prompt);
    div.appendChild(hr);
    div.appendChild(h2_completion);
    div.appendChild(textarea_completion);
    div.appendChild(br);
    div.appendChild(button);
    resultados.appendChild(div);
}

function saveAs(blob, filename) {
    if (textfile !== null) {
        window.URL.revokeObjectURL(textfile);
    }
    textfile = window.URL.createObjectURL(blob);
    var link = document.createElement("a");
    link.setAttribute("download", filename);
    link.href = textfile;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}