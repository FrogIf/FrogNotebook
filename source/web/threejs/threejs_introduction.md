# threejs入门

## 概述

threejs是在网页端显示3D图形的库. 底层基于WebGL. threejs将WebGL进行了封装, 使得更易于使用. 对于threejs, 最好的教程就是官方文档了. threejs官方文档非常详细, 并且支持中文, 并且包含大量的例子, 基本可以满足所有需求.

* [官方文档](https://threejs.org/docs/index.html)
* [官方Demo](https://threejs.org/examples/)

此外, threejs是基于MIT开源协议的, 在github上可以找到它的源码: [源码地址](https://github.com/mrdoob/three.js)

我们可以将源码下载下来, 里面包好了丰富的内容, 包括所有demo的源码, editor的源码. 稳定版源码, 建议下载releases中的版本.

源码下载之后, 我们直接就可以本地访问了, 这里我使用nginx作为代理的方式, nginx的主要配置如下:

```
        location /three/ {
            alias D:/work/three.js-r139/;
            autoindex on;
        }
```

> 配置的监听端口是80端口

这样, 就可以本地调试官方demo了.

* 本地访问官方demo: http://localhost/three/examples/
* 本地访问editor: http://localhost/three/editor/

> 建议使用chrome浏览器, firefox会有控制台报错

## 快速开始

这里将threejs官方的例子复制过来了. 主要是备忘, 以后可以快速搭建一个简单的程序.

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
		<title>My first three.js app</title>
		<style>
			body { margin: 0; }
		</style>
	</head>
	<body>
		<script type="module">
			import * as THREE from './threejs/three.module.js';

            // 创建一个场景
            const scene = new THREE.Scene();

            // 创建一个相机
            const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
            camera.position.z = 5;

            // 创建渲染器
            const renderer = new THREE.WebGLRenderer();
            renderer.setSize(window.innerWidth, window.innerHeight);
            document.body.appendChild(renderer.domElement);

            // 创建网格
            const geometry = new THREE.BoxGeometry();
            const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
            const cube = new THREE.Mesh( geometry, material );
            scene.add( cube );  // 将网格加入场景

            // threejs会循环调用这个函数, 逐帧的展示相机看到的内容
            function animate() {
                requestAnimationFrame( animate );

                cube.rotation.x += 0.01;
				cube.rotation.y += 0.01;

                renderer.render( scene, camera );
            }
            animate();
		</script>
	</body>
</html>
```

接下来, 对其中的几个主要概念进行详细解释:

* Scene(场景): 用来放置物体, 灯光等内容的容器
* Camera(相机): 可以理解为眼睛, 用来看场景内容的. 相机有很多种:
  * PerspectiveCamera(透视相机): 看到的物体更符合人眼看到的效果, 近大远小; 其中包含视锥体这一重要概念;
  * OrthographicCamera(正交相机): 不会受远近导致的近大远小的影响, 一般在CAD等系统中较为常见.
* Renderer(渲染器): 用来渲染场景, 就是将一个相机和一个场景放到一起, 一帧一帧的展示相机看到的这个场景.
* Geometry(几何体): 可以理解为数学上的概念, 像长方体, 球体等等;
* Material(材质): 用于定义一个物体的材质, 包括颜色, 透明度等;
* Mesh(网格): 上面介绍的几何体是数学上的概念, 不具有实体, 所有几何体都包含一系列的点, 大部分时候, 这些点三个为一组, 组成三角面, 大量的三角面组合在一起就是Mesh(网格), 所以, 网格才是一个可以看得见的实体, 它将几何体和材质应用起来;

> 视锥体中有包含摄像机视锥体垂直视野角度, 摄像机视锥体长宽比, 近端面, 远端面等概念, 初学可以不用理解这些概念, 详见wiki: [viewing frustum](https://en.wikipedia.org/wiki/Viewing_frustum)

## 载入3D模型

threejs可以异步载入3d模型, 并且支持多种格式, 这里以比较通用的gltf格式为例, 简单介绍一下.

首先, 基于上面的例程, 进行一些改造:

1. 模型尺寸自适应;
2. 轨道控制器;
3. 背景渐变;
4. 加载3d模型;
5. 适应窗体尺寸变化.

代码如下:

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
		<title>My first three.js app</title>
		<style>
			body { margin: 0; }
		</style>
	</head>
	<body style="background-image: linear-gradient(rgb(43, 43, 43), rgb(203, 202, 202));">
        <script type="importmap">
			{
				"imports": {
					"three": "./threejs/three.module.js"
				}
			}
		</script>
		<script type="module">
			import * as THREE from './threejs/three.module.js';
            import { GLTFLoader } from './threejs/jsm/loaders/GLTFLoader.js';
            import { RoomEnvironment } from './threejs/jsm/environments/RoomEnvironment.js';
            import { OrbitControls } from './threejs/jsm/controls/OrbitControls.js';

            const frustumSize = 1000;
            const aspect = window.innerWidth / window.innerHeight;

            const scene = new THREE.Scene();
            // const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.01, 1000);
            const camera = new THREE.OrthographicCamera(frustumSize * aspect / - 2, frustumSize * aspect / 2, 
                frustumSize / 2, frustumSize / - 2, 0, 2000);
            camera.position.z = 5;

            const renderer = new THREE.WebGLRenderer({
                alpha: true, // 背景透明
                antialias: true // 抗锯齿
            });
            renderer.setSize(window.innerWidth, window.innerHeight);
            document.body.appendChild(renderer.domElement);

            const controls = new OrbitControls(camera, renderer.domElement);

            scene.environment = new THREE.PMREMGenerator(renderer).fromScene(new RoomEnvironment(), 0.04).texture;
            scene.add(new THREE.DirectionalLight( 0xFEFEFE ));

            function animate() {
                requestAnimationFrame( animate );
                renderer.render( scene, camera );
            }
            animate();

            // 加载模型
            const loader = new GLTFLoader();
            loader.load("./vvv.glb", function(gltf){
                scene.add(gltf.scene);
                adaptModelSize(gltf.scene, camera);
            },undefined, function ( error ) {
                console.log(error);
            });

            // 模型尺寸自适应
            function adaptModelSize(model, camera){
                var bBox = new THREE.Box3().setFromObject(model);

                let v = new THREE.Vector3();
                bBox.getSize(v);

                let c = new THREE.Vector3();
                bBox.getCenter(c);
                if(camera.isOrthographicCamera){    // 如果是正交相机
                    let start = new THREE.Vector3(0, 0, 0.5).unproject(camera);
                    let end = new THREE.Vector3(1, 1, 0.5).unproject(camera);
                    let len = start.sub(end).length();
                    let scale = len / Math.sqrt(window.innerHeight * window.innerHeight + window.innerWidth * window.innerWidth);
                    let height = window.innerHeight * scale;
                    let width = window.innerWidth * scale;
            
                    let maxSize = camera.near + c.length() + v.length();
                    camera.position.set(c.x, c.y, camera.far / 2 + maxSize);
                    camera.lookAt(model.position);
                    camera.zoom = Math.min(height / v.y, width / v.x);
                    camera.updateProjectionMatrix();
                }else if(camera.isPerspectiveCamera){ // 如果是透视相机
                    var dist = v.y / (Math.tan(camera.fov * Math.PI / 360) * 2);
                    camera.position.set(model.position.x, model.position.y, v.z + dist * 1.5);
                    camera.lookAt(c);
                }
            }

            // 响应窗体尺寸变化
            window.onresize = () => {
                if(camera.isOrthographicCamera){
                    let aspect = window.innerWidth / window.innerHeight;
                    
                    camera.left = - frustumSize * aspect / 2;
                    camera.right = frustumSize * aspect / 2;
                    camera.top = frustumSize / 2;
                    camera.bottom = - frustumSize / 2;

                    camera.updateProjectionMatrix();
                    renderer.setSize( window.innerWidth, window.innerHeight );
                }else if(camera.isPerspectiveCamera){
                    camera.aspect = window.innerWidth / window.innerHeight;
                    camera.updateProjectionMatrix();
                }
                renderer.setSize(window.innerWidth, window.innerHeight);
            };
		</script>
	</body>
</html>
```

> 完整项目以及线上演示demo参见github: [simple-threejs](https://github.com/FrogIf/simple-threejs)