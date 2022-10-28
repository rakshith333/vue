const dev = process.env.NODE_ENV != 'production'
// export const server = 'https://webviewer.vercel.app/'
export const server = dev ? 'https://192.168.0.125:3333/' : 'https://webviewer.vercel.app/'
export const assetPath = dev ? 'https://192.168.0.125:3333/asset/' : 'https://webviewer.vercel.app/'
export const cdnPath = dev ? 'https://storage.googleapis.com/spaces.renderpub.com/' : 'https://storage.googleapis.com/spaces.renderpub.com/'

export const defaults = {
  WIDTH: 1280,
  HEIGHT: 720,
  DEFAULT_SCENE_NUMBER: 0,
  DEFAULT_HOTSPOT_NO: 0,
  ZERO: 0,
  ONE: 1,
  CAMERA_MIN: 0.1,
  CAMERA_MAX: 10000,
  CAMERA_FOV: 70,
  CAMERA_TARGET_OFFSET: 0.0001,
  CURSOR_RADIUS: 0.15,
  CURSOR_COLOR: 0xF4CA00,
  CURSOR_OPACITY: 0.4,
  CURSOR_ORBIT_SCALE: 2,
  HOTSPOT_GROUP_NAME: 'hotspots',
  HOTSPOT_SHOW_FOR_DESCTOPE: true,
  HOTSPOT_COLOR: 0xF4CA00,
  HOTSPOT_COLOR_ACTIVE: 0x7FFF00,
  HOTSPOT_OPACITY: 0.4,
  HOTSPOT_SHOW_FOR_MOBILE: !1,
  HOTSPOT_ANIMATE: 0,
  HOTSPOT_RADIUS: 20,
  WIREFRAME: false,
  TRANSPARENT: false,
  MAIN_GROUP_NAME: 'room',
  SHADER_ROTATION_X: 0,
  SHADER_ROTATION_Y: 0,
  SHADER_ROTATION_Z: 0,
  TIME_CHANGE_POSITION: 1000,
  TWEEN_DELAY_MOVEMENT: 50,
  STREAM_CUBEMAPS_CNT: 10
}

export const config = {
  panoramaIsActive: !1,
  expectedResources: 1
}
