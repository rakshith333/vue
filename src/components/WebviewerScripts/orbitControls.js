//import * as THREE from '../../../public/three/build/three.module.js'
// const THREE = await import('https://unpkg.com/three@0.136.0/build/three.module.js')

export function OrbitControls(THREE, object, domElement) {
  const scope = this
  this.object = object
  this.domElement = domElement !== undefined ? domElement : document
  this.enabled = !0
  this.target = new THREE.Vector3()
  this.smoothDistance = !1
  this.minDistance = 0
  this.maxDistance = Infinity
  this.smoothMinDistance = 0
  this.smoothMaxDistance = Infinity
  this.smoothDistanceSpeed = 0.1
  this.minZoom = 0
  this.maxZoom = Infinity
  this.minFov = 45
  this.maxFov = 100
  this.fovChanged = !1
  this.changeFovSpeed = 2
  this.minPolarAngle = 0
  this.maxPolarAngle = Math.PI
  this.isSmoothPolar = !1
  this.smoothMinPolarAngle = -Infinity
  this.smoothMaxPolarAngle = -Infinity
  this.minAzimuthAngle = -Infinity
  this.maxAzimuthAngle = Infinity
  this.isSmoothAzimuth = !1
  this.smoothMinAzimuthAngle = -Infinity
  this.smoothMaxAzimuthAngle = -Infinity
  this.enableDamping = !1
  this.dampingFactor = 0.25
  this.enableZoom = !0
  this.zoomSpeed = 0.2
  this.enableRotate = !0
  this.rotateSpeed = 0.5
  this.enablePan = !1
  this.keyPanSpeed = 7.0
  this.autoRotate = !1
  this.autoRotateSpeed = 2.0
  this.enableKeys = !1
  this.keys = { LEFT: 37, UP: 38, RIGHT: 39, BOTTOM: 40 }
  this.mouseButtons = { ORBIT: THREE.MOUSE.LEFT, ZOOM: THREE.MOUSE.MIDDLE, PAN: THREE.MOUSE.RIGHT }
  this.target0 = this.target.clone()
  this.position0 = this.object.position.clone()
  this.zoom0 = this.object.zoom
  this.fov = 45
  this.getPolarAngle = function() {
    return spherical.phi
  }
  this.getAzimuthalAngle = function() {
    return spherical.theta
  }
  this.reset = function() {
    scope.target.copy(scope.target0)
    scope.object.position.copy(scope.position0)
    scope.object.zoom = scope.zoom0
    scope.object.updateProjectionMatrix()
    scope.dispatchEvent(changeEvent)
    scope.update()
    state = STATE.NONE
  }
  this.resetState = function() {
    state = STATE.NONE
  }
  this.setRotation = function(rx = 0, ry = 0) {
    const offset = new THREE.Vector3()
    const position = scope.object.position
    offset.copy(scope.object.position).sub(scope.target)
    const radius = offset.length() * scale
    offset.x = radius * Math.sin(rx) * Math.sin(ry)
    offset.y = radius * Math.cos(rx)
    offset.z = radius * Math.sin(rx) * Math.cos(ry)
    position.copy(scope.target).add(offset)
    scope.object.lookAt(scope.target)
    this.update()
  }
  this.getState = function() {
    return STATE
  }
  scope.isRotating = !1
  scope.isRotated = !1
  scope.isMouseDown = !1
  scope.isPaning = !1
  this.update = (function() {
    const offset = new THREE.Vector3()
    let smoothThetaDiff = 1
    let oldSmoothThetaDiff = 1
    let smoothPhiDiff = 1
    let oldSmoothPhiDiff = 1
    let smoothScale = 1
    const quat = new THREE.Quaternion().setFromUnitVectors(object.up, new THREE.Vector3(0, 1, 0))
    const quatInverse = quat.clone().inverse()
    const lastPosition = new THREE.Vector3()
    const lastQuaternion = new THREE.Quaternion()
    return function update() {
      if (!scope.enabled)
        return !1

      const position = scope.object.position
      offset.copy(position).sub(scope.target)
      offset.applyQuaternion(quat)
      spherical.setFromVector3(offset)
      if (scope.autoRotate && state === STATE.NONE)
        rotateLeft(getAutoRotationAngle())

      if (scope.isSmoothAzimuth) {
        oldSmoothThetaDiff = smoothThetaDiff
        var value = spherical.theta
        var min0 = scope.smoothMaxAzimuthAngle
        var max0 = scope.maxAzimuthAngle
        var diff0 = 1.0 - Math.max(0, Math.min(1, (value - min0) / (max0 - min0)))
        var max1 = scope.smoothMinAzimuthAngle
        var min1 = scope.minAzimuthAngle
        var diff1 = Math.max(0, Math.min(1, (value - min1) / (max1 - min1)))
        smoothThetaDiff = Math.min(diff0, diff1)
        smoothThetaDiff = smoothThetaDiff > oldSmoothThetaDiff ? 1.0 : smoothThetaDiff
      }
      if (scope.isSmoothPolar) {
        oldSmoothPhiDiff = smoothPhiDiff
        var value = spherical.phi
        var min0 = scope.smoothMaxPolarAngle
        var max0 = scope.maxPolarAngle
        var diff0 = 1.0 - Math.max(0, Math.min(1, (value - min0) / (max0 - min0)))
        var max1 = scope.smoothMinPolarAngle
        var min1 = scope.minPolarAngle
        var diff1 = Math.max(0, Math.min(1, (value - min1) / (max1 - min1)))
        smoothPhiDiff = Math.min(diff0, diff1)
        smoothPhiDiff = smoothPhiDiff > oldSmoothPhiDiff ? 1.0 : smoothPhiDiff
      }
      spherical.theta += sphericalDelta.theta * smoothThetaDiff
      spherical.phi += sphericalDelta.phi * smoothPhiDiff
      spherical.theta = Math.max(scope.minAzimuthAngle, Math.min(scope.maxAzimuthAngle, spherical.theta))
      spherical.phi = Math.max(scope.minPolarAngle, Math.min(scope.maxPolarAngle, spherical.phi))
      spherical.makeSafe()
      /* if (minimap) {
                minimap.updateRadar(spherical.theta);
            }
            if (radar) {
                radar.updateRadar(spherical.theta);
            } */
      const oldSphericalRadius = spherical.radius
      smoothScale = scale != 1 ? scale : smoothScale
      spherical.radius *= scale
      if (this.smoothDistance && smoothScale != 0) {
        let absDist, absoluteDiff, ratio
        if (smoothScale < 1) {
          absoluteDiff = scope.smoothMinDistance - scope.minDistance
          absDist = Math.max(spherical.radius - scope.minDistance, 0)
          ratio = absDist / absoluteDiff
          spherical.radius = oldSphericalRadius - ratio * scope.zoomSpeed * scope.smoothDistanceSpeed
        } else if (smoothScale > 1) {
          absoluteDiff = scope.maxDistance - scope.smoothMaxDistance
          absDist = Math.max(scope.maxDistance - spherical.radius, 0)
          ratio = absDist / absoluteDiff
          spherical.radius = oldSphericalRadius + ratio * scope.zoomSpeed * scope.smoothDistanceSpeed
        }
      }
      spherical.radius = Math.max(scope.minDistance, Math.min(scope.maxDistance, spherical.radius))
      scope.target.add(panOffset)
      offset.setFromSpherical(spherical)
      offset.applyQuaternion(quatInverse)
      position.copy(scope.target).add(offset)
      scope.object.lookAt(scope.target)
      if (scope.enableDamping === !0) {
        sphericalDelta.theta *= 1 - scope.dampingFactor
        sphericalDelta.phi *= 1 - scope.dampingFactor
      } else {
        sphericalDelta.set(0, 0, 0)
      }
      const jj = Math.abs(parseInt(sphericalDelta.phi * 100000))
      scope.isRotating = jj > 9
      scope.isRotating = jj > 25
      if (scope.isRotating && !scope.isRotated)
        scope.isRotated = !0

      scale = 1
      panOffset.set(0, 0, 0)
      if (zoomChanged || lastPosition.distanceToSquared(scope.object.position) > EPS || 8 * (1 - lastQuaternion.dot(scope.object.quaternion)) > EPS) {
        scope.dispatchEvent(changeEvent)
        lastPosition.copy(scope.object.position)
        lastQuaternion.copy(scope.object.quaternion)
        zoomChanged = !1
        return !0
      }
      return !1
    }
  })()
  this.dispose = function() {
    scope.domElement.removeEventListener('contextmenu', onContextMenu, !1)
    scope.domElement.removeEventListener('mousedown', onMouseDown, !1)
    scope.domElement.removeEventListener('wheel', onMouseWheel, !1)
    scope.domElement.removeEventListener('touchstart', onTouchStart, !1)
    scope.domElement.removeEventListener('touchend', onTouchEnd, !1)
    scope.domElement.removeEventListener('touchmove', onTouchMove, !1)
    document.removeEventListener('mousemove', onMouseMove, !1)
    document.removeEventListener('mouseup', onMouseUp, !1)
    window.removeEventListener('keydown', onKeyDown, !1)
  }
  var changeEvent = { type: 'change' }
  const startEvent = { type: 'start' }
  const endEvent = { type: 'end' }
  var STATE = { NONE: -1, ROTATE: 0, DOLLY: 1, PAN: 2, TOUCH_ROTATE: 3, TOUCH_DOLLY: 4, TOUCH_PAN: 5 }
  var state = STATE.NONE
  var EPS = 0.000001
  var spherical = new THREE.Spherical()
  var sphericalDelta = new THREE.Spherical()
  var scale = 1
  var panOffset = new THREE.Vector3()
  var zoomChanged = !1
  const rotateStart = new THREE.Vector2()
  const rotateEnd = new THREE.Vector2()
  const rotateDelta = new THREE.Vector2()
  const panStart = new THREE.Vector2()
  const panEnd = new THREE.Vector2()
  const panDelta = new THREE.Vector2()
  const dollyStart = new THREE.Vector2()
  const dollyEnd = new THREE.Vector2()
  const dollyDelta = new THREE.Vector2()
  function getAutoRotationAngle() {
    return ((2 * Math.PI) / 60 / 60) * scope.autoRotateSpeed
  }
  function getZoomScale() {
    return Math.pow(0.95, scope.zoomSpeed)
  }
  function rotateLeft(angle) {
    sphericalDelta.theta -= angle
  }
  this.rotate = function(angle) {
    sphericalDelta.theta = -angle
  }
  function rotateUp(angle) {
    sphericalDelta.phi -= angle
  }
  const panLeft = (function() {
    const v = new THREE.Vector3()
    return function panLeft(distance, objectMatrix) {
      v.setFromMatrixColumn(objectMatrix, 0)
      v.multiplyScalar(-distance)
      panOffset.add(v)
    }
  })()
  const panUp = (function() {
    const v = new THREE.Vector3()
    return function panUp(distance, objectMatrix) {
      v.setFromMatrixColumn(objectMatrix, 1)
      v.multiplyScalar(distance)
      panOffset.add(v)
    }
  })()
  const pan = (function() {
    const offset = new THREE.Vector3()
    return function pan(deltaX, deltaY) {
      const element = scope.domElement === document ? scope.domElement.body : scope.domElement
      if (scope.object instanceof THREE.PerspectiveCamera) {
        const position = scope.object.position
        offset.copy(position).sub(scope.target)
        let targetDistance = offset.length()
        targetDistance *= Math.tan(((scope.object.fov / 2) * Math.PI) / 180.0)
        panLeft((2 * deltaX * targetDistance) / element.clientHeight, scope.object.matrix)
        panUp((2 * deltaY * targetDistance) / element.clientHeight, scope.object.matrix)
      } else if (scope.object instanceof THREE.OrthographicCamera) {
        panLeft((deltaX * (scope.object.right - scope.object.left)) / scope.object.zoom / element.clientWidth, scope.object.matrix)
        console.log('1')
        panUp((deltaY * (scope.object.top - scope.object.bottom)) / scope.object.zoom / element.clientHeight, scope.object.matrix)
        scope.isPaning = !0
      } else {
        console.warn('WARNING: OrbitControls.js encountered an unknown camera type - pan disabled.')
        scope.enablePan = !1
      }
    }
  })()
  function dollyIn(dollyScale) {
    if (scope.object instanceof THREE.PerspectiveCamera) {
      scope.object.fov = THREE.Math.clamp(scope.object.fov + scope.changeFovSpeed, scope.minFov, scope.maxFov)
      scope.object.updateProjectionMatrix()
      scope.fovChanged = !0
    } else if (scope.object instanceof THREE.OrthographicCamera) {
      scope.object.zoom = Math.max(scope.minZoom, Math.min(scope.maxZoom, scope.object.zoom * dollyScale))
      scope.object.updateProjectionMatrix()
      zoomChanged = !0
    } else {
      console.warn('WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled.')
      scope.enableZoom = !1
    }
  }
  function dollyOut(dollyScale) {
    if (scope.object instanceof THREE.PerspectiveCamera) {
      scope.object.fov = THREE.Math.clamp(scope.object.fov - scope.changeFovSpeed, scope.minFov, scope.maxFov)
      scope.object.updateProjectionMatrix()
      scope.fovChanged = !0
    } else if (scope.object instanceof THREE.OrthographicCamera) {
      scope.object.zoom = Math.max(scope.minZoom, Math.min(scope.maxZoom, scope.object.zoom / dollyScale))
      scope.object.updateProjectionMatrix()
      zoomChanged = !0
    } else {
      console.warn('WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled.')
      scope.enableZoom = !1
    }
  }
  function handleMouseDownRotate(event) {
    rotateStart.set(event.clientX, event.clientY)
  }
  function handleMouseDownDolly(event) {
    dollyStart.set(event.clientX, event.clientY)
  }
  function handleMouseDownPan(event) {
    panStart.set(event.clientX, event.clientY)
  }
  function handleMouseMoveRotate(event) {
    rotateEnd.set(event.clientX, event.clientY)
    rotateDelta.subVectors(rotateEnd, rotateStart)
    const element = scope.domElement === document ? scope.domElement.body : scope.domElement
    rotateLeft(((2 * Math.PI * rotateDelta.x) / element.clientWidth) * scope.rotateSpeed)
    rotateUp(((2 * Math.PI * rotateDelta.y) / element.clientHeight) * scope.rotateSpeed)
    rotateStart.copy(rotateEnd)
    scope.update()
  }
  function handleMouseMoveDolly(event) {
    dollyEnd.set(event.clientX, event.clientY)
    dollyDelta.subVectors(dollyEnd, dollyStart)
    if (dollyDelta.y > 0)
      dollyIn(getZoomScale())
    else if (dollyDelta.y < 0)
      dollyOut(getZoomScale())

    dollyStart.copy(dollyEnd)
    scope.update()
  }
  function handleMouseMovePan(event) {
    panEnd.set(event.clientX, event.clientY)
    panDelta.subVectors(panEnd, panStart)
    pan(panDelta.x, panDelta.y)
    panStart.copy(panEnd)
    scope.isPaning = !0
    scope.update()
  }
  function handleMouseUp(event) {
    scope.isPaning = !1
  }
  function handleMouseWheel(event) {
    if (event.deltaY < 0)
      dollyOut(getZoomScale())
    else if (event.deltaY > 0)
      dollyIn(getZoomScale())

    scope.update()
  }
  function handleKeyDown(event) {
    switch (event.keyCode) {
      case scope.keys.UP:
        pan(0, scope.keyPanSpeed)
        scope.update()
        break
      case scope.keys.BOTTOM:
        pan(0, -scope.keyPanSpeed)
        scope.update()
        break
      case scope.keys.LEFT:
        pan(scope.keyPanSpeed, 0)
        scope.update()
        break
      case scope.keys.RIGHT:
        pan(-scope.keyPanSpeed, 0)
        scope.update()
        break
    }
  }
  function handleTouchStartRotate(event) {
    rotateStart.set(event.touches[0].pageX, event.touches[0].pageY)
  }
  function handleTouchStartDolly(event) {
    const dx = event.touches[0].pageX - event.touches[1].pageX
    const dy = event.touches[0].pageY - event.touches[1].pageY
    const distance = Math.sqrt(dx * dx + dy * dy)
    dollyStart.set(0, distance)
  }
  function handleTouchStartPan(event) {
    panStart.set(event.touches[0].pageX, event.touches[0].pageY)
  }
  function handleTouchMoveRotate(event) {
    rotateEnd.set(event.touches[0].pageX, event.touches[0].pageY)
    rotateDelta.subVectors(rotateEnd, rotateStart)
    const element = scope.domElement === document ? scope.domElement.body : scope.domElement
    rotateLeft(((2 * Math.PI * rotateDelta.x) / element.clientWidth) * scope.rotateSpeed)
    rotateUp(((2 * Math.PI * rotateDelta.y) / element.clientHeight) * scope.rotateSpeed)
    rotateStart.copy(rotateEnd)
    scope.update()
  }
  function handleTouchMoveDolly(event) {
    const dx = event.touches[0].pageX - event.touches[1].pageX
    const dy = event.touches[0].pageY - event.touches[1].pageY
    const distance = Math.sqrt(dx * dx + dy * dy)
    dollyEnd.set(0, distance)
    dollyDelta.subVectors(dollyEnd, dollyStart)
    if (dollyDelta.y > 0)
      dollyOut(getZoomScale())
    else if (dollyDelta.y < 0)
      dollyIn(getZoomScale())

    dollyStart.copy(dollyEnd)
    scope.update()
  }
  function handleTouchMovePan(event) {
    panEnd.set(event.touches[0].pageX, event.touches[0].pageY)
    panDelta.subVectors(panEnd, panStart)
    pan(panDelta.x, panDelta.y)
    panStart.copy(panEnd)
    scope.update()
  }
  function handleTouchEnd(event) {}
  function onMouseDown(event) {
    if (scope.enabled === !1) return
    scope.isMouseDown = !0
    event.preventDefault()
    if (event.button === scope.mouseButtons.ORBIT) {
      if (scope.enableRotate === !1) return
      handleMouseDownRotate(event)
      state = STATE.ROTATE
    } else if (event.button === scope.mouseButtons.ZOOM) {
      if (scope.enableZoom === !1) return
      handleMouseDownDolly(event)
      state = STATE.DOLLY
    } else if (event.button === scope.mouseButtons.PAN) {
      if (scope.enablePan === !1) return
      handleMouseDownPan(event)
      state = STATE.PAN
    }
    if (state !== STATE.NONE) {
      document.addEventListener('mousemove', onMouseMove, !1)
      document.addEventListener('mouseup', onMouseUp, !1)
      scope.dispatchEvent(startEvent)
    }
  }
  function onMouseMove(event) {
    if (scope.enabled === !1) return
    event.preventDefault()
    if (state === STATE.ROTATE) {
      if (scope.enableRotate === !1) return
      handleMouseMoveRotate(event)
    } else if (state === STATE.DOLLY) {
      if (scope.enableZoom === !1) return
      handleMouseMoveDolly(event)
    } else if (state === STATE.PAN) {
      if (scope.enablePan === !1) return
      handleMouseMovePan(event)
    }
  }
  function onMouseUp(event) {
    if (scope.enabled === !1) return
    scope.isMouseDown = !1
    handleMouseUp(event)
    document.removeEventListener('mousemove', onMouseMove, !1)
    document.removeEventListener('mouseup', onMouseUp, !1)
    scope.dispatchEvent(endEvent)
    state = STATE.NONE
  }
  function onMouseWheel(event) {
    if (scope.enabled === !1 || scope.enableZoom === !1 || (state !== STATE.NONE && state !== STATE.ROTATE)) return
    event.preventDefault()
    event.stopPropagation()
    handleMouseWheel(event)
    scope.dispatchEvent(startEvent)
    scope.dispatchEvent(endEvent)
  }
  function onKeyDown(event) {
    if (scope.enabled === !1 || scope.enableKeys === !1 || scope.enablePan === !1) return
    handleKeyDown(event)
  }
  function onTouchStart(event) {
    if (scope.enabled === !1) return
    if (event.touches.length === 1) {
      if (scope.enablePan !== !1) {
        handleTouchStartPan(event)
        state = STATE.TOUCH_PAN
      }
    }
    switch (event.touches.length) {
      case 1:
        if (scope.enableRotate === !1) return
        handleTouchStartRotate(event)
        state = STATE.TOUCH_ROTATE
        break
      case 2:
        if (scope.enableZoom === !1) return
        handleTouchStartDolly(event)
        state = STATE.TOUCH_DOLLY
        break
      case 3:
        if (scope.enablePan === !1) return
        handleTouchStartPan(event)
        state = STATE.TOUCH_PAN
        break
      default:
        state = STATE.NONE
    }
    if (state !== STATE.NONE)
      scope.dispatchEvent(startEvent)
  }
  function onTouchMove(event) {
    if (scope.enabled === !1) return
    if (event.touches.length === 1) {
      if (scope.enablePan !== !1) {
        if (state === STATE.TOUCH_PAN)
          handleTouchMovePan(event)
      }
    }
    event.preventDefault()
    event.stopPropagation()
    switch (event.touches.length) {
      case 1:
        if (scope.enableRotate === !1) return
        if (state !== STATE.TOUCH_ROTATE) return
        handleTouchMoveRotate(event)
        break
      case 2:
        if (scope.enableZoom === !1) return
        if (state !== STATE.TOUCH_DOLLY) return
        handleTouchMoveDolly(event)
        break
      case 3:
        if (scope.enablePan === !1) return
        if (state !== STATE.TOUCH_PAN) return
        handleTouchMovePan(event)
        break
      default:
        state = STATE.NONE
    }
  }
  function onTouchEnd(event) {
    if (scope.enabled === !1) return
    handleTouchEnd(event)
    scope.dispatchEvent(endEvent)
    state = STATE.NONE
  }
  function onContextMenu(event) {
    event.preventDefault()
  }
  scope.domElement.addEventListener('contextmenu', onContextMenu, !1)
  scope.domElement.addEventListener('mousedown', onMouseDown, !1)
  scope.domElement.addEventListener('wheel', onMouseWheel, !1)
  scope.domElement.addEventListener('touchstart', onTouchStart, !1)
  scope.domElement.addEventListener('touchend', onTouchEnd, !1)
  scope.domElement.addEventListener('touchmove', onTouchMove, !1)
  window.addEventListener('keydown', onKeyDown, !1)
  this.update()
}
OrbitControls.prototype = Object.create(THREE.EventDispatcher.prototype)
OrbitControls.prototype.constructor = OrbitControls
