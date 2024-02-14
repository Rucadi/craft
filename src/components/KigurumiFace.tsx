import { useEffect, useRef, } from 'react'
import { ThreeElements } from '@react-three/fiber'
import { useLoader } from '@react-three/fiber'
import { GLTFLoader } from 'three-stdlib'
import * as THREE from 'three'
import { LoopSubdivision } from 'three-subdivide'
import { DRACOLoader } from 'three-stdlib'

export const loadDRACOModel = (loader: any) => {
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath('/draco/');
  dracoLoader.preload();
  loader.setDRACOLoader(dracoLoader);
}

const KigurumiFace = (props: ThreeElements['mesh'] & {
  shapeValues?: number[],
  faceModelUrl?: string,
  color?: string,
  refreshMeshForDownload: number,
  setMeshForDownload: (mesh: any) => void,
  setKigurumiMorphTargetDictionary?: (labels: string[] | any) => void,
}) => {

  const {
    shapeValues = [0],
    faceModelUrl,
    setKigurumiMorphTargetDictionary,
    refreshMeshForDownload,
    setMeshForDownload
  } = props;

  const ref = useRef<ThreeElements['primitive']>(null!);

  const cubeGeometry: any = useLoader(GLTFLoader, faceModelUrl || '/cube.glb',);

  useEffect(() => {
    ref.current.children[0].morphTargetInfluences = shapeValues;
    ref.current.children[0].material.color = new THREE.Color(props.color || "#f3c4bf");
  }, [shapeValues, props.color]);

  useEffect(() => {
    setMeshForDownload(ref.current.children[0].geometry);
  }, [refreshMeshForDownload]);

  useEffect(() => {
    // morphTargetDictionary to set labels
    setKigurumiMorphTargetDictionary
      && setKigurumiMorphTargetDictionary(cubeGeometry.scene.children[0].morphTargetDictionary);

    ref.current.children[0].geometry = LoopSubdivision
      .modify(cubeGeometry.scene.children[0].geometry, 2, {
        split: true,       // optional, default: true
        uvSmooth: false,      // optional, default: false
        preserveEdges: false,      // optional, default: false
        flatOnly: false,      // optional, default: false
        maxTriangles: Infinity,   // optional, default: Infinity
      })
  }, []);

  return <mesh {...props}>
    {props.children}
    <primitive object={cubeGeometry.scene} ref={ref} />
  </mesh>

}

export default KigurumiFace;