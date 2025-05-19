import { Box, Environment, OrbitControls, PerspectiveCamera, Plane, Sphere, Texture } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import React, { useEffect, useRef, useState, useMemo, Suspense } from "react";
import { View } from "react-native";
import { Image, StyleSheet, Platform } from 'react-native';

import { useLoader } from "@react-three/fiber";
import { MathUtils, MeshStandardMaterial, TextureLoader, Vector3, Ray, AnimationMixer } from "three"; 

import { Asset } from 'expo-asset';
//import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

import { useGLTF } from '@react-three/drei/native'
//import { GLTFLoader } from "@/node_modules copy/three-stdlib";
//import { PerspectiveCamera } from "@/node_modules copy/@react-three/drei";
/* import { group } from "@/node_modules copy/@types/yargs";
import { current } from "@/node_modules copy/@react-native-community/cli-tools/build/releaseChecker"; */
import { GLTFLoader } from "three-stdlib";
import { grey100 } from "react-native-paper/lib/typescript/styles/themes/v2/colors";
import { useNavigation } from "@react-navigation/native";
import SoundLevel from 'react-native-sound-level';



interface RoomProps {}

const BlenderModel = ({ position }: { position: [number, number, number] }) => {
  const [modelReady, setModelReady] = useState(false); //This ensures that a placeholder is in place if the Asset hasn't loaded yet, in the return
  const earth = Asset.fromModule(require('../assets/emmo.glb')).uri;
  const navigation = useNavigation();

  const [modelSize, setModelSize] = useState(1);
  const [boxLength, setBoxLength] = useState(0.2);

  const { scene, animations } = useLoader(GLTFLoader, earth);

  const boxRef = useRef();

  // Makes Emmo bigger by blowing...
  useEffect(()=> {

    if(SoundLevel){
      SoundLevel.start();

      SoundLevel.onNewFrame = (data) => {
        const soundLevel = data.value;

        if(soundLevel > -10) {

          //setModelSize((prevSize) => Math.min(prevSize + 0.1, 2));
          setBoxLength(prevLength => Math.min(prevLength + 0.02, 2))
        } else {
          //setModelSize((prevSize) => Math.max(prevSize - 0.02, 1))
          setBoxLength(prevLength => Math.max(prevLength - 0.006, 0.2))
        }
      }
    }

  }, [])

  useEffect(() => {
    if (scene) {
      setModelReady(true); // Model is loaded and ready
    }
  }, [scene]);

  useFrame(() => {
    const time = performance.now() * 0.0055;
    if (boxRef.current) {
      boxRef.current.position.y = Math.cos(time) - 0.8 * 1.3;
    }
  });

  const mixer = useRef();

  useEffect(() => {
    console.log("animations length", animations.length);

    if (animations.length) {
      mixer.current = new AnimationMixer(scene);

      animations.forEach((clip) => {
        mixer.current.clipAction(clip).play();
      });
    }

    
  }, [animations, scene]);

  useFrame((state, delta) => {
    if (mixer.current) {
      mixer.current.update(delta);
    }
  });

  const handleClick = () => {
    alert("emmo");
  }

  return modelReady ? (
    <group ref={boxRef}>
      <primitive
      object={scene}
      
      position={position}
      scale={[modelSize, modelSize, modelSize]}
      rotation={[0, Math.PI + 6.2, 0]}
      onClick={handleClick}
      />
      <Sphere scale={[0.1, 0.1, boxLength]} position={[0.06, -0.42,-0.7]}>
        <meshStandardMaterial color={"orange"}></meshStandardMaterial>
      </Sphere>
    </group>
    
  ) : (
    <Box>
      <meshBasicMaterial color={"grey"}></meshBasicMaterial>
    </Box>
  );
};

const Earth = ({position} : {position : [number, number, number]}) => {
  const [modelReady, setModelReady] = useState(false);
  const earth = Asset.fromModule(require('../assets/earth.glb')).uri;

  const {scene, animations } = useLoader(GLTFLoader, earth);

  useEffect(()=> {
    if(scene) {
      setModelReady(true);
    }
  }, [scene]);

  const mixer = useRef();

  useEffect(() => {
    console.log("animations length", animations.length)

    if (animations.length) {
      console.log("animations length", animations.length)
      mixer.current = new AnimationMixer(scene);
      
      animations.forEach((clip) => {
        mixer.current.clipAction(clip).play();
      })
    }
  }, [animations, scene]);

  useFrame((state, delta) => {
    if(mixer.current) {
      mixer.current.update(delta);
    }
  });

  return modelReady ? (
    <primitive object={scene} position={position} />
  ) : (
  <Box position={position}>
    <meshStandardMaterial color={"black"}/>
  </Box>)
}

