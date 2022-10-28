<template>
  <!-- <Gutter class=""> -->
    <div id="spacesdiv" class="pt-20 xl:pt-24">
    <div id="SpacesContainer" class="relative w-full h-full object-cover" style="">
      <div id="SpacesContent" class="text-gray-200 bg-black bg-opacity-60 h-full lg:w-1/3 sm:w-1/2 w-5/12 md:(py-18)">
        <div id="Spaces1" class="grid grid-cols-8 items-center absolute" style="display:block; margin-top:0">
          <Gutter>
          <div class="grid inline-block align-middle w-full h-full self-center content-center col-span-3">
            <div class="sm:px-8 sm:py-12 lg:(py-24) ">
              <p class="lg:text-4xl md:text-3xl text-2xl text-center text-gray-200 dark:text-gray-200">
                RENDERPUB <span class="font-bold text-our-blue">SPACES</span>
              </p>
              <p class="md:text-md xl:text-lg text-base md:pt-4 pt-2 text-center text-gray-200 dark:text-gray-200">
                <span class="font-bold "> Photorealistic decentralized metaverse platform </span> for experiencing architectural spaces interactively in mobile, web and VR. 
              </p>
              <!-- <router-link to="/Studio" @click="scrollToTop"> -->
              <div class="flex mb-6 md:mb-8 md:mb-0 mt-4">
                <button id="SpacesPageButton" class="text-center mx-auto w-1/2 focus:outline-none hover:ring-2 hover:ring-our-blue bg-our-blue rounded text-gray-200 px-4 py-2 xl:px-4 xl:py-4 font-bold text-base md:text-lg">
                  Coming Soon
                </button>
              </div>
              <!-- </router-link> -->
            </div>
          </div>
          </Gutter>
        </div>
      </div>
    </div>
    <div id="Spaces2" class="grid grid-cols-8" style="display:none;">
      <Gutter>
      <div class="grid w-full h-full col-span-8">
        <div class="border-black lg:(py-8 px-8) py-4">
          <p class="lg:text-4xl md:text-3xl text-2xl text-center text-gray-200 dark:text-gray-200">
            RENDERPUB <span class="font-bold text-our-blue">SPACES</span>
          </p>
          <p class="md:text-md xl:text-lg text-base md:pt-4 pt-2 text-center text-gray-200 dark:text-gray-200">
            <span class="font-bold ">Realtime ray traced renderer </span> with an extensive library of render ready objects, materials, decals, visual effects and all the tools you need to create high fidelity visuals quickly.
          </p>
          <!-- <router-link to="/Studio" @click="scrollToTop"> -->
            <div class="flex mb-6 md:mb-8 md:mb-0 mt-4">
              <button id="SpacesPageButton" class="mx-auto w-1/2 focus:outline-none hover:ring-2 hover:ring-our-blue bg-our-blue rounded text-gray-200 px-4 py-2 xl:px-4 xl:py-4 font-bold text-base md:text-lg">
                Coming Soon
              </button>
            </div>
          <!-- </router-link> -->
        </div>
      </div>
      </Gutter>
    </div> 
  
  </div>
</template>

<script type ="module">

let THREE
let container, stats
let SpacesContentCenterAligned, SpacesContentLeftAligned

let camera, scene, renderer
let aspectRatio

let targetRotationX = 0.5
let targetRotationOnMouseDownX = 0

let targetRotationY = 0.2
let targetRotationOnMouseDownY = 0

let mouseXNormalized = 0
let mouseYNormalized = 0
let mouseX = 0
let mouseXOnMouseDown = 0

let mouseY = 0
let mouseYOnMouseDown = 0

const slowingFactor = 0.1
let mousedownflag = 0
let sphereMesh

