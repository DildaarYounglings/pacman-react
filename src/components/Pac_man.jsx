import React, { useEffect, useRef, useState } from "react";

export const Canvas = function () {
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
  const canvasRef = useRef(null);
  const contextRef = useRef();
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
  const keys = {
    w: { pressed: false },
    a: { pressed: false },
    s: { pressed: false },
    d: { pressed: false },
  };
  const keyRef = useRef(keys);
  const lastKeyRef = useRef();
  const [refreshValue, setRefreshValue] = useState({ b: "null" });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
    const context = canvas.getContext("2d");
    contextRef.current = context;
    //         generating map boundaries        //
    const boundaries = [];
    playerRef.current = player;
    function animate() {
      window.requestAnimationFrame(animate);
      contextRef.current.clearRect(0, 0, canvas.height, canvas.width);
      boundaries.forEach((boundary) => {
        boundary.draw()
        if (playerRef.current.position.y - playerRef.current.radius <= boundary.position.y + boundary.height && playerRef.current.position.x + playerRef.current.radius >= boundary.position.x && playerRef.current.position.y + playerRef.current.radius >= boundary.position.y && playerRef.current.position.x - playerRef.current.x <= boundary.position.x + boundary.width)
        {
          playerRef.current.velocity.x = 0;
          playerRef.current.velocity.y = 0;
          console.log(collision.current);
        }
      });
      // movement //
      playerRef.current.rerender();
      playerRef.current.velocity.x = 0;
      playerRef.current.velocity.y = 0;
      if (keyRef.current.w.pressed && lastKeyRef.current === 'w') {
        playerRef.current.velocity.y = -1;
      }else if (keyRef.current.a.pressed && lastKeyRef.current === 'a') {
        playerRef.current.velocity.x = -1;
      }else if (keyRef.current.s.pressed && lastKeyRef.current === 's') {
        playerRef.current.velocity.y = 1;
      }else if (keyRef.current.d.pressed && lastKeyRef.current === 'd') {
        playerRef.current.velocity.x = 1;
      }
    }
    animate();
    keyRef.current = keys;
    const map = [
      ["-","-","-","-","-","-","-","-","-"],
      ["-"," "," "," "," "," "," "," ","-"],
      ["-"," "," "," "," "," "," "," ","-"],
      ["-"," "," "," "," "," "," "," ","-"],
      ["-","-","-","-","-","-","-","-","-"],
    ];
    map.forEach((row, i) => {
      row.forEach((symbol, j) => {
        switch (symbol) {
          case "-":
            boundaries.push(
              new Boundary({
                position: { x: Boundary.width * j, y: Boundary.height * i },
              })
            );
            break;
          case " ":
            break;
        }
      });
    });

    window.addEventListener("keydown", ({ key }) => {
      switch (key) {
        case "w":
          keyRef.current.w.pressed = true;
          lastKeyRef.current = 'w';
          //console.log(`w:{pressed:${keyRef.current.w.pressed}}`);
          break;
        case "a":
          keyRef.current.a.pressed = true;
          lastKeyRef.current = 'a';
          //console.log(`a:{pressed:${keyRef.current.a.pressed}}`);
          break;
        case "s":
          keyRef.current.s.pressed = true;
          lastKeyRef.current = 's';
          //console.log(`s:{pressed:${keyRef.current.s.pressed}}`);
          break;
        case "d":
          keyRef.current.d.pressed = true;
          lastKeyRef.current = 'd';
          //console.log(`d:{pressed:${keyRef.current.d.pressed}}`);
          break;
      }
    });
    window.addEventListener("keyup", ({ key }) => {
      switch (key) {
        case "w":
          keyRef.current.w.pressed = false;
          //console.log(`w:{pressed:${keyRef.current.w.pressed}}`);
          break;
        case "a":
          keyRef.current.a.pressed = false;
          //console.log(`a:{pressed:${keyRef.current.a.pressed}}`);
          break;
        case "s":
          keyRef.current.s.pressed = false;
          //console.log(`s:{pressed:${keyRef.current.s.pressed}}`);
          break;
        case "d":
          keyRef.current.d.pressed = false;
          //console.log(`d:{pressed:${keyRef.current.d.pressed}}`);
          break;
      }
    });
  }, []);
  //              functions             //
  const drawFunction = () => {
    contextRef.current.fillStyle = "blue";
    contextRef.current.fillRect(
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );
  };

  return <canvas ref={canvasRef} />;
};
