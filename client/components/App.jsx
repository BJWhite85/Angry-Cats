import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, ambientLight, pointLight, useThree, useLoader } from '@react-three/fiber';
import * as FIBER from '@react-three/drei';
import * as THREE from 'three';
import { useKeyState } from 'use-key-state'
import { Physics, usePlane, useBox } from "@react-three/cannon";
import { TextureLoader } from 'three/src/loaders/TextureLoader'
import CatLives from './CatLives.jsx';
import GameOver from './GameOver.jsx';
import { useGLTF } from '@react-three/drei';



// This function makes the ground
function Plane(props) {
  const [ref] = usePlane(() => ({ rotation: [-Math.PI / 2, 0, 0], ...props }))
  const texture = useLoader(TextureLoader, 'textures/grass3.png');
  if (texture) {
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(35, 35);
    texture.anisotropy = 16;
  }
  return (
    <mesh ref={ref}>
      <planeGeometry args={[500, 500]} />
      <meshPhongMaterial attach="material" map={texture} />
    </mesh>
  )
}

// This function makes the boxes
let Testscore = 0
function PhyBox(props) {
  const [ref, api] = useBox(() => ({
    onCollide: () => {
      Testscore += 50;
    },
    sleepSpeedLimit: 1,
    args: [5, 5, 5],
    mass: .5,
    ...props
  }));
  const texture = useLoader(TextureLoader, 'textures/crate2.png');
  if (texture) {
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    //texture.repeat.set(1);
    texture.anisotropy = 16;
  }

  return (
    <FIBER.Box
      args={[5, 5, 5]}
      ref={ref}
      color={"brown"}>
      <meshPhongMaterial attach="material" map={texture} />
    </FIBER.Box>
  );
}

// This will set the power level of the launched cat

const Slider = (props) => {
  const [power, setPower] = useState(500)
  const adjustPower = (e) => {
    e.preventDefault();
    setPower(e.target.value)
  }
  return (

    <input type="range" min="900" max="3500" value={power} className="slider" id="myRange" onChange={adjustPower} />
  )
}

// This will set the angle of the launched cat

const SliderAngle = (props) => {
  const [angle, setAngle] = useState(0)
  const adjustAngle = (e) => {
    setAngle(e.target.value)
  }
  return (
    <input type="range" min="0" max="500" value={angle} className="slider2" id="myRange2" onChange={adjustAngle} />
  )
}

// This will change direction of launched cat

const SliderDirection = (props) => {
  const [direction, setDirection] = useState(0)
  const adjustDirection = (e) => {
    setDirection(e.target.value)
  }
  return (
    <input type="range" min="-1500" max="1500" value={direction} className="slider3" id="myRange3" onChange={adjustDirection} />
  )
}

