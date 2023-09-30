

// init
import * as THREE from 'three'
THREE.Cache.enabled = true;
//Base setup
const w = 1600
const h = 2000

const camera = new THREE.PerspectiveCamera( 70, 1600 / 2000, 0.01, 10);
camera.position.z = 1;

const scene = new THREE.Scene();
const pScene = new THREE.Scene()

var options = {
		
    minFilter : THREE.LinearFilter,
        magFilter : THREE.LinearFilter,
        format : THREE.RGBAFormat,
        type : /(iPad|iPhone|iPod)/g.test(navigator.userAgent) ? THREE.HalfFloatType : 
                THREE.FloatType
    };
const p = new THREE.WebGLRenderTarget(w, h, options)

const pToShader = p

//simple materials
const normal = new THREE.MeshNormalMaterial();
const basic = new THREE.MeshPhongMaterial({color: 'white'})

const renderer = new THREE.WebGLRenderer( { antialias: true } );
renderer.setSize(w, h);
renderer.setAnimationLoop( animation );
document.body.appendChild( renderer.domElement );

//p sketch
const lightColor = "#ffffff";
const intensity = 1;
const light = new THREE.SpotLight(lightColor, intensity);
const ambient = new THREE.AmbientLight(lightColor, 0.1)
light.position.set(rv(-1, 1), rv(-1, 1), rv(1, 2));
light.target.position.set(0, 0, 0);
pScene.add(light);
pScene.add(light.target);
pScene.add(ambient)


let spheres = []
for(let i = 0; i < 100; i++) {
    let that = new THREE.SphereGeometry(rv(0.05, 0.2))
    spheres[i] = new THREE.Mesh(that, basic)
    pScene.add(spheres[i])
    spheres[i].position.x = rv(-0.5, 0.5)
    spheres[i].position.y = rv(-0.5, 0.5)
    spheres[i].position.z = rv(0, -1)
}

renderer.render( pScene, camera, p );
//buffer rendered


//shader setup
const uniforms = {
    'p': {value: p },
    // p: { type: "sampler2D", value: p },
    'u_resolution': {vec2: [w, h]},
};

// create URL for './test.frag' and load it
var vertUrl = new URL('./shader.vert', import.meta.url);
var vertResponse = await fetch(vertUrl);
var vertSource = await vertResponse.text(); // these are the contents of './test.frag' as a string
//repeat for frag
// create URL for './test.frag' and load it
var fragUrl = new URL('./shader.frag', import.meta.url);
var fragResponse = await fetch(fragUrl);
var fragSource = await fragResponse.text(); // these are the contents of './test.frag' as a string
//repeat for frag
// var fragSource = loadTextFile()

const shaderMaterial = new THREE.ShaderMaterial({
    uniforms: uniforms,
    vertexShader: vertSource,
	fragmentShader: fragSource
})
var pMaterial = new THREE.MeshBasicMaterial({map:pScene});

//plane to render to
scene.add(light);
scene.add(light.target);
scene.add(ambient)

const planeGeo = new THREE.PlaneGeometry(2, 2)
let plane = new THREE.Mesh(planeGeo, shaderMaterial)
plane.position.z = -0.5
scene.add(plane)


//canvas render
renderer.render( scene, camera)


function animation( time ) {


	

	// renderer.render( scene, camera );

}