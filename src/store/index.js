import Vue from 'vue'
import Vuex from 'vuex'
import { RouterMap } from '../router/index.js'
Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    route: [],
    Collapse: false
  },
  mutations: {
    SET_ROUTERS: (state, route) => {
      state.route = route
    },
    SET_SIDEBAR: (state, isCollapse) => {
      state.Collapse = isCollapse
    }
  },
  actions: {
    init: (context) => {
      context.commit('SET_ROUTERS', RouterMap)
    },
    setSideBar: (context, isCollapse) => {
      context.commit('SET_SIDEBAR', isCollapse)
    }
  },
  getters: {
    getroutes: (state) => state.route,
    getSideBar: (state) => state.Collapse
  },
  modules: {
  }
})
export default store