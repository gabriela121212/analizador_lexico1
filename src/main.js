    const dropArea = document.getElementById('dropArea');
    const textarea = document.getElementById('inputCode');

    dropArea.addEventListener('dragover', e => {
      e.preventDefault();
      dropArea.classList.add('textarea-dragover');
    });

    dropArea.addEventListener('dragleave', () => {
      dropArea.classList.remove('textarea-dragover');
    });

    dropArea.addEventListener('drop', e => {
      e.preventDefault();
      dropArea.classList.remove('textarea-dragover');
      const file = e.dataTransfer.files[0];
      if (file && file.type === "text/plain") {
        const reader = new FileReader();
        reader.onload = function(evt) {
          textarea.value = evt.target.result;
        };
        reader.readAsText(file);
      } else {
        alert("Solo se permiten archivos .txt");
      }
    });



    // Definición de tokens: regex, significado y categoría
    const tokenDefs = [
      // Comentario multilínea entre /# y #/
      { re: /^\/#([\s\S]*?)#\//, sig: "Comentario multilínea", cat: "Comentario" },

      // Comentario de una sola línea que inicia con /#
      { re: /^\/#.*(?:\r?\n|$)/, sig: "Comentario de una línea", cat: "Comentario" },
      { re: /^"(?:\\.|[^"])*"/,     sig: "Constante de texto",    cat: "Cadena" },
      { re: /^'(?:\\.|[^'])*'/,     sig: "Constante carácter",    cat: "Carácter" },
      { re: /^\d+\.\d+/,            sig: "Número decimal",        cat: "Numérico" },
      { re: /^\.\d+/,               sig: "Número decimal",        cat: "Numérico" },
      { re: /^\d+/,                 sig: "Número entero",         cat: "Numérico" },

      // Palabras reservadas
      { re: /^(?:const|let|var)\b/, sig: "Declaración var.",      cat: "Palabra reservada" },
      { re: /^(?:text|number|bo|ch)\b/, sig: "Tipo de dato",       cat: "Palabra reservada" },
      { re: /^(?:true|false)\b/,     sig: "Booleano",             cat: "Palabra reservada" },
      { re: /^(?:if|else|for|fun|match|case|default|length)\b/, 
                                     sig: "Control/Estructura",   cat: "Palabra reservada" },
      { re: /^(?:pr|cl)\b/,           sig: "Salida",               cat: "Palabra reservada" },
      { re: /^pi\b/,                  sig: "Constante π",          cat: "Palabra reservada" },

      // Operadores y símbolos
      { re: /^=>/,      sig: "Flecha",                  cat: "Asignación / arrow" },
      { re: /^>=/,      sig: "Mayor o igual",           cat: "Comparación" },
      { re: /^<=/,      sig: "Menor o igual",           cat: "Comparación" },
      { re: /^>/,       sig: "Mayor",                   cat: "Comparación" },
      { re: /^</,       sig: "Menor",                   cat: "Comparación" },
      { re: /^==/,      sig: "Igual igual",             cat: "Comparación" },
      { re: /^!=/,      sig: "Diferente de",            cat: "Comparación" },
      { re: /^&&/,      sig: "And lógico",              cat: "Lógico" },
      { re: /^\|\|/,    sig: "Or lógico",               cat: "Lógico" },
      { re: /^!/,       sig: "Negación",                cat: "Lógico" },
      { re: /^\?/,      sig: "Ternario",                cat: "Operador ternario" },
      { re: /^:/,       sig: "dos puntos",   cat: "Asignación" },
      { re: /^=/,       sig: "Asignación (igual)",              cat: "Asignación" },

      // Aritméticos
      { re: /^\+/, sig: "Suma",      cat: "Aritmético" },
      { re: /^\-/, sig: "Resta",     cat: "Aritmético" },
      { re: /^\*/, sig: "Multiplicación", cat: "Aritmético" },
      { re: /^\//, sig: "División",  cat: "Aritmético" },
      { re: /^%/,   sig: "Porcentaje",    cat: "Aritmético" },

      // Agrupación y separadores
      { re: /^\[/, sig: "Corchete abierto",  cat: "Agrupación" },
      { re: /^\]/, sig: "Corchete cerrado",  cat: "Agrupación" },
      { re: /^\{/, sig: "Llave abierta",     cat: "Agrupación" },
      { re: /^\}/, sig: "Llave cerrada",     cat: "Agrupación" },
      { re: /^\(/, sig: "Paréntesis abierto",cat: "Agrupación" },
      { re: /^\)/, sig: "Paréntesis cerrado",cat: "Agrupación" },
      { re: /^,/,  sig: "Coma",               cat: "Separador" },
      { re: /^;/,  sig: "Punto y coma",       cat: "Separador" },
      { re: /^\./, sig: "Punto", cat: "Separador" },




      // Identificadores
    { re: /^_[A-Za-záéíóúÁÉÍÓÚñÑ][A-Za-záéíóúÁÉÍÓÚñÑ0-9_]*/, sig: "Identificador", cat: "Letra/nombre" },
    { re: /^[A-Za-záéíóúÁÉÍÓÚñÑ][A-Za-záéíóúÁÉÍÓÚñÑ0-9_]*/,  sig: "Identificador", cat: "Letra/nombre" },


      // Espacios y saltos de línea (se ignoran)
      { re: /^\s+/, ignore: true },
    ];




    function analizar() {

      const code = document.getElementById('inputCode').value;
      const tabla = document.querySelector('#tablaTokens tbody');
      const erroresDiv = document.getElementById('errores');
      tabla.innerHTML = '';
      erroresDiv.textContent = '';

      let idx = 0;
      while (idx < code.length) {
        let matched = false;
        for (const def of tokenDefs) {
          const textoRest = code.slice(idx);
          const m = def.re.exec(textoRest);
          if (m) {
            matched = true;
            const tok = m[0];
            if (!def.ignore) {
              const row = tabla.insertRow();
              row.insertCell().textContent = tok;
              row.insertCell().textContent = def.sig;
              row.insertCell().textContent = def.cat;
            }
            idx += tok.length;
            break;
          }
        }
        if (!matched) {
          // token desconocido
          erroresDiv.innerHTML += 
            `<div class="error">No reconocido en pos ${idx}: “${code[idx]}”</div>`;
          idx++;
        }
      }
    }