let windowHalfX
let windowHalfY
export default {

  async mounted() {
    THREE = await import('https://cdn.skypack.dev/three@0.136.0')
    this.init()
  },

  methods: {
    init() {
      container = document.getElementById('SpacesContainer')
      SpacesContentCenterAligned = document.getElementById('Spaces2')
      //console.log(SpacesContentCenterAligned);
      SpacesContentLeftAligned = document.getElementById('SpacesContent')
      //console.log(SpacesContentLeftAligned);

      windowHalfX = container.clientWidth / 2
      windowHalfY = container.clientHeight / 2

      camera = new THREE.PerspectiveCamera(30, (container.clientWidth) / container.clientHeight, 1, 100000)
      camera.position.z = -4000

      scene = new THREE.Scene()

      const backTexture = new THREE.TextureLoader().load('/NEWRENDERS/bgpano.webp', render)
      backTexture.mapping = THREE.EquirectangularReflectionMapping
      backTexture.minFilter = backTexture.magFilter = THREE.LinearFilter

      scene.background = backTexture

      // LIGHTS

      const ambient = new THREE.AmbientLight(0xFFFFFF)
      scene.add(ambient)

      renderer = new THREE.WebGLRenderer({ alpha: true })
      renderer.setPixelRatio(window.devicePixelRatio)
      renderer.setSize(container.clientWidth, container.clientHeight)
      container.appendChild(renderer.domElement)
	    createScene()
	    animate()
      container.addEventListener('mousedown', onDocumentMouseDown, false)
      container.addEventListener('mousemove', onDocumentMouseMove)
      container.addEventListener('mouseup', onDocumentMouseUp, false)
      container.addEventListener('mouseout', onDocumentMouseOut, false)

      container.addEventListener('touchstart ', onDocumentMouseDown, false)
      container.addEventListener('touchmove  ', onDocumentMouseMove, false)
      container.addEventListener('touchend   ', onDocumentMouseUp, false)
      container.addEventListener('touchcancel ', onDocumentMouseOut, false)
      window.addEventListener('resize', onWindowResize)

      function mapRange(min1, max1, min2, max2, v1) {
        return ((((v1 - min1) / (max1 - min1)) * (max2 - min2)) + min2)
      }

      function onWindowResize() {
        windowHalfX = container.clientWidth / 2
        windowHalfY = container.clientHeight / 2

        camera.aspect = container.clientWidth / container.clientHeight
        camera.updateProjectionMatrix()
        aspectRatio = container.clientWidth / container.clientHeight
        
        /* Scaling the Sphere according to screen's aspect ratio*/
        if (aspectRatio <= 0.7)
          sphereMesh.scale.x = sphereMesh.scale.y = sphereMesh.scale.z = mapRange(0.4, 0.7, 0.5, 1.0, aspectRatio) * 44.0
        // console.log(aspectRatio)

        else
          sphereMesh.scale.x = sphereMesh.scale.y = sphereMesh.scale.z = 44.0
        /* Scaling the Sphere according to screen's aspect ratio*/



        sphereMesh.position.x = mapRange(1, 3.5, 800, -1000, aspectRatio)
        renderer.setSize(container.clientWidth, container.clientHeight)
      }

      function createScene() {
        aspectRatio = container.clientWidth / container.clientHeight
        const s = aspectRatio >= 0.7 ? 44.0 : mapRange(0.4, 0.7, 0.5, 1.0, aspectRatio) * 44.0
        const geometry = new THREE.SphereGeometry(16, 32, 32)
        //const texture = new THREE.TextureLoader().load('public/museum_of_ethnography_2k.webp')
        const mat1 = new THREE.MeshStandardMaterial({
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.0
        })

        sphereMesh = new THREE.Mesh(geometry, mat1)

        // sphereMesh.position.x = - (aspectRatio) * (aspectRatio) * 80;
        sphereMesh.position.x = mapRange(1, 3.5, 800, -1000, aspectRatio)
        sphereMesh.scale.x = sphereMesh.scale.y = sphereMesh.scale.z = s
        // mesh.rotation.y = 0.5;
        scene.add(sphereMesh)
      }

      function onDocumentMouseMove(event) {
        mouseXNormalized = event.clientX / container.clientWidth
        mouseYNormalized = event.clientY / container.clientHeight

        mouseX = event.clientX - windowHalfX
        mouseY = event.clientY - windowHalfY

        if (mousedownflag) {
          targetRotationX = (mouseX - mouseXOnMouseDown) * 0.00025
          targetRotationY = (mouseY - mouseYOnMouseDown) * 0.00025
        }
      }

      function onDocumentMouseDown(event) {
        event.preventDefault()
        // document.addEventListener( 'mousemove', onDocumentMouseMove, false );
        // container.addEventListener( 'mouseup', onDocumentMouseUp, false );
        // container.addEventListener( 'mouseout', onDocumentMouseOut, false );

        mouseXOnMouseDown = event.clientX - windowHalfX
        targetRotationOnMouseDownX = targetRotationX

        mouseYOnMouseDown = event.clientY - windowHalfY
        targetRotationOnMouseDownY = targetRotationY
        mousedownflag = 1
      }

      function onDocumentMouseUp(event) {
      // document.removeEventListener( 'mousemove', onDocumentMouseMove, false );
      // container.removeEventListener( 'mouseup', onDocumentMouseUp, false );
      // container.removeEventListener( 'mouseout', onDocumentMouseOut, false );
        mousedownflag = 0
      }

      function onDocumentMouseOut(event) {
      // document.removeEventListener( 'mousemove', onDocumentMouseMove, false );
      // container.removeEventListener( 'mouseup', onDocumentMouseUp, false );
      // container.removeEventListener( 'mouseout', onDocumentMouseOut, false );
        mousedownflag = 0
      }

      function rotateAroundObjectAxis(object, axis, radians) {
        const rotationMatrix = new THREE.Matrix4()

        rotationMatrix.makeRotationAxis(axis.normalize(), radians)
        object.matrix.multiply(rotationMatrix)
        object.rotation.setFromRotationMatrix(object.matrix)
      }

      function rotateAroundWorldAxis(object, axis, radians) {
        if (axis == 'x')
          object.rotation.y += radians

        if (axis == 'y')
          object.rotation.x += radians
      }

      function render() {
        const timer = -0.0002 * Date.now()

        if (mousedownflag) {

        }

        camera.position.x += (mouseX - camera.position.x) * 0.05
        // camera.aspect -= ( mouseX - camera.position.x ) * .000005;
        camera.updateProjectionMatrix()

        camera.position.y += (-mouseY - camera.position.y) * 0.05
        
        
        /* Moving Sphere around according to screen's aspect ratio*/
        if (aspectRatio <= 1.4){
          camera.lookAt(sphereMesh.position)
          //This is where we need to hide/unhide text
          SpacesContentLeftAligned.style.display = 'none'
          // console.log(SpacesContentLeftAligned);
          SpacesContentCenterAligned.style.display = 'block'
          // console.log(SpacesContentCenterAligned);
          // document.getElementById('SpacesContent').classList.add('w-full')
        }
        else{
          camera.lookAt(new THREE.Vector3(1200, 0, 0))
           SpacesContentLeftAligned.style.display = 'block'
          //  console.log(SpacesContentLeftAligned);
           SpacesContentCenterAligned.style.display = 'none'
          //  console.log(SpacesContentCenterAligned);
          // if (document.getElementById('SpacesContent').classList.contains('w-full')){
          //   document.getElementById('SpacesContent').classList.remove('w-full')
          // }
        }
          
        /* */


        // console.log(scene.position);

        rotateAroundWorldAxis(sphereMesh, 'x', targetRotationX)
        // rotateAroundWorldAxis(sphereMesh, 'y', -targetRotationY);
        targetRotationY = targetRotationY * (1 - slowingFactor)
        targetRotationX = targetRotationX * (1 - slowingFactor)

        renderer.render(scene, camera)
      }

      function animate() {
        requestAnimationFrame(animate)

        render()
      }
    },
  },
}

</script>

<style>
#SpacesContainer{
        width: 100%;
        height: 70vh;
        overflow:hidden;
    }

    #SpacesContent{
    position:absolute;
    }
</style>
