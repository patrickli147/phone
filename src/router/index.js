import Vue from 'vue'
import Router from 'vue-router'
import PowerOffModal from '@/components/PowerOffModal'
import Phone from '@/components/Phone'
import PowerOff from '@/components/PowerOff'
import Desktop from '@/components/Desktop'
import Locked from '@/components/Locked'
import PowerOnAnimation from '@/components/PowerOnAnimation'
import Camera from '@/components/Camera'
import Photos from '@/components/Photos'
import Albums from '@/components/Albums'
import Calculator from '@/components/Calculator'
import Calendar from '@/components/Calendar'
import Poem from '@/components/Poem'
import UnsplashApp from '@/components/UnsplashApp'
import UnsplashWelcome from '@/components/UnsplashWelcome';
import UnsplashSearch from '@/components/UnsplashSearch';
import UnsplashCollections from '@/components/UnsplashCollections';
import UnsplashPhoto from '@/components/UnsplashPhoto';
import UnsplashCollection from '@/components/UnsplashCollection';
import UnsplashUser from '@/components/UnsplashUser';


Vue.use(Router)

const router =  new Router({
  routes: [
    {
      path: '/phone',
      name: 'Phone',
      component: Phone,
      children: [
        {
          path: 'poweroffmodal',
          name: 'PowerOffModal',
          component: PowerOffModal
        },
        {
          path: 'poweroff',
          name: 'PowerOff',
          component: PowerOff
        },
        {
          path: 'locked',
          name: 'Locked',
          component: Locked
        },
        {
          path: 'powerOnAnimation',
          name: 'PowerOnAnimation',
          component: PowerOnAnimation
        },
        {
          path: 'desktop',
          name: 'Desktop',
          component: Desktop
        },
        {
          path: 'camera',
          name: 'Camera',
          component: Camera
        },
        {
          path: 'photos',
          name: 'Photos',
          component: Photos
        },
        {
          path: 'albums',
          name: 'Albums',
          component: Albums
        },
        {
          path: 'calculator',
          name: 'Calculator',
          component: Calculator
        },
        {
          path: 'calendar',
          name: 'Calendar',
          component: Calendar
        },
        {
          path: 'poem',
          name: 'Poem',
          component: Poem
        },
        {
          path: 'unsapp',
          name: 'UnsplashApp',
          component: UnsplashApp,
          children: [
            {
              path: 'welcome',
              name: 'UnsplashWelcome',
              component: UnsplashWelcome
            },
            {
              path: 'search',
              name: 'UnsplashSearch',
              component: UnsplashSearch
            },
            {
              path: 'collections',
              name: 'UnsplashCollections',
              component: UnsplashCollections
            },
            {
              path: 'photo',
              name: 'UnsplashPhoto',
              component: UnsplashPhoto
            },
            {
              path: 'collection',
              name: 'UnsplashCollection',
              component: UnsplashCollection
            },
            {
              path: 'user',
              name: 'UnsplashUser',
              component: UnsplashUser
            }
          ]
        },
        {
          path: '/*',
          component: Desktop
        }
      ]
    },
    {
      path:'*',
      component: Phone
    }
  ]
})

router.beforeEach((to, from, next) => {
  //console.log(router.app.$options.store);
  //获取pageStack信息,并添加路由记录
  let pageStack = router.app.$options.store.getters.pageStack;
  pageStack.push(to.path);
  
  //更新pageStack
  router.app.$options.store.commit('UPDATE_PAGESTACK', pageStack);
  
  next();
});

 router.afterEach((to) => {
   //禁用后退
   var docURL = document.URL;
   var toURL = docURL.substring(0, docURL.indexOf('#') + 1) + to.path;
   history.pushState(null, null, toURL);
 })

export default router;