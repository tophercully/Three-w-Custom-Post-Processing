// init
import * as THREE from 'three'
THREE.Cache.enabled = true;
//Base setup
const w = 1600
const h = 2000
const marg = 0.05//normalized and sent to shader
const camera = new THREE.PerspectiveCamera( 70, 1600 / 2000, 0.01, 10);
camera.position.z = 1;

//scene and buffer(s)
const scene = new THREE.Scene();
const pScene = new THREE.Scene()

//build buffer
var options = {
    minFilter : THREE.LinearFilter,
    magFilter : THREE.LinearFilter,
};
const p = new THREE.WebGLRenderTarget(w, h, options)

//default materials
const normal = new THREE.MeshNormalMaterial();
const basic = new THREE.MeshPhongMaterial({color: 'white'})

//renderer
const renderer = new THREE.WebGLRenderer( { antialias: true } );
renderer.setSize(w, h);
renderer.setAnimationLoop( animation );
document.body.appendChild( renderer.domElement );

//global light params
const lightColor = "#ffffff";
const intensity = 2;
const light = new THREE.SpotLight(lightColor, intensity);
const ambient = new THREE.AmbientLight(lightColor, 0.1)
light.position.set(rv(-1, 1), rv(-1, 1), rv(1, 2));
light.target.position.set(0, 0, 0);

//sketch to buffer 'p'
//lights on 'p'
pScene.add(light);
pScene.add(light.target);
pScene.add(ambient);

//objects on 'p'
let spheres = []
for(let i = 0; i < 100; i++) {
    let that = new THREE.SphereGeometry(rv(0.05, 0.2))
    that.widthSegments = 64
    that.heightSegments = 32
    spheres[i] = new THREE.Mesh(that, basic)
    pScene.add(spheres[i])
    spheres[i].position.x = rv(-0.5, 0.5)
    spheres[i].position.y = rv(-0.5, 0.5)
    spheres[i].position.z = rv(0, -1)
}
//render buffer
renderer.setRenderTarget(p)
renderer.render( pScene, camera);


//shader setup
var bgcToShader = new THREE.Vector3(0, 0, 0)
const uniforms = {
    'p': { type: "sampler2D", value: p.texture },
    'seed': { value : rv(0, 1000000)},
    'bgc' : { bgcToShader },
    'marg' : { value : marg }
};

// create URL for shader.vert and load it
var vertUrl = new URL('./shader.vert', import.meta.url);
var vertResponse = await fetch(vertUrl);
var vertSource = await vertResponse.text(); // these are the contents of shader.vert as a string
//repeat for shader.frag
var fragUrl = new URL('./shader.frag', import.meta.url);
var fragResponse = await fetch(fragUrl);
var fragSource = await fragResponse.text(); // these are the contents of shader.frag as a string
//create the shader 'p' is imported to
const shaderMaterial = new THREE.ShaderMaterial({
    uniforms: uniforms,
    vertexShader: vertSource,
	fragmentShader: fragSource
})
var pMaterial = new THREE.MeshBasicMaterial({map:pScene});

//plane to render shader result to
const planeGeo = new THREE.PlaneGeometry(2, 2)
let plane = new THREE.Mesh(planeGeo, shaderMaterial)
plane.position.z = -0.5
scene.add(plane)

//canvas render
renderer.setRenderTarget(null)
renderer.render( scene, camera)

function animation( time ) {
    //not animating but you could use this when you do
	// renderer.render( scene, camera );
}