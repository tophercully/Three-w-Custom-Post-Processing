

// init
import * as THREE from '/node_modules/three/'
//Base setup
const w = 1600
const h = 2000

const camera = new THREE.PerspectiveCamera( 70, 1600 / 2000, 0.01, 10);
camera.position.z = 1;

const scene = new THREE.Scene();
const pScene = new THREE.Scene()
const p = new THREE.WebGLRenderTarget(w, h)

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
    texP: {vec4: p },
    // texture2: { type: "sampler2D", value: texture2 },
    u_resolution: {vec2: [w, h]},
};

const shaderMaterial = new THREE.ShaderMaterial({
    // uniforms: {time: {value: 1.0}, u_resolution: {vec2: [w, h]}},
    uniforms: uniforms,
    vertexShader: document.getElementById( 'vert' ).src.textContext,
	fragmentShader: document.getElementById( 'frag' ).src.textContext
})
var pMaterial = new THREE.MeshBasicMaterial({map:pScene});

// var testMaterial = new THREE.Material({dithering:true})

//plane to render to
scene.add(light);
scene.add(light.target);
scene.add(ambient)

const planeGeo = new THREE.BoxGeometry(2, 2, 2)
let plane = new THREE.Mesh(planeGeo, shaderMaterial)
plane.position.z = -0.5
scene.add(plane)


//canvas render
renderer.render( scene, camera)


function animation( time ) {


	

	// renderer.render( scene, camera );

}