// isDragging as a prop, to enable it to interact with the parent Canvas where orbitControls are. The idea is to disable rotation of OrbitControls while dragging the object. 
const DraggableObject = ({isDragging, setIsDragging}) => {
  

  const groupRef = useRef();
  const meshRef = useRef();
  
  //const [isDragging, setIsDragging] = useState(false); // Track whether the object is being dragged
  const [dragStartPosition, setDragStartPosition] = useState([0, 0]); // Store the initial drag position
  const [objectPosition, setObjectPosition] = useState([0.75, 0, 0]); // Initial position of the object

  // makes movement more adjustable
  const movementScale = useMemo( () => 0.0025, []);

  // Handle the start of dragging
  const handlePointerDown = (event) => {
    setIsDragging(true);
    // Capture the initial position where the drag started (in world coordinates)
    setDragStartPosition([event.clientX, event.clientY]);
  };

  // Handle dragging motion, currently only X and Y axises are used, meaning the object can only be moved in 2d dimensions
  const handlePointerMove = (event) => {
    if (!isDragging) return; // Only move if we're currently dragging

    const deltaX = event.clientX - dragStartPosition[0];
    const deltaY = event.clientY - dragStartPosition[1];
    
    // Update the object's position based on mouse movement
    setObjectPosition((prevPosition) => {
      const newX = prevPosition[0] /*+*/- deltaX * movementScale/* 0.0025 */; // Scaling the movement to make it slower
      const newY = prevPosition[1] - deltaY * movementScale/* 0.002 */; // Negative because Y-axis is inverted in screen space -- works better with the X position too, at least in the current setup
      return [newX, newY, prevPosition[2]]; // Keep the Z position unchanged
    });

    // Update the drag start position to be the current position to track movement
    setDragStartPosition([event.clientX, event.clientY]);
  };

  // Handle the end of dragging
  const handlePointerUp = () => {
    setIsDragging(false); // Stop dragging
  };

  // Use useFrame to animate the object (if needed)
  useFrame(() => {
    if (groupRef.current) {
      // Update the position of the group (or object) to the new position
      groupRef.current.position.set(objectPosition[0], objectPosition[1], objectPosition[2]);
    }
  });

  return (
    <group
      ref={groupRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp} // Stop dragging if the pointer leaves the canvas
    >
      {/* The draggable object (e.g., a box) */}
      <mesh ref={meshRef} position={objectPosition}>
        <boxGeometry args={[1, 0.2, 0.2]} />
        <meshBasicMaterial color={isDragging ? "darkblue" : "blue"} />
      </mesh>
    </group>
  );
};

