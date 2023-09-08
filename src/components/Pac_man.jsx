import React, { useEffect, useRef, useState } from "react";












export const Canvas = function () {
  //           classes             //
  class Boundary {
    static width = 40;
    static height = 40;
    constructor({ position }) {
      this.position = position;
      this.width = 40;
      this.height = 40;
    }
    draw() {
      contextRef.current.fillStyle = "blue";
      contextRef.current.fillRect(
        this.position.x,
        this.position.y,
        this.width,
        this.height
      );
    }
  }
  
  class Player {
    constructor({ position, velocity }) {
      this.position = position;
      this.velocity = velocity;
      this.radius = 15;
    }
    draw() {
      contextRef.current.beginPath();
      contextRef.current.arc(
        this.position.x,
        this.position.y,
        this.radius,
        0,
        Math.PI * 2
      );
      contextRef.current.fillStyle = "yellow";
      contextRef.current.fill();
      contextRef.current.closePath();
    }
    rerender() {
      this.draw();
      this.position.x += this.velocity.x;
      this.position.y += this.velocity.y;
    }
  }
//------------------------------------------//
//                 state                  //
  const canvasRef = useRef(null);
  const contextRef = useRef();
  const mapRef = useRef([
    ['-','-','-','-','-','-','-'],
    ['-',' ',' ',' ',' ',' ','-'],
    ['-',' ','-',' ','-',' ','-'],
    ['-',' ',' ',' ',' ',' ','-'],
    ['-',' ','-',' ','-',' ','-'],
    ['-',' ',' ',' ',' ',' ','-'],
    ['-','-','-','-','-','-','-']
  ]);
  const boundariesRef = useRef([]);
  const player = new Player({
    position: {
      x: Boundary.width + Boundary.width / 2,
      y: Boundary.height + Boundary.height / 2,
    },
    velocity: {
      x: 0,
      y: 0,
    },
  });
  const playerRef = useRef(player);
  const boundaryRef = useRef();
  const keys = {
    w: { pressed: false },
    a: { pressed: false },
    s: { pressed: false },
    d: { pressed: false },
  };
  const keyRef = useRef(keys);
  const [lastKey,set_lastKey] = useState("");

  //                           functions                            //
  function resetPlayer(){
    playerRef.current.velocity.y = 0;
    playerRef.current.velocity.x = 0;
  }
  function circleCollidesWithRectangle({circle,rectangle}){
    return(
      circle.position.y - circle.radius + circle.velocity.y <= rectangle.position.y + rectangle.height && 
      circle.position.x + circle.radius + circle.velocity.x >= rectangle.position.x &&
      circle.position.y + circle.radius + circle.velocity.y >= rectangle.position.y &&
      circle.position.x - circle.radius + circle.velocity.x <= rectangle.position.x + rectangle.width
    )
  }
  function _useEffect(){
    const canvas = canvasRef.current;
    canvasRef.current.width = window.innerWidth;
    canvasRef.current.height = window.innerHeight;
    const context = canvas.getContext("2d");
    contextRef.current = context;
    mapRef.current.forEach((row,rowIndex) => {
      row.forEach((symbol,symbolIndex) => {
        //console.log(symbol);
        switch(symbol)
        {
          case '-':
            boundariesRef.current.push(new Boundary({position:{x:symbolIndex * Boundary.width,y:rowIndex * Boundary.height}}))
            break;
        }
      })
    })
    function animate(){
      window.requestAnimationFrame(animate);
      if(keyRef.current.w.pressed && lastKey === 'w'){
        for(let i = 0;i < boundariesRef.current.length;i++){
          const boundaries = boundariesRef.current;
          const boundary = boundaries[i];
          if(circleCollidesWithRectangle({circle:{...playerRef.current,velocity:{x: 0,y: -1}}, rectangle:boundary})){
            playerRef.current.velocity.y = 0;
            break;
          }else{
            playerRef.current.velocity.y = 0;
            playerRef.current.velocity.y = -1;
          }
        }
      }else if(keyRef.current.a.pressed && lastKey === 'a'){
        for(let i = 0;i < boundariesRef.current.length;i++){
          const boundaries = boundariesRef.current;
          const boundary = boundaries[i];
          if(circleCollidesWithRectangle({circle:{...playerRef.current,velocity:{x: -1,y:0}}, rectangle:boundary})){
            playerRef.current.velocity.x = 0;
            break;
          }else{
            playerRef.current.velocity.x = 0
            playerRef.current.velocity.x = -1
          }
        }
      }else if(keyRef.current.s.pressed && lastKey === 's'){
        for(let i = 0;i < boundariesRef.current.length;i++){
          const boundaries = boundariesRef.current;
          const boundary = boundaries[i];
          if(circleCollidesWithRectangle({circle:{...playerRef.current,velocity:{x: 0,y: 1}}, rectangle:boundary})){
            playerRef.current.velocity.y = 0;
            break;
          }else{
            playerRef.current.velocity.y = 0
            playerRef.current.velocity.y = 1
          }
        }
      }else if(keyRef.current.d.pressed && lastKey === 'd'){
        for(let i = 0;i < boundariesRef.current.length;i++){
          const boundaries = boundariesRef.current;
          const boundary = boundaries[i];
          if(circleCollidesWithRectangle({circle:{...playerRef.current,velocity:{x: 1,y:0}}, rectangle:boundary})){
            playerRef.current.velocity.x = 0;
            break;
          }else{
            playerRef.current.velocity.x = 0
            playerRef.current.velocity.x = 1
          }
        }
      }
      contextRef.current.clearRect(0,0,canvasRef.current.width,canvasRef.current.height);
      boundariesRef.current.forEach((boundary) => {
        boundary.draw();
        circleCollidesWithRectangle({circle:playerRef.current, rectangle:boundary})? resetPlayer():"";
      })
      playerRef.current.rerender()
      //playerRef.current.velocity.y = 0
      //playerRef.current.velocity.x = 0
    }
    animate()
    window.addEventListener('keydown',({key}) => {
      switch(key)
      {
        case 'w':
          keyRef.current.w.pressed = true;
          set_lastKey('w');
          break;
        case 'a':
          keyRef.current.a.pressed = true;
          set_lastKey('a');
          break;
        case 's':
          keyRef.current.s.pressed = true;
          set_lastKey('s');
          break;
        case 'd':
          keyRef.current.d.pressed = true;
          set_lastKey('d');
          break;
      }
      //console.log(keyRef.current.w);
    });
    window.addEventListener('keyup',({key}) => {
      switch(key)
      {
        case 'w':
          keyRef.current.w.pressed = false;
          break;
        case 'a':
          keyRef.current.a.pressed = false;
          break;
        case 's':
          keyRef.current.s.pressed = false;
          break;
        case 'd':
        keyRef.current.d.pressed = false;
          break;
      }
      //console.log(keyRef.current.w)
    });
  }
  useEffect(()=>{
    _useEffect();
  })
  return(<canvas ref={canvasRef} />);
};

















