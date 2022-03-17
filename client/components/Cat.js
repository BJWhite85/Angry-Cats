import React, { useRef, useState, useEffect } from 'react';
import { useGLTF } from '@react-three/drei';
import { useBox } from '@react-three/cannon';
import { useKeyState } from 'use-key-state';
import { useFrame } from '@react-three/fiber';
import { catPositionState } from "./gameState";
import { useRecoilState, RecoilRoot } from "recoil";
import { livesState } from './gameState.js';

export default function CatModel({ ...props }) {
  console.log(props);

  const [ref, api] = useBox(() => ({
    args: [2, 2.9, 2],
    mass: 20,
    ...props
  }));


  const { nodes, materials } = useGLTF('/cat.glb')
  const { a, d } = useKeyState({ a: 'a', d: 'd' })
  const [catZ, setCatZ] = useState(props.position[0]);
  const [catLaunched, setLaunched] = useState(false);
  //const [catLives, setCatLives] = useRecoilState(livesState);
  //const [catPosition, setCatPosition] = useRecoilState(catPositionState);

  useEffect(() => {
    if (a.down) {
      setCatZ(catZ - 2)
      api.position.set(0, 1.4, catZ)
    }
    if (a.up) {
      api.position.set(0, 1.4, catZ)
    }
  }, [a])

  useEffect(() => {
    if (d.down) {
      setCatZ(catZ + 2);
      api.position.set(0, 1.4, catZ)
    }
    if (d.up) {
      api.position.set(0, 1.4, catZ)
    }
  }, [d])


  const launchCat = () => {
    api.applyImpulse([1600, 2, 0], [0, 0, 0])
    setTimeout(() => {
      api.velocity.set(0, 0, 0)
    }, 5000);
    setTimeout(() => {
      api.rotation.set(0, 0, 0)
      api.position.set(0, 1.5, 0)
      //props.lives.current = [1,1];
    }, 8500)
  }


  //const move = useRef()
  //console.log('api', api);

  //useFrame(() => (api.lives([1,1])))
  // () => api.applyImpulse([1600, 2, 0], [0, 0, 0])
  return (
    <RecoilRoot>
      <group ref={ref} {...props} dispose={null} onClick={launchCat}>
        <mesh geometry={nodes.Quad_Sphere.geometry} material={materials.Material} />
      </group>
    </RecoilRoot>
  )
}

useGLTF.preload('/cat.glb')
