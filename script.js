class Grafo{
  constructor(){
    this.lista = {};  // lista de adyacencia
    // crear nodos
    for (let f = 0; f < N; f++){
      for (let c = 0; c < M; c++){
        this.lista[M*f+c] = {
          id : M*f+c,
          x : c,
          y : f,
          e : []
        };
      }
    }
  
    // crear aristas
    // derecha
    for (let f = 0; f < N; f++)
      for (let c = 0; c < M-1; c++)
        this.lista[M*f+c].e.push(
          {
            id : M*f+c+1,
            peso: 1
          }
        );
    
    // derecha abajo
    for (let f = 0; f < N-1; f++)
      for (let c = 0; c < M-1; c++)
        this.lista[M*f+c].e.push(
          {
            id : M*(f+1)+c+1,
            peso: 1.41
          }
        );
    // abajo
    for (let f = 0; f < N-1; f++)
      for (let c = 0; c < M; c++)
        this.lista[M*f+c].e.push(
          {
            id : M*(f+1)+c,
            peso: 1
          }
        );
    // izquierda abajo
    for (let f = 0; f < N-1; f++)
      for (let c = 1; c < M; c++)
        this.lista[M*f+c].e.push(
          {
            id : M*(f+1)+c-1,
            peso: 1.41
          }
        );
    // izquierda
    for (let f = 0; f < N; f++)
      for (let c = 1; c < M; c++)
        this.lista[M*f+c].e.push(
          {
            id : M*f+c-1,
            peso: 1
          }
        );
    // izquierda arriba
    for (let f = 1; f < N; f++)
      for (let c = 1; c < M; c++)
        this.lista[M*f+c].e.push(
          {
            id : M*(f-1)+c-1,
            peso: 1.41
          }
        );
    // arriba
    for (let f = 1; f < N; f++)
      for (let c = 0; c < M; c++)
        this.lista[M*f+c].e.push(
          {
            id : M*(f-1)+c,
            peso: 1
          }
        );
    // derecha arriba
    for (let f = 1; f < N; f++)
      for (let c = 0; c < M - 1; c++)
        this.lista[M*f+c].e.push(
          {
            id : M*(f-1)+c+1,
            peso: 1.41
          }
        );
  }
  get size(){
    return Object.keys(this.lista).length;
  }
  dibujarGrafo() {
    // limpiar fondo
    background(150);
    // color negro
    stroke(0);
    // dibujar aristas
    strokeWeight(edge_width);
    for (let f = 0; f < N-1; f++)
      for (let c = 0; c < M; c++){
        let esta_en_lista = M*f+c in this.lista;
        if (esta_en_lista && this.lista[M*f+c].e.filter(e => e.id == M*(f+1)+c).length > 0)
          line(margin_size + c*(edge_length+node_size),margin_size + f*(edge_length+node_size),
          margin_size + c*(edge_length+node_size),margin_size + (f+1)*(edge_length+node_size));
      }
    for (let f = 0; f < N; f++)
      for (let c = 0; c < M-1; c++){
        let esta_en_lista = M*f+c in this.lista;
        if (esta_en_lista && this.lista[M*f+c].e.filter(e => e.id == M*f+c+1).length > 0)
          line(margin_size + c*(edge_length+node_size),margin_size + f*(edge_length+node_size),
          margin_size + (c+1)*(edge_length+node_size),margin_size + f*(edge_length+node_size));
      }
    for (let f = 0; f < N-1; f++)
      for (let c = 0; c < M-1; c++){
        let esta_en_lista = M*f+c in this.lista;
        if (esta_en_lista && this.lista[M*f+c].e.filter(e => e.id == M*(f+1)+c+1).length > 0)
          line(margin_size + c*(edge_length+node_size),margin_size + f*(edge_length+node_size),
          margin_size + (c+1)*(edge_length+node_size),margin_size + (f+1)*(edge_length+node_size));
      }
    for (let f = 0; f < N-1; f++)
      for (let c = 1; c < M; c++){
        let esta_en_lista = M*f+c in this.lista;
        if (esta_en_lista && this.lista[M*f+c].e.filter(e => e.id == M*(f+1)+c-1).length > 0)
          line(margin_size + c*(edge_length+node_size),margin_size + f*(edge_length+node_size),
          margin_size + (c-1)*(edge_length+node_size),margin_size + (f+1)*(edge_length+node_size));
      }
    // dibujar nodos
    strokeWeight(node_size);
    for (let nodo in this.lista){
      point(margin_size + this.lista[nodo].x*(edge_length+node_size), margin_size + this.lista[nodo].y*(edge_length+node_size));
    }
  }
  eliminarNodo(id_elim) {
    let vecinos = this.lista[id_elim].e
    delete this.lista[id_elim];  // borro el nodo
    // eliminar ese nodo en la lista de sus vecinos
    for (let i = 0 ; i < vecinos.length; i++){
      let nodo_vecino = this.lista[vecinos[i].id];
      for (let j = 0; j < nodo_vecino.e.length; j++){
        if (nodo_vecino.e[j].id == id_elim){
          //cambiar a nodo_vecino
          this.lista[vecinos[i].id].e.splice(j,1);
        }
      }
    }
  }
  eliminarPorcentaje(porcentaje) {
    let cant = Math.floor(N * M * porcentaje / 100);
    for (let i = 0; i < cant;){
      let id_nodo = Math.floor(Math.random() * N * M);
      if (id_nodo in this.lista){
        this.eliminarNodo(id_nodo);
        i++;
      }
    }
  }
  colorearCamino(path) {
    stroke(color(255,0,0));
    strokeWeight(edge_width);
    line(margin_size + this.lista[path[0]].x*(edge_length+node_size), margin_size + this.lista[path[0]].y*(edge_length+node_size),
    margin_size + this.lista[path[1]].x*(edge_length+node_size), margin_size + this.lista[path[1]].y*(edge_length+node_size))

    stroke(color(200,150,0));
    strokeWeight(node_size);
    point(margin_size + this.lista[path[0]].x*(edge_length+node_size), margin_size + this.lista[path[0]].y*(edge_length+node_size));
    
    stroke(color(255,0,0));
    textSize(node_size / 1.3);
    for (let i = 1; i < path.length - 1; i++){
      let x = margin_size + this.lista[path[i]].x*(edge_length+node_size);
      let y = margin_size + this.lista[path[i]].y*(edge_length+node_size);
      strokeWeight(node_size);
      point(x, y);
      strokeWeight(edge_width);
      line(x, y,
      margin_size + this.lista[path[i+1]].x*(edge_length+node_size), margin_size + this.lista[path[i+1]].y*(edge_length+node_size))
      text(path.length - i, x - (node_size / 5 * (path.length - i).toString().length), y + node_size / 4)
    }
    stroke(color(200,150,0));
    strokeWeight(node_size);
    point(margin_size + this.lista[path[path.length - 1]].x*(edge_length+node_size), margin_size + this.lista[path[path.length - 1]].y*(edge_length+node_size));
  }
}