export const RectangularCollisionDetection = () => {
  const cavasElRef = useRef();
  const contextRef = useRef();
  const mouseRef = useRef({x: window.innerWidth /2,y: window.innerHeight /2});


  function animate() {
    window.requestAnimationFrame(animate);
    contextRef.current.fillStyle = '#1A1A23';
    contextRef.current.fillRect(0,0,cavasElRef.current.width,cavasElRef.current.height);
    contextRef.current.fillStyle = 'red';
    contextRef.current.fillRect(mouseRef.current.x,mouseRef.current.y,100,100);
    contextRef.current.fillStyle = 'blue';
    contextRef.current.fillRect(cavasElRef.current.width / 2 - 50,cavasElRef.current.height / 2 - 50,100,100);

    if(mouseRef.current.x + 100 > cavasElRef.current.width / 2 - 50 &&
      mouseRef.current.x < cavasElRef.current.width / 2 - 50 + 100 && 
      mouseRef.current.y + 100 > cavasElRef.current.height / 2 - 50 && 
      mouseRef.current.y < cavasElRef.current.height / 2 - 50 + 100
      )
    {
      console.log('collosion');
    }
  }
  function returnMousePosition(e){
    mouseRef.current = {x: e.clientX,y: e.clientY}
    //console.log(mouseRef.current);
  }
  useEffect(() => {
    // setting canvas context //
    cavasElRef.current.width = window.innerWidth;
    cavasElRef.current.height = window.innerHeight
    const canvas = cavasElRef.current;
    contextRef.current = canvas.getContext("2d");
    // animation loop function //
    animate();
    // drawing on canvas //

  })
  return(
    <canvas ref={cavasElRef} onMouseMove={(event) => returnMousePosition(event)}></canvas>
  )
}
