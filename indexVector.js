class bola
{
      constructor(radio, posicionX, posicionY, velocidadX, velocidadY, color, svgContenedor) {
        this.color = color;
        this.radio = radio;

        this.position = new Vector(posicionX, posicionY);
        this.velocity = new Vector(velocidadX,velocidadY);
        // Creación del tag
        this.tagCircle = document.createElementNS("http://www.w3.org/2000/svg","circle");
        this.tagCircle.setAttributeNS(null, "fill", this.color);
        this.tagCircle.setAttributeNS(null, "cx", this.position.x);
        this.tagCircle.setAttributeNS(null, "cy", this.position.y);
        this.tagCircle.setAttributeNS(null, "r", this.radio);
        svgContenedor.appendChild(this.tagCircle);
    }
    
    mueve(anchoContenedor, altoContenedor)
    {
        // Comprobamos ahora si está fuera de los límites
        // Eje X
        if (this.position.x-this.radio<=0 || this.position.x+this.radio >= anchoContenedor )
            this.velocity = new Vector(-this.velocity.x, this.velocity.y);
        
        // Eje Y
        if (this.position.y-this.radio <=0 || this.position.y+this.radio >= altoContenedor )
          this.velocity = new Vector(this.velocity.x, -this.velocity.y);
        
          const newX = Math.max(
            Math.min(this.position.x + this.velocity.x, anchoContenedor),
            0
          );
      
          const newY = Math.max(
            Math.min(this.position.y + this.velocity.y, altoContenedor),
           0
          );
          
         this.position= new Vector(newX, newY);
    }

    colisiona(otraBola){
        const distance = this.position.subtract(otraBola.position).magnitude;

        let posAntigua = this.position;

        if (distance <= this.radio + otraBola.radio) {
            const v1 = collisionVector(this, otraBola);
            const v2 = collisionVector(otraBola, this);
            this.velocity = v1;
            otraBola.velocity = v2;

            this.position = posAntigua;

        }
    }
    
    dibuja()
    {
        this.tagCircle.setAttributeNS(null, "cx", this.position.x);
        this.tagCircle.setAttributeNS(null, "cy", this.position.y);
    }

    get sphereArea() {
      return 4 * Math.PI * this.radio ** 2;
    }

}

class Vector {
    constructor(x, y) {
      this.x = x;
      this.y = y;
    }
  
    /**
     * Returning a new Vector creates immutability
     * and allows chaining. These properties are
     * extremely useful with the complex formulas
     * we'll be using.
     **/
    add(vector) {
      return new Vector(this.x + vector.x, this.y + vector.y);
    }
  
    subtract(vector) {
      return new Vector(this.x - vector.x, this.y - vector.y);
    }
  
    multiply(scalar) {
      return new Vector(this.x * scalar, this.y * scalar);
    }
  
    dotProduct(vector) {
      return this.x * vector.x + this.y * vector.y;
    }
  
    get magnitude() {
      return Math.sqrt(this.x ** 2 + this.y ** 2);
    }
  
    get direction() {
      return Math.atan2(this.x, this.y);
    }
  }

  const collisionVector = (particle1, particle2) => {
    return particle1.velocity
      .subtract(particle1.position
        .subtract(particle2.position)
        .multiply(particle1.velocity
          .subtract(particle2.velocity)
          .dotProduct(particle1.position.subtract(particle2.position))
          / particle1.position.subtract(particle2.position).magnitude ** 2
        )
  
        // add mass to the system
        .multiply((2 * particle2.sphereArea) / (particle1.sphereArea + particle2.sphereArea))
      );
  };


function aleatorio(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function colorAleatorio()
{
    return "#"+ Math.floor(Math.random()*16777215).toString(16);
}

var bolas = new Array();
var svg; 

 window.onload = () =>
  {
      svg = document.getElementById("panel");

      for (let i=0; i<10; i++)
        bolas.push(new bola(aleatorio(10,50), aleatorio(70,800), aleatorio(70,800), aleatorio(1,15),aleatorio(1,15),colorAleatorio(),svg));

     // setInterval( loop, 30);
     elId = window.requestAnimationFrame(loop);
  }

  function loop()
  {
      tamanoSVG = svg.getBoundingClientRect();
      for (let i=0; i<bolas.length; i++)
      {
        

        for (let j=0; j<bolas.length; j++)
            if (i!=j) bolas[i].colisiona(bolas[j]);
        
            bolas[i].mueve(tamanoSVG.width, tamanoSVG.height);
          bolas[i].dibuja();
      }
      elId = window.requestAnimationFrame(loop);
  }


