---
title: 动画不卡顿方法和原理
date: 2016-12-19 11:04:04
categories:
tags:
---
在做项目的时候发现用css3做动画的时候发现在安卓手机上会出现卡顿现象,和在ios,pc上效果不一样
#### 卡顿的原因有以下几种可能


1. 该元素在文档流里,每次动画移动引起重排和重绘,影响浏览器性能
2. 设置了background有关的动画效果
3. 过度使用-webkit-transform:transition3d/translateZ,opacity < 1开启了GPU动画,过度依赖GPU而导致性能下降。或者开启GPU硬件加速之后，有些时候可能会导致浏览器频繁闪烁或抖动.解决方法如下
```
-webkit-backface-visibility:hidden;
-webkit-perspective:1000;
```
4. 该元素本身设置了left,right,top,bottom,margin等



#### 如何知道自己做的动画是否流畅
可以用safari 和chrome 查询 (盗用别人的图~)
- Chrome自带的帧率监测工具，用于侦听全局帧率，以及页面重绘耗时  
![image](http://alexorz.github.io/animation-performance-guide/images/chrome-fps-panel.png)
![image](http://alexorz.github.io/animation-performance-guide/images/chrome-ms-panel.png)
![image](http://alexorz.github.io/animation-performance-guide/images/rendering-panel-skitched.png)    
- Chrome Timeline，杀手级监测 & 调试工具
![image](http://alexorz.github.io/animation-performance-guide/images/chrome-timeline-skitched.png)
 操作如下:  
Chrome Timeline
![image](http://alexorz.github.io/animation-performance-guide/images/chrome-timeline-full-skitched.png)
Safari Timeline
![iamge](http://alexorz.github.io/animation-performance-guide/images/safari-timeline.png)

- 帧率能够量化动画的流畅程度，流畅的动画一般具备两个特点  

1. 帧率高(接近60fps最佳) 
2. 帧率稳定，波动少（极少出现跳帧现象）


#### h5动画的选择 
想要做动画,有很多选择,js,jquery,css3,那么那种比较流程比较快呢,
- jquery:  jquery是比较慢的,原因如下



1. 影响文档流,多次导致重排和重绘
2. 内存消耗打,经常会触发垃圾回收,垃圾回收容易让动画卡住
3. 使用setInterval,setTimeout,有篇文章就详细讲了关于动画使用了setInterval,setTimeout的原因  
http://www.infoq.com/cn/articles/javascript-high-performance-animation-and-page-rendering


- css3动画 transition: css3比jquery快

1. 优化dom操作
2. 使用类似RAF的机制
3. 强制使用硬件加速(GPU)

但是有兼容问题,ie10以下不支持transition,并且跟js配合使用灵活性不高,只能用js触发css3,却不能控制速度动画效果等


- Javascript动画


1. 同步DOM >-在整个动画链中微调堆栈以达到最小的layout thrashing。
2. 缓存链式操作中的属性值，这样可以最小化DOM的查询操作
3. 在同一个跨同层元素的调用中缓存单位转化比率（例如px转换成%、em等等单位）
4. 忽略那些变动小到根本看不出来的DOM更新

 

###### 比如Velocity.js动画 :  
没使用过,下次琢磨一下,网上说动画效果不错,  
[官网文档库](http://velocityjs.org/)   
[3D 动画的demo](http://julian.com/research/velocity/demo.html)  
[虚拟世界](http://danielraftery.com/read/Animating-Awesomeness-with-Velocityjs)



1. Velocity 包含了 jQuery、 jQuery UI 和 CSS transition 的功能
2. 轻量级,易用性强,使用了跟jquery类似的方法,比如$.animate(),$.fade(),$.delay()等
3. 具有流畅性,兼容性


- 如何保证css3动画的流畅
有个英文网站上讲述了关于css3流畅的方法,大致翻译下加上我查找的一些资料总结下:  
[英文网站css3高性能动画链接](https://www.html5rocks.com/en/tutorials/speed/high-performance-animations/)
1. 动画大小使用transition: scale
2. 移动用transition:translate(npx,npx);
3. 转动角度:transform:rotate
4. 改变透明度用opacity:0...1
5. 背景替换有卡顿现象少用,要用的话在对象再加一层div,形成背景覆盖,少用background-position
6. 创建独立的Layer（层）（为避免和div（层）产生混淆文中尽量同一使用Layer）,减少动画时过多的重绘和重排
7. 合理使用-webkit-transform:transition3d/translateZ,opacity < 1开启GPU渲染网页.
8. 如果需要JS执行动画，使用requestAnimationFrame,或者Velocity,避免使用jQuery动画,setTimeout,setInterval。window.requestAnimationFrame 是一个专门为动画而生的 web API 。它通知浏览器在页面重绘前执行你的回调函数。通常来说被调用的频率是每秒60次,用它来代替setInterval,setTimeout  
[了解 requestAnimationFrame](http://www.cnblogs.com/Wayou/p/requestAnimationFrame.html)  
9. 阴影渐显动画尽量用伪类的opacity来实现。[demo](https://www.w3ctrain.com/2015/11/25/how-to-animate-box-shadow/)