function profundidad(lista_ady,nodo_inicial,nodo_final) {
  let L = [[nodo_inicial]]; //[[1,2,3]]
  let pasos = 0;
  while (L.length > 0){
    pasos++;
    if (L[0][0] == nodo_final){
      return [L[0],pasos];
    }else{
      let lista_padre = L[0]; // [3,1,4]
      // borrar el primer elemento
      L.splice(0,1);

      // añadir a los hijos sin que haya bucles
      // o sea q no aparezcan en su lista padre
      for (let i = 0, pos = 0; i < lista_ady[lista_padre[0]].e.length; i++){
        // verificar si el hijo se encuentra en la lista_padre:
        let esta_repetido = false;
        let id_hijo = lista_ady[lista_padre[0]].e[i].id;
        for (let j = 0; j < lista_padre.length; j++){
          if (id_hijo == lista_padre[j]){
            esta_repetido = true;
            break;
          }
        }
        // si no lo esta --> lo metemos
        if (esta_repetido == false){
          // crear lista que tenga ese nodo al comienzo
          let lista_hijo = [id_hijo];
          lista_hijo = lista_hijo.concat(lista_padre);

          //metemos a la lista L al comienzo
          L.splice(pos++,0,lista_hijo);
        }
      }
    }
  }

  return [[],pasos];
}

