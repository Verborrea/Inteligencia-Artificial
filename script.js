let node_size = 20;       // tamaño de los nodos en pixeles
let edge_length = 40;     // tamaño de los vertices en px
let edge_width = 2;       // ancho de los vertices en px
let N = 10, M = 10;     // grafo de N filas x M columnas
let margin_size = 1.5 * node_size;
let canvas_width = (M+2)*node_size+(M-1)*edge_length;
let canvas_height = (N+2)*node_size+(N-1)*edge_length;
let canvas_margin_x = 250;
let canvas_margin_y = 100;

let inicio = -1;
let final = -1;
let aux_ini_fin = 1;
let hay_path = false;
// crear grafo
let miGrafo = new Grafo();

function setup() {
  // dibujar canvas
  let canvas = createCanvas(canvas_width,canvas_height);
  canvas.position(canvas_margin_x,canvas_margin_y);

  miGrafo.dibujarGrafo();

  // slider densidad del grafo
  let slider = document.getElementById("densidad");
  slider.value = slider.max;
  document.getElementById("densidad_label").innerHTML = slider.value;

  //listeners
  document.getElementById("densidad").oninput = function() {
    // quitar nodos inicio y final
    inicio = -1;
    final = -1;
    aux_ini_fin = 1;
  
    //limpiar inputs inicio y final
    document.getElementById("nodo_inicial").value = ''
    document.getElementById("nodo_final").value = ''
  
    // crear nuevo grafo con nuevos valores
    document.getElementById("densidad_label").innerHTML = this.value;
    miGrafo = new Grafo();
    miGrafo.eliminarPorcentaje(100 - parseInt(this.value));
  
    miGrafo.dibujarGrafo();
  }
  document.getElementById("nodo_inicial").onchange = function() {
    if (this.value in miGrafo.lista){
      let x = this.value%M;
      let y = Math.floor(this.value/M);
      if (hay_path){
        miGrafo.dibujarGrafo();
        hay_path = false;
      }
      if (inicio != -1){  // si ya habia un nodo inicio marcado
        let ini_x = inicio%M;
        let ini_y = Math.floor(inicio/M);
        stroke(0);
        point(margin_size + ini_x*(edge_length+node_size), margin_size + ini_y*(edge_length+node_size));
      }
      inicio = this.value;
      // colorear nodo
      stroke(color(200,150,0));
      point(margin_size + x*(edge_length+node_size), margin_size + y*(edge_length+node_size));
    }else{
      this.value = '';
    }
  }
  document.getElementById("nodo_final").onchange = function() {
    if (this.value in miGrafo.lista){
      let x = this.value%M;
      let y = Math.floor(this.value/M);
      if (hay_path){
        miGrafo.dibujarGrafo();
        hay_path = false;
      }
      if (final != -1){  // si ya habia un nodo inicio marcado
        let fin_x = final%M;
        let fin_y = Math.floor(final/M);
        stroke(0);
        point(margin_size + fin_x*(edge_length+node_size), margin_size + fin_y*(edge_length+node_size));
      }
      final = this.value;
      // colorear nodo
      stroke(color(200,150,0));
      point(margin_size + x*(edge_length+node_size), margin_size + y*(edge_length+node_size));
    }else{
      this.value = '';
    }
  }
  document.getElementById("filas").onchange = function() {
    // quitar nodos inicio y final
    inicio = -1;
    final = -1;
    aux_ini_fin = 1;

    //limpiar inputs inicio y final
    document.getElementById("nodo_inicial").value = ''
    document.getElementById("nodo_final").value = ''

    //cambiar el nro de filas y tamaño del canvas
    N = parseInt(this.value);
    canvas_height = (N+2)*node_size+(N-1)*edge_length;
    console.log(canvas_height);
    resizeCanvas(canvas_width, canvas_height);

    //cambiar el nro de filas y crear un nuevo grafo
    miGrafo = new Grafo();
    miGrafo.dibujarGrafo();
  }
  document.getElementById("columnas").onchange = function() {
    // quitar nodos inicio y final
    inicio = -1;
    final = -1;
    aux_ini_fin = 1;

    //limpiar inputs inicio y final
    document.getElementById("nodo_inicial").value = ''
    document.getElementById("nodo_final").value = ''

    //cambiar el nro de filas y tamaño del canvas
    M = parseInt(this.value);
    canvas_width = (M+2)*node_size+(M-1)*edge_length;
    console.log(canvas_height);
    resizeCanvas(canvas_width, canvas_height);

    //cambiar el nro de filas y crear un nuevo grafo
    miGrafo = new Grafo();
    miGrafo.dibujarGrafo();
  }
}

function buscarPath() {
  if (inicio != -1 && final != -1 && (inicio != final)){

    miGrafo.dibujarGrafo();

    let select = document.getElementById('algoritmo');
    let value = parseInt(select.options[select.selectedIndex].value);
    let res = [];
    switch (value) {
      case 1:
        res = profundidad(miGrafo.lista,inicio,final);
        miGrafo.colorearCamino(res[0]);
        hay_path = true;
        break;
      case 2:
        res = amplitud(miGrafo.lista,inicio,final);
        miGrafo.colorearCamino(res[0]);
        hay_path = true;
        break;
      case 3:
        res = hillClimbing(miGrafo.lista,inicio,final);
        miGrafo.colorearCamino(res[0]);
        hay_path = true;
        break;
      case 4:
        res = mejorPrimero(miGrafo.lista,inicio,final);
        miGrafo.colorearCamino(res[0]);
        hay_path = true;
        break;
      case 5:
        res = aStar(miGrafo.lista,inicio,final);
        miGrafo.colorearCamino(res[0]);
        hay_path = true;
        break;
    }
    document.getElementById('pasos_label').innerHTML = res[1];
  }
}

// funcion para seleccionar los nodos de inicio y final del camino con el mouse
function mouseClicked() {
  let m_x = mouseX - node_size;
  let m_y = mouseY - node_size;

  let x_in_cuad = m_x%(node_size+edge_length) < node_size;
  let y_in_cuad = m_y%(node_size+edge_length) < node_size;

  if((x_in_cuad && m_x < canvas_width && m_x > 0) && (y_in_cuad && m_y < canvas_height && m_y > 0)){
    let x = Math.floor(m_x/(node_size+edge_length));
    let y = Math.floor(m_y/(node_size+edge_length));
    let id = M*y+x;

    // si un nodo existe en dicha parte de la cuadricula
    if (id in miGrafo.lista){
      // marcar como inicio o final
      if(aux_ini_fin & 1){
        document.getElementById("nodo_inicial").value = id
        if (hay_path){
          miGrafo.dibujarGrafo();
          hay_path = false;
        }
        if (inicio != -1){  // si ya habia un nodo inicio marcado
          let ini_x = inicio%M;
          let ini_y = Math.floor(inicio/M);
          stroke(0);
          point(margin_size + ini_x*(edge_length+node_size), margin_size + ini_y*(edge_length+node_size));
        }
        inicio = id;
      }else{
        document.getElementById("nodo_final").value = id
        if (hay_path){
          miGrafo.dibujarGrafo();
          hay_path = false;
        }
        if (final != -1){  // si ya habia un nodo inicio marcado
          let fin_x = final%M;
          let fin_y = Math.floor(final/M);
          stroke(0);
          point(margin_size + fin_x*(edge_length+node_size), margin_size + fin_y*(edge_length+node_size));
        }
        final = id;
      }
      aux_ini_fin++;
      // colorear nodo
      stroke(color(200,150,0));
      point(margin_size + x*(edge_length+node_size), margin_size + y*(edge_length+node_size));
    }
  }
}