const App = () => {
  //console.log(Testscore);
  const [catLives, setCatLives] = useState([1, 1, 1]);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [play, setPlay] = useState(false);
  const [camera, setCamera] = useState({ position: [-50, 30, 0], near: 0.1, far: 400, fov: 65 })

  const count = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const count2 = [5, 10, 15, 20];


  function playMusic() {
    var music = new Audio('C_Meow.mp3');
    music.play();
  }

  // ---------------------
  const CatModel = ({ ...props }) => {
    const [ref, api] = useBox(() => ({
      sleepSpeedLimit: 0,
      args: [2, 2.9, 2],
      mass: 20,
      ...props
    }));

    const { nodes, materials } = useGLTF('/cat.glb')
    const { a, d } = useKeyState({ a: 'a', d: 'd' })
    const [catZ, setCatZ] = useState(props.position[0]);

    useEffect(() => {
      if (play) {
        if (a.down) {
          setCatZ(catZ - 2)
          //api.position.set(0, 1.4, catZ)
        }
        if (a.up) {
          api.position.set(0, 1.4, catZ)
        }
      }
    }, [a])

    useEffect(() => {
      if (play) {
        if (d.down) {
          setCatZ(catZ + 2);
          //api.position.set(0, 1.4, catZ)
        }
        if (d.up) {
          api.position.set(0, 1.4, catZ)
        }
      }
    }, [d])

    const launchCat = () => {

      let power = document.getElementById('myRange').value
      let angle = document.getElementById('myRange2').value
      let direction = document.getElementById('myRange3').value

      if (play) {
        playMusic();
        api.applyImpulse([power, angle, direction], [0, 0, 0]);
        setTimeout(() => {
          api.velocity.set(0, 0, 0)
        }, 4000);
        setTimeout(() => {
          api.rotation.set(0, 0, 0);
          api.position.set(0, 1.5, 0);
          if (catLives.length === 3) {
            setCatLives([1, 1]);
          } else if (catLives.length === 2) {
            setCatLives([1]);
          } else if (catLives.length === 1) {
            setCatLives([])
          }
        }, 8500)
        // setTimeout(() => {
        //   setCatLaunched(true);
        // }, 1500)
      }
      //setCatLaunched(true);
    }

    return (
      <group ref={ref} {...props} dispose={null} onClick={launchCat}>
        <mesh geometry={nodes.Quad_Sphere.geometry} material={materials.Material} />
      </group>
    )
  }
  useGLTF.preload('/cat.glb')
  // This will display the score
  const Score = () => {
    return (
      <div id="scoreContainer">
        <div id="score">Score {Testscore}</div>
      </div>
    )
  }
  // This will activate the game and make cat clickable and lives appear
  const playGame = () => {
    setPlay(true);
    Testscore = 0;
  }

  return (
    <div>
      <Canvas camera={camera} >
        <FIBER.OrbitControls />
        {/* <FIBER.Sky azimuth={1} /> */}
        <FIBER.Stars />
        <ambientLight intensity={0.2} />
        <pointLight position={[20, 10, 150]} />
        <pointLight position={[-200, 25, -250]} />
        <Physics allowSleep={true} >
          {/* <FIBER.Cloud position={[2,9,2]}/> */}
          {/* {count.map((num, i) => (
            <FIBER.Cloud key={i} position={[Math.random() * 50, 25, (Math.random() * 25)]} />
          ))} */}
          {count2.map((num, i) => (
            <>
              <PhyBox key={i} position={[num + 50, 2.5, 0]} />
              <PhyBox key={i + 50} position={[num + 50, 2.5, 6]} />
              <PhyBox key={i + 70} position={[num + 50, 2.5, -6]} />
              <PhyBox key={i + 90} position={[num + 50, 7.5, 3]} />
              <PhyBox key={i + 100} position={[num + 50, 7.5, -3]} />
              <PhyBox key={i + 120} position={[num + 50, 12.5, 0]} />
            </>
          ))}
          {count2.map((num, i) => (
            <>
              <PhyBox key={i + 400} position={[num + 50, 2.5, 40]} />
              <PhyBox key={i + 550} position={[num + 50, 2.5, 46]} />
              <PhyBox key={i + 630} position={[num + 50, 2.5, 34]} />
              <PhyBox key={i + 750} position={[num + 50, 7.5, 37]} />
              <PhyBox key={i + 870} position={[num + 50, 7.5, 43]} />
              <PhyBox key={i + 990} position={[num + 50, 12.5, 40]} />
            </>
          ))}
          {count2.map((num, i) => (
            <>
              <PhyBox key={i + 1000} position={[num + 50, 2.5, -40]} />
              <PhyBox key={i + 1150} position={[num + 50, 2.5, -46]} />
              <PhyBox key={i + 1230} position={[num + 50, 2.5, -34]} />
              <PhyBox key={i + 1350} position={[num + 50, 7.5, -37]} />
              <PhyBox key={i + 1470} position={[num + 50, 7.5, -43]} />
              <PhyBox key={i + 1590} position={[num + 50, 12.5, -40]} />
            </>
          ))}
          {count2.map((num, i) => (
            <>
              <PhyBox key={i + 2000} position={[num + 150, 2.5, -92]} />
              <PhyBox key={i + 3000} position={[num + 150, 2.5, -86]} />
              <PhyBox key={i + 4150} position={[num + 150, 2.5, -80]} />
              <PhyBox key={i + 5230} position={[num + 150, 2.5, -74]} />
              <PhyBox key={i + 6350} position={[num + 150, 7.5, -89]} />
              <PhyBox key={i + 7350} position={[num + 150, 7.5, -83]} />
              <PhyBox key={i + 8470} position={[num + 150, 7.5, -77]} />
              <PhyBox key={i + 9590} position={[num + 150, 12.5, -86]} />
              <PhyBox key={i + 10590} position={[num + 150, 12.5, -80]} />
              <PhyBox key={i + 11590} position={[num + 150, 17.5, -83]} />
            </>
          ))}
          {count2.map((num, i) => (
            <>
              <PhyBox key={i + 12000} position={[num + 150, 2.5, 92]} />
              <PhyBox key={i + 13000} position={[num + 150, 2.5, 86]} />
              <PhyBox key={i + 14150} position={[num + 150, 2.5, 80]} />
              <PhyBox key={i + 15230} position={[num + 150, 2.5, 74]} />
              <PhyBox key={i + 16350} position={[num + 150, 7.5, 89]} />
              <PhyBox key={i + 17350} position={[num + 150, 7.5, 83]} />
              <PhyBox key={i + 18470} position={[num + 150, 7.5, 77]} />
              <PhyBox key={i + 19590} position={[num + 150, 12.5, 86]} />
              <PhyBox key={i + 20590} position={[num + 150, 12.5, 80]} />
              <PhyBox key={i + 21590} position={[num + 150, 17.5, 83]} />
            </>
          ))}
          {count2.map((num, i) => (
            <>
              <PhyBox key={i + 22000} position={[num + 150, 2.5, -12]} />
              <PhyBox key={i + 23000} position={[num + 150, 2.5, -6]} />
              <PhyBox key={i + 24000} position={[num + 150, 2.5, 0]} />
              <PhyBox key={i + 25150} position={[num + 150, 2.5, 6]} />
              <PhyBox key={i + 26230} position={[num + 150, 2.5, 12]} />
              <PhyBox key={i + 27350} position={[num + 150, 7.5, -9]} />
              <PhyBox key={i + 28350} position={[num + 150, 7.5, -3]} />
              <PhyBox key={i + 29470} position={[num + 150, 7.5, 3]} />
              <PhyBox key={i + 30470} position={[num + 150, 7.5, 9]} />
              <PhyBox key={i + 31590} position={[num + 150, 12.5, -6]} />
              <PhyBox key={i + 32590} position={[num + 150, 12.5, 0]} />
              <PhyBox key={i + 33590} position={[num + 150, 12.5, 6]} />
              <PhyBox key={i + 34590} position={[num + 150, 17.5, -3]} />
              <PhyBox key={i + 35590} position={[num + 150, 17.5, 3]} />
              <PhyBox key={i + 36590} position={[num + 150, 22.5, 0]} />
            </>
          ))}
          <Plane />
          <CatModel position={[0, 1.5, 0]} />
        </Physics>
      </Canvas>
      <Slider />
      <SliderAngle />
      <SliderDirection />
      <div id="livesContainer">
        {catLives.length > 0 && play ? catLives.map((element, i) => (
          <CatLives key={i} />)) : null}
      </div>
      <div id="playContainer">
        {!play ? <button id="play" onClick={playGame}>Play</button> : null}
      </div>
      <Score score={Testscore} />
      {catLives.length === 0 ? <GameOver score={Testscore} /> : null}
      <div id="lables">
        <span id="powerlabel">Power</span>
        <span id="anglelabel">Angle</span>
        <span id="directionlabel">Direction</span>
      </div>
    </div>
  );
}

export default App;