function amplitud(lista_ady,nodo_inicial,nodo_final) {
  let L = [[nodo_inicial]];
  let pasos = 0;
  while (L.length > 0){
    pasos++;
    if (L[0][0] == nodo_final){
      return [L[0],pasos];
    }else{
      let lista_padre = L[0];
      L.splice(0,1);
      for (let i = 0; i < lista_ady[lista_padre[0]].e.length; i++){
        let esta_repetido = false;
        let id_hijo = lista_ady[lista_padre[0]].e[i].id;
        for (let j = 0; j < lista_padre.length; j++){
          if (id_hijo == lista_padre[j]){
            esta_repetido = true;
            break;
          }
        }
        if (esta_repetido == false){
          let lista_hijo = [id_hijo];
          lista_hijo = lista_hijo.concat(lista_padre);
          L.push(lista_hijo); // añadimos al final de la lista en este caso
        }
      }
    }
  }
  return [[],pasos];
}

function distance(nodo_i,nodo_o) {
  return Math.sqrt(Math.pow(nodo_o.x - nodo_i.x,2) + Math.pow(nodo_o.y - nodo_i.y,2));
}

function hillClimbing(lista_ady,nodo_inicial,nodo_final) {
  let L = [[nodo_inicial]];
  let pasos = 0;
  while (L.length > 0){
    pasos++;
    if (L[0][0] == nodo_final){
      return [L[0],pasos];
    }else{
      let lista_padre = L[0];
      L.splice(0,1);
      // lista ordenada que guardara los hijos segun su distancia al objetivo
      let hijos = [];
      // voy por cada hijo
      for (let i = 0; i < lista_ady[lista_padre[0]].e.length; i++){
        let esta_repetido = false;
        let id_hijo = lista_ady[lista_padre[0]].e[i].id;
        for (let j = 0; j < lista_padre.length; j++){
          if (id_hijo == lista_padre[j]){
            esta_repetido = true;
            break;
          }
        }
        // si escogerlo no genera un bucle entonces lo guardo en la lista de hijos
        if (esta_repetido == false){
          let lista_hijo = [id_hijo];
          lista_hijo = lista_hijo.concat(lista_padre);
          hijos.push(lista_hijo); // añadimos al final de la lista en este caso
        }
      }
      // ordenar la lista de hijos de acuerdo de la distancia
      hijos.sort((a, b) => {
        let dis_a = distance(lista_ady[a[0]],lista_ady[nodo_final]);
        let dis_b = distance(lista_ady[b[0]],lista_ady[nodo_final]);
        if (dis_a > dis_b) {
          return 1;
        }
        if (dis_a < dis_b) {
          return -1;
        }
        return 0;
      });
      // meter a la mejor opcion al comienzo
      if (hijos.length > 0)
        L.splice(0,0,hijos[0]);
      // poner al resto de hijos al final
      for(let i = 1; i < hijos.length; i++){
        L.push(hijos[i]);
      }
    }
  }
  return [[],pasos];
}

function mejorPrimero(lista_ady,nodo_inicial,nodo_final) {
  let L = [[nodo_inicial]];
  let pasos = 0;
  while (L.length > 0){
    pasos++;
    if (L[0][0] == nodo_final){
      return [L[0],pasos];
    }else{
      let lista_padre = L[0];
      L.splice(0,1);
      // lista ordenada que guardara los hijos segun su distancia al objetivo
      let hijos = [];
      // voy por cada hijo
      for (let i = 0; i < lista_ady[lista_padre[0]].e.length; i++){
        let esta_repetido = false;
        let id_hijo = lista_ady[lista_padre[0]].e[i].id;
        for (let j = 0; j < lista_padre.length; j++){
          if (id_hijo == lista_padre[j]){
            esta_repetido = true;
            break;
          }
        }
        // si escogerlo no genera un bucle entonces lo guardo en la lista de hijos
        if (esta_repetido == false){
          let lista_hijo = [id_hijo];
          lista_hijo = lista_hijo.concat(lista_padre);
          hijos.push(lista_hijo); // añadimos al final de la lista en este caso
        }
      }
      // ordenar la lista de hijos de acuerdo de la distancia
      hijos.sort((a, b) => {
        let dis_a = distance(lista_ady[a[0]],lista_ady[nodo_final]);
        let dis_b = distance(lista_ady[b[0]],lista_ady[nodo_final]);
        if (dis_a < dis_b) {
          return 1;
        }
        if (dis_a > dis_b) {
          return -1;
        }
        return 0;
      });
      // meter todos los paths de hijos a L en ese orden
      for(let i = 0; i < hijos.length; i++){
        L.splice(0,0,hijos[i]);
      }
    }
  }
  return [[],pasos];
}

