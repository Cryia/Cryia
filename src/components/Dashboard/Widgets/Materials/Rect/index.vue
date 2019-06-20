<template>
  <div
    :style="{
      display: val.display,
      position: 'absolute',
      width: val.width / w * 100 + '%',
      height: val.height / h * 100 + '%',
      left: val.left / w * 100 + '%',
      top: val.top / h * 100 + '%',
      zIndex: val.z,
      backgroundImage: 'url(' + val.backPic + ')',
      background: val.bgType == 'bgColor' ? val.bgColor : (val.bgType == 'bgGradientcolor' ? '-webkit-linear-gradient(' + val.bgGradientdir1 + ',' + val.bgGradientcolor1 + ',' + val.bgGradientcolor2 + ')' : val.bgType === 'bgNone' ? '' : 'url(' + val.backPic + ') 0px 0px / 100% 100%') ,
      borderStyle: val.borderStyle,
      borderRadius: val.radius + 'px',
      borderColor: val.borderColor,
      borderWidth: val.borderWidth + 'px',
      flexDirection: val.dir,
      justifyContent: val.justify,
      alignItems: val.align
    }"
    class="lz-container">
    <!-- 子组件 -->
    <slot/>
  </div>
</template>

<script>
import stylec from './style.vue'
const WIDGET_NAME = 'braidRect'

export default {
  name: WIDGET_NAME,
  group: 'material',
  icon: require('./icon/thumb-rect.png'),
  title: '矩形',
  panel: stylec,
  setting: {
    type: WIDGET_NAME,
    isContainer: false,
    hasGuide: true,
    isUpload: false,
    isChild: false,
    dragable: true,
    resizable: true,
    name: '矩形',
    desc: '普通矩形', // 描述, 可自定义
    width: 350,
    height: 300,
    left: 50,
    top: 0,
    z: 0,
    display: 'flex',
    bgColor: '',
    bgType: 'bgColor',
    bgGradientcolor: 'linear-gradient(#f00,#ff0)',
    backPic: '',
    backPicUrl: '',
    radius: 0,
    borderColor: '',
    borderWidth: 0,
    dir: 'row',
    justify: 'flex-start',
    align: 'flex-start',
    belong: 'page',
    animationName: '',

    borderStyle: 'solid',

    bgGradientcolor1: '#ffffff',
    bgGradientcolor2: '#333333',
    bgGradientdir1: 'left'

  },
  props: ['w', 'h', 'val']
}
</script>

<style scoped>
.lz-container {
  background-repeat: no-repeat;
  background-position: center;
  background-size: 100%;
}
</style>
