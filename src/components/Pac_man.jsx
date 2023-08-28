import React, { useEffect, useRef, useState } from 'react'

export const Canvas = function(){
  const canvasRef = useRef(null);
  const [playerVelocity,setPlayerVelocity] = useState({x:0,y:0})
  useEffect(
    () => {
      // both the if and the turnary statement check if the value is null
      const canvas = canvasRef? canvasRef.current : null;
      if(!canvas){
        return;
      }
      canvas.height = window.innerHeight;
      canvas.width = window.innerWidth;
      const c = canvas.getContext('2d');
      // create a class to be used //
      class Player{
        static radius = 10
        constructor({position,velocity}){
          this.position = position
          this.velocity = velocity
          this.radius = 15
        }
        draw(){
          c.beginPath();
          c.arc(this.position.x,this.position.y,this.radius,0,Math.PI * 2);
          c.fillStyle = 'yellow';
          c.fill();
          c.closePath();
        }
      }
      class Boundary{
        static width = 40
        static height = 40
        constructor({position}){
          this.position = position;
          this.width = 40;
          this.height = 40
        }
        draw(){
          c.fillStyle = 'blue'
          c.fillRect(
            this.position.x,
            this.position.y,
            this.width,
            this.height
          );
        }
      }
      // below  is a tile map
      const map = [
        ['-','-','-','-','-','-'],
        ['-',' ',' ',' ',' ','-'],
        ['-',' ',' ',' ',' ','-'],
        ['-',' ','-','-',' ','-'],
        ['-',' ',' ',' ',' ','-'],
        ['-',' ',' ',' ',' ','-'],
        ['-','-','-','-','-','-'],
      ]
      // is where all boundaries will be stored
      const boundaries = [
      ]
      // a Player
      const player = new Player(
        {
          position:{
            x:Boundary.width + Boundary.width /2 ,y:Boundary.height + Boundary.height /2
          }
          ,playerVelocity
        }
      )
      // this bellow is used to iterate over the map
      map.forEach(
        (row,rowIndex) => {
          row.forEach(
            (symbol, symbolIndex) => {
              switch(symbol){
                case '-':
                  boundaries.push(
                    new Boundary(
                      {
                        position:{
                          x:Boundary.width * symbolIndex,
                          y:Boundary.height * rowIndex
                        }
                      }
                    )
                  )
                break;
                case ' ': 
                break;
              }
            }
          )
        }
      )
      boundaries.forEach(
        boundry => {
          boundry.draw()
        }
      );
      player.draw();
      window.addEventListener('keydown',({key}) => 
        {
          switch(key)
          {
            case 'w':
              setPlayerVelocity(
                {
                  ...player.velocity,
                  y: playerVelocity.y - 1
                }
              );
            break;
            case 'a':
              setPlayerVelocity(
                {
                  ...player.velocity,
                  x: player.velocity.x - 1
                }
              );
            break;
            case 's':
              setPlayerVelocity(
                {
                  ...player.velocity,
                  y: player.velocity.y + 1
                }
              );
            break;
            case 'd': 
            setPlayerVelocity(
              {
                ...player.velocity,
                x: player.velocity.x + 1
              }
            );
            break;
          }
        }
        )
        console.log(playerVelocity);
    },
    [playerVelocity]
  )
  return (
    <canvas ref={canvasRef}/>
  )
}