const RotatingAxle = () => {


  const skel = Asset.fromModule(require('../assets/model.glb')).uri;


  const model = useLoader(GLTFLoader, skel);


  const groupRef = useRef();
  const skelRef = useRef();


  /* useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.z += 0.1; // Rotate the axle (like a clock hand)
    }
  }); */

  // State to track the current target rotation either 0 or the currently set 45
  const [rotationTarget, setRotationTarget] = useState(45); // Initial target position (45 degrees)
  const [rotationInProgress, setRotationInProgress] = useState(false); // Flag to track rotation progress, to avoid triggering multiple clicks if rotation is ongoing

  // Convert degrees to radians because Three.js works with radians
  const degToRad = (degrees: number): number => {
    return degrees * (Math.PI / 180);
  };

  const handleClick = () => {
    if (rotationInProgress) return; // Prevent triggering rotation if it's still in progress

    // Start rotation and toggle target angle
    setRotationInProgress(true);
    const newTarget = rotationTarget === 45 ? 0 : 45;
    setRotationTarget(newTarget); // Update the new target angle
  };

  // Use useFrame to animate the rotation of the group
  useFrame(() => {
    if (rotationInProgress && groupRef.current) {
      // convert the target rotation to radians for Three.js
      const targetRotation = degToRad(rotationTarget);
      // get the current rotation of the group object (in radians)
      const currentRotation = groupRef.current.rotation.z;

      // Move smoothly towards the target
      const step = 0.05; // This is the speed of rotation (you can adjust it)

      // check if the current rotation is sufficiently far from the target, if the difference is more than a step away, initiate movement. Math.abs uses absolute values eg -5 is the same as 5. 
      if (Math.abs(currentRotation - targetRotation) > step) {
        // Rotate towards the target angle (clockwise or counter-clockwise)
        if (currentRotation < targetRotation) {
          groupRef.current.rotation.z += step;
        } else {
          groupRef.current.rotation.z -= step;
        }
      } else {
        // When the rotation is very close to the target, stop and correct the overshoot
        groupRef.current.rotation.z = targetRotation;
        setRotationInProgress(false); // Stop the rotation once the target is reached
      }
    }
  });

  /* const [isRotating, setIsRotating] = useState(false);
  const [rotationTarget, setRotationTarget] = useState(0);

  const handleClick = () => {
    setIsRotating(true);
    setRotationTarget(45);
  }




  const degToRad = (degrees: number): number => {
    return degrees * (Math.PI / 180);
  };

  let time = 0;
  const speed = 5;
  const angleRange = 45;
  const angleOffset = 2.1;

  useFrame(() => {
    if (isRotating && groupRef.current) {
      const elapsedTime = groupRef.current.rotation.z / degToRad(rotationTarget);
      if (elapsedTime < 1) {
        groupRef.current.rotation.z += degToRad(rotationTarget) * 0.05
      } else {
        setIsRotating(false);
      }
    }
  }) */

  let time = 0;
  const speed = 5;
  const angleRange = 45;
  const angleOffset = 2.1;

  // Use useFrame to animate the rotation of the group
  /* useFrame((state) => {
    const { clock } = state; // Get the clock from the state

    const time = clock.elapsedTime; // Time in seconds

    if (groupRef.current) {
      // Control the speed of oscillation by scaling time and limiting the angle range
      const oscillation = Math.sin(time * speed) * angleRange; // Adjust '0.5' for speed control (higher = faster)
      groupRef.current.rotation.z = degToRad(oscillation) + angleOffset; // Convert degrees to radians
    }
  }); */


  return (
    <group ref={groupRef} onClick={handleClick}>
    {/* The object representing the clock hand */}
    <mesh  position={[0.5, 0, 0]}>
      <boxGeometry args={[1, 0.2, 0.2]} />
      <meshBasicMaterial color="red" />
    </mesh>
   
  </group>
  )


}


const Ball = () => {

  const boxRef = useRef();

    // useFrame hook allows object boxRef, which is later passed on to the relevant model, a sphere, to continously move every frame between the desired positions (Math.cos(time))
    // and the desired axis('s)

    useFrame(() => {
      const time = performance.now() * 0.0055
      if (boxRef.current) {
        // Circular motion
        /* boxRef.current.position.x = Math.sin(time) * 1
        boxRef.current.position.z = Math.cos(time) * 1 */
        boxRef.current.position.y = Math.cos(time)-0.97 * 1.3
      }
    })

    
  const basketBall = Asset.fromModule(require('../assets/balldimpled.png')).uri;

  const basketballTexture = useLoader(TextureLoader, basketBall);



  const [clicked, setClicked] = useState<boolean>(false);

  const modelRef = useRef<any>();

  const handleClick = () => {
    setClicked(!clicked);
    alert('basketboll');
  }

  const modelMaterial = clicked
    ? {  opacity: 0.5, transparent: true } // Highlight when clicked
    : {  opacity: 1, transparent: false }; // Default state


  // change opacity on click
  /* useEffect(() => {
    if (boxRef.current) {
      boxRef.current.traverse((child: any) => {
        if (child.isMesh) {
          child.material = new MeshStandardMaterial(modelMaterial);
        }
      })
    }
  }, [clicked, modelMaterial]); */

  return (
    <>
      {/* (basket)Ball */}
      <Sphere ref={boxRef} position={[-0.1, -2.23, 2]} scale={[0.3, 0.3, 0.3]} onPointerDown={handleClick}>
          <meshStandardMaterial map={basketballTexture} />
        </Sphere>
    </>
  )

}

