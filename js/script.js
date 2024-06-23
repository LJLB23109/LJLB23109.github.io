// 使用debugUI
// import GUI from 'lil-gui'
// import gsap from 'gsap'
// import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
// import * as THREE from "three"
//获取HTML的canvas元素class类名叫做canvas.webgl的元素
const canvas = document.querySelector('canvas.webgl')

// 创建对象size
const size = {
    width: window.innerWidth,
    height: window.innerHeight
}
// 新建场景
const scene = new THREE.Scene()
// scene.background = new THREE.Color( 0x1c1d2f );
// 添加坐标轴
const axesHelper = new THREE.AxesHelper(5)
// scene.add(axesHelper)
// 创建几何体
const geometry = new THREE.TorusKnotGeometry(1,0.3,300,20,1,3)
const geometry2 = new THREE.TorusKnotGeometry(1,0.3,300,20,2,3)
const geometry3 = new THREE.TorusKnotGeometry(1,0.3,300,20,6,1)
// 创建材质
const textureLoader = new THREE.TextureLoader()
const gradientTexture = textureLoader.load('./img/Image0001.png')
gradientTexture.magFilter = THREE.NearestFilter
const material = new THREE.MeshToonMaterial({
    color:'#242424',
    gradientMap: gradientTexture
})
// 用几何体和材质创建网格
const mesh = new THREE.Mesh(geometry, material)
const mesh2 = new THREE.Mesh(
    geometry2,
    material
)
const mesh3 = new THREE.Mesh(
    geometry3,
    material
)
const objectsDistance = 5
mesh.position.y = -objectsDistance* 0
mesh2.position.y = -objectsDistance* 1
mesh3.position.y = -objectsDistance* 2
scene.add(mesh)
scene.add(mesh2)
scene.add(mesh3)
const sectionMeshes = [mesh, mesh2,mesh3]

const particlesCount = 2000
const vertices = []
let vx,vy,vz = 0
for(let i = 0; i < particlesCount; i++){
    vx = (Math.random()-0.5)*10
    vy = objectsDistance/2 - Math.random()* objectsDistance * 3
    vz = (Math.random()-0.5)*10
    vertices.push(vx,vy,vz)
}
const attribute = new THREE.Float32BufferAttribute(vertices, 3)
const bufferGeometry = new THREE.BufferGeometry()
bufferGeometry.setAttribute('position', attribute)
const pointsMaterial = new THREE.PointsMaterial({
    color:'white',
    size: 1,
    sizeAttenuation:false
})
const points = new THREE.Points(bufferGeometry, pointsMaterial)
scene.add(points)

//Light
const ambientLight = new THREE.AmbientLight()
scene.add(ambientLight)
const directLight = new THREE.DirectionalLight('white', 2)
directLight.position.set(1, 1, 0)
scene.add(directLight)



// 相机
const camera = new THREE.PerspectiveCamera(
    75,
    size.width/size.height,
    0.1,
    1000
)
camera.position.z = 3
const group = new THREE.Group()
group.add(camera)
scene.add(group)

// 指针
const cursor = {
    x: 0,
    y: 0
}
// 添加监听事件
window.addEventListener('mousemove', (event)=>{
    cursor.x = event.clientX / size.width-0.5
    cursor.y = event.clientY / size.height-0.5

    // console.log(event.clientX,event.clientY)
    // console.log(cursor.x, cursor.y)
    
})


//创建渲染器，指定渲染到canvas
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true
})
// 渲染器设置宽高
renderer.setSize(size.width, size.height)
//像素比最小值为2
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

// 动画
let currentSetion = 0,newSection= 0
let parallaxX = 0, parallaxY = 0
let previousTime = 0
const clock = new THREE.Clock()
const tick = () =>{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime
    for(const mesh of sectionMeshes){
        mesh.rotation.x += deltaTime* 0.1
        mesh.rotation.y += deltaTime* 0.1
        
    }
    parallaxX = -cursor.x
    parallaxY = cursor.y
    //easing
    group.position.x += (parallaxX-group.position.x) * 5 * deltaTime
    group.position.y += (parallaxY-group.position.y) * 5 * deltaTime
    
    renderer.render(scene, camera)
    window.requestAnimationFrame(tick)
}
tick()

// 创建resize事件
window.addEventListener('resize', ()=>{
    // console.log("resize")
    size.width = window.innerWidth
    size.height= window.innerHeight
    // 修改对应相机宽高比
    camera.aspect = size.width/size.height
    // 更新相机矩阵，不更新就不会传入新的数据并重新绘制
    camera.updateProjectionMatrix()
    renderer.setSize(size.width, size.height)
    //像素比最小值为2
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})
//可能不是第一次加载而是刷新的情况，所以scrollY可能已经改变
let scrollY = window.scrollY
currentSetion = Math.round(scrollY/size.height)
camera.position.y = -scrollY / size.height * objectsDistance
window.addEventListener('scroll', ()=>{
    scrollY = window.scrollY
    // console.log(Math.floor(scrollY/size.height))
    newSection = Math.round(scrollY/size.height)
    if(newSection != currentSetion){
        currentSetion = newSection
        // console.log('changed', currentSetion)
        // gsap.to(
        //     sectionMeshes[currentSetion].rotation,
        //     {
        //         duration: 1.5,
        //         ease: 'power2.inOut',
        //         x: '+=6',
        //         y:'+=3'
        //     }
        // )
    }
    camera.position.y = -scrollY / size.height * objectsDistance
})
// 第一次加载页面或刷新页面时旋转一次
// console.log(currentSetion)
// gsap.to(
//     sectionMeshes[currentSetion].rotation,
//     {
//         duration: 1.5,
//         ease: 'power2.inOut',
//         x: '+=6',
//         y:'+=3'
//     }
// )