function aStar(lista_ady,nodo_inicial,nodo_final) {
  let L = [[nodo_inicial]];
  let L_dist = [0];

  let pasos = 0;
  while (L.length > 0){
    pasos++;
    if (L[0][0] == nodo_final){
      return [L[0],pasos];
    }else{
      let lista_padre = L[0];
      L.splice(0,1);
      let dis_padre = L_dist[0];
      L_dist.splice(0,1);
      // lista ordenada que guardara los hijos con su camino 
      // segun su distancia al objetivo y el peso de su camino desde el inicio
      let hijos = [];
      // voy por cada hijo
      for (let i = 0; i < lista_ady[lista_padre[0]].e.length; i++){
        let esta_repetido = false;
        let id_hijo = lista_ady[lista_padre[0]].e[i].id;
        let peso_hijo = lista_ady[lista_padre[0]].e[i].peso;
        for (let j = 0; j < lista_padre.length; j++){
          if (id_hijo == lista_padre[j]){
            esta_repetido = true;
            break;
          }
        }
        // si escogerlo no genera un bucle entonces lo guardo en la lista de hijos
        if (esta_repetido == false){
          let lista_hijo = [id_hijo];
          lista_hijo = lista_hijo.concat(lista_padre);
          hijos.push([lista_hijo,peso_hijo]); // añadimos al final de la lista en este caso
        }
      }
      // ordenar la lista de hijos de acuerdo a:
      // longitud del camino desde el inicio + distancia al objetivo
      hijos.sort((a, b) => {
        let f_a = distance(lista_ady[a[0][0]],lista_ady[nodo_final]) + a[1] + dis_padre;
        let f_b = distance(lista_ady[b[0][0]],lista_ady[nodo_final]) + b[1] + dis_padre;
        if (f_a < f_b) {
          return 1;
        }
        if (f_a > f_b) {
          return -1;
        }
        return 0;
      });
      // meter todos los paths de hijos a L en ese orden
      for(let i = 0; i < hijos.length; i++){
        L.splice(0,0,hijos[i][0]);
        L_dist.splice(0,0,hijos[i][1]);
      }
    }
  }
  return [[],pasos];
}

// Esta es una version basada en la vista en Wikipedia.
// function reconstruct_path(cameFrom, current, pasos) {
//   let total_path = [current];
//   while (current in cameFrom)
//     current = cameFrom[current];
//     total_path.splice(0,0,current);
//   return [total_path,pasos];
// }
    
// function newAstar(lista_ady,nodo_inicial,nodo_final) {
//   let L = [[nodo_inicial]];
//   let cameFrom = {};

//   let gScore = {};
//   for (let i = 0; i < lista_ady.length; i++){
//     gScore.i = Infinity;
//   }
//   gScore.nodo_inicial = 0;

//   let fScore = [];
//   for (let i = 0; i < lista_ady.length; i++){
//     fScore[i] = Infinity;
//   }
//   fScore[nodo_inicial] = distance(lista_ady[nodo_inicial],lista_ady[nodo_final]);

//   let current = nodo_inicial;
//   let pasos = 0;
//   while (L.length > 0){
//     pasos++;
//     if (current == nodo_final)
//       return reconstruct_path(cameFrom, current, pasos);

//     L.splice(L.indexOf(current),1);
//     for (let i = 0; i < lista_ady[current].e.length; i++){
//       let vecino = lista_ady[current].e[i];
//       console.log(vecino);
//       let tentative_gScore =  gScore[current] + vecino.peso;
//       if (tentative_gScore < gScore[vecino.id]){
//         cameFrom.vecino[id] = current;

//         gScore.vecino[id] = tentative_gScore;
//         fScore[vecino[id]] = tentative_gScore + distance(lista_ady[vecino[id]],nodo_final);
//         if (!(vecino.id in L)){
//           L.push(vecino.id);
//         }
//       }
//     }
//   }
// }