const Table: React.FC<{ position: [number, number, number], scale: [number, number, number], rotation: [number, number, number] }> = ({ position, scale, rotation }) => {


    /* const boxRef = useRef();

    const [speed, setSpeed] = useState(0.05);

    useFrame(() => {
      if (boxRef.current) {
        boxRef.current.position.x += speed}

        if(boxRef.current.position.x > 5 || boxRef.current.position.x < 5) {
          setSpeed(-speed)
        }
    })

    useFrame(() => {
      const time = performance.now() * 0.001
      if (boxRef.current) {
        // Circular motion
        boxRef.current.position.x = Math.sin(time) * 1
        boxRef.current.position.z = Math.cos(time) * 1
      }
    }) */

      // Above code is to make object Table move, back and forth first useFrame and circular second useFrame


  return (
    <group /* ref={boxRef} */ position={position} scale={scale} rotation={rotation} >
    
      <Box position={[-0.5, -2, 2]} args={[0.1, 1.3, 0.1]}>
          <meshStandardMaterial color="tan" />
      </Box>

      <Box position={[-2, -2, 2]} args={[0.1, 1.3, 0.1]}>
          <meshStandardMaterial color="tan" />
      </Box>

      <Box position={[-0.5, -2, 1]} args={[0.1, 1.3, 0.1]}>
        <meshStandardMaterial color="tan" />
      </Box>

      <Box position={[-2, -2, 1]} args={[0.1, 1.3, 0.1]}>
        <meshStandardMaterial color="tan" />
      </Box>

      <Box position={[-1.26, -1.4, 1.45]} args={[1.8, 0.1, 1.2]}>
        <meshStandardMaterial color={"tan"}/>
      </Box>

   </group>
  )

}

const Room: React.FC<RoomProps> = () => {

  const [isDragging, setIsDragging] = useState(false);

  // Load the image using Expo's Asset module
  const reactLogo = Asset.fromModule(require('../assets/images/partial-react-logo.png')).uri;

  const football = Asset.fromModule(require('../assets/football.jpg')).uri;

  //const drink = Asset.fromModule(require('../assets/drink.gif')).uri;
  const drink1 = Asset.fromModule(require('../assets/drink/drink1.png')).uri;
  const drink2 = Asset.fromModule(require('../assets/drink/drink2.png')).uri;
  const drink3 = Asset.fromModule(require('../assets/drink/drink3.png')).uri;
  const drink4 = Asset.fromModule(require('../assets/drink/drink4.png')).uri;
  const irma = Asset.fromModule(require("../assets/irma2.jpg")).uri;

  // Load the texture using the URI
  const texture = useLoader(TextureLoader, reactLogo);

  const footballTexture = useLoader(TextureLoader, football);

  //const drinkGif = useLoader(TextureLoader, drink);
  //drinkGif.needsUpdate = true;

  const drinkImage1 = useLoader(TextureLoader, drink1);
  const drinkImage2 = useLoader(TextureLoader, drink2);
  const drinkImage3 = useLoader(TextureLoader, drink3);
  const drinkImage4 = useLoader(TextureLoader, drink4);

  const leader = useLoader(TextureLoader, irma);


  // Load models using the URI
  const skel = Asset.fromModule(require('../assets/model.glb')).uri;

  const pistol = Asset.fromModule(require('../assets/Pistol.glb')).uri;

  const toilet = Asset.fromModule(require('../assets/toilet.gltf')).uri;

  const emmo = Asset.fromModule(require('../assets/untitled.glb')).uri;

  
  /* const mixer = new AnimationMixer(scene);
  animations.forEach((clip) => {
    mixer.clipAction(clip).play();
  }); */
  



  //const {scene, animations } = useGLTF('../assets/untitled.glb');
  
  /* const {scene, animations} = useLoader(GLTFLoader, emmo);

  const mixer = new AnimationMixer(scene);
  animations.forEach((clip) => {
    mixer.clipAction(clip).play();
  }); */

  
  

  const model = useLoader(GLTFLoader, skel);

  const model2 = useLoader(GLTFLoader, pistol);

  const model3 = useLoader(GLTFLoader, toilet);

  const model4 = useLoader(GLTFLoader, emmo);

    //const model = useGLTF('../assets/model.glb');




    // state for alternating between texture
    const [currentTexture, setCurrentTexture] = useState(drinkImage1);

    // useEffect for alternating between the given images and setting them into the currentTexture useState. Alternate between 1 sec
    useEffect(() => {
      const interval = setInterval(() => {
        //setCurrentTexture(prev => ( prev === drinkImage1 ? drinkImage2 : drinkImage1));
        setCurrentTexture(prev => {
          if(prev === drinkImage1) return drinkImage2;
          if(prev === drinkImage2) return drinkImage3;
          if(prev === drinkImage3) return drinkImage4;
          return drinkImage1;
        })
      }, 100);

      // clear interval when component is unmounted
      return () => clearInterval(interval);
    }, [drinkImage1, drinkImage2, drinkImage3, drinkImage4 ]);


  
    

    const handleClick = () => {
      alert('Pistol clicked');
    };
    

  return (
    <View style={{ flex: 1 }}>
      <Image
        source={require('../assets/images/partial-react-logo.png')}
        style={styles.reactLogo}
      />

      {/* 3D Scene */}
      <Canvas style={{ flex: 1 }} camera={{ position: [0, 1, 4], fov: 50 }}>

        <Suspense fallback={null}>


          {/* Add an environment map for realistic lighting */}
          <Environment preset="night" />

          <RotatingAxle></RotatingAxle>

          <DraggableObject isDragging={isDragging} setIsDragging={setIsDragging}></DraggableObject>

          {/* Create the floor */}
          <Plane args={[5, 5]} position={[0, -2.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <meshStandardMaterial color="lightgray" />
          </Plane>

          {/*<primitive object={model.scene} scale={0.5} position={[0, 0, 0]} /> */}

          {/* Create walls */}
          <Box position={[-2.5, -0.75, 0]} args={[0.2, 3.5, 5]}>
            <meshStandardMaterial color="lightblue" />
          </Box>
          <Box position={[2.5, -0.75, 0]} args={[0.2, 3.5, 5]}>
            <meshStandardMaterial color="lightblue" />
          </Box>
          <Box position={[0, -0.75, 2.5]} args={[5, 3.5, 0.2]}>
            <meshStandardMaterial map={leader} />
          </Box>

          {/* Blue box */}
          <Box position={[-1.2, -2, -1]}>
            <meshStandardMaterial color="royalblue" />
          </Box>


          <Table position={[-0.2, 0, 0.4]} scale={[1, 1, 1]} rotation={[0, 0, 0]} />

          {/* Drink box */}
          <Box position={[2.85, -1, 0]}>
            <meshStandardMaterial map={currentTexture} />
          </Box>

          {/*Black box as "tv"*/}
          <Box position={[3.051, -1, 0]} scale={[1.4, 1.4, 1.4]}>
            <meshStandardMaterial color={"black"} />
          </Box>

          {/* Box with the react logo texture */}
          <Box position={[-6, 0, 0]} args={[2, 2, 2]}>
            <meshStandardMaterial map={texture} />
          </Box>

          {/* (foot)Ball */}
          <Sphere position={[1, -2.23, 2]} scale={[0.3, 0.3, 0.3]}>
            <meshStandardMaterial map={footballTexture} />
          </Sphere>

          {/* <Ball /> */}

          <Earth position={[-1.2, 0.5, -1]} />

          <BlenderModel position={[0, 0, 0]} />

          {/* <primitive object={scene}/> */}


          {/* Skeleton*/}
          <primitive position={[2.2, -2.5, 1.7]} object={model.scene} scale={[0.1, 0.1, 0.1]} rotation={[0, Math.PI / -2, 0]} />

          {/* Emmo */}
          <primitive position={[-1.4, -0.9, 1.7]} object={model4.scene} scale={[0.3, 0.3, 0.3]} map={texture} rotation={[0, Math.PI + 4.7, 0]} />

          {/* Pistol*/}
          <primitive position={[-1.4, -1.325, 1.5]} object={model2.scene} scale={[1, 1, 1]} rotation={[1.5, 0, 0]} onPointerDown={handleClick} />

          {/* toilet*/}
          <primitive position={[-2.4, -2.5, 0.5]} object={model3.scene} scale={[2, 2, 2]} rotation={[0, 1.57, 0]} />

          {/* Camera controls for navigating the scene */}
          <OrbitControls enablePan={false} minDistance={1} maxDistance={5} enableRotate={!isDragging} />

          <PerspectiveCamera makeDefault position={[0, 1000000, -3000000]} />

          {/* Lighting */}
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
        </Suspense>
      </Canvas>
    </View>
  );
};

export default Room;

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
