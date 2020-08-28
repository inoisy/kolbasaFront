export const state = () => ({
  userData: {
    user: {},
    jwt: null
  }
})
export const getters = {
  isLogined(state) {
    // console.log("isLogined -> state", state.userData.user)
    // return this.
    return !!(state.userData.jwt && state.userData.user)
  },
  getUser(state) {
    return state.userData.user
  },
  getJWT(state) {
    return state.userData.jwt
  }
}
export const mutations = {

  setUserData(state, data) {
    console.log("setUserData -> state", state)
    this.app.$cookies.set('user', data, {
      path: '/',
      maxAge: 60 * 60 * 24 * 365
    })
    state.userData.user = data
  },
  setJWT(state, data) {
    this.app.$cookies.set('jwt', data, {
      path: '/',
      maxAge: 60 * 60 * 24 * 365
    })
    state.userData.jwt = data
    this.$axios.setToken(data, "Bearer");
  },
  logout(state) {
    state.userData.user = {}
    state.userData.jwt = null
    this.app.$cookies.set('user', null)
    this.app.$cookies.set('jwt', null)
    this.$axios.setToken(false);
  }
}
export const actions = {
  async setUser(state, data) {
    // console.log("setUser -> data", data)
    // state.userData = data
    const {
      orders,
      updated_by,
      role,
      ...user
    } = data.user
    await state.commit("setUserData", user)
    await state.commit("setJWT", data.jwt)
    // console.log("setUser -> user", user)

    // await this.app.$cookies.set('user', user, {
    //   path: '/',
    //   maxAge: 60 * 60 * 24 * 365
    // })
    // await this.app.$cookies.set('jwt', data.jwt, {
    //   path: '/',
    //   maxAge: 60 * 60 * 24 * 365
    // })
    // this.app.$cookies.get('user')
    // console.log("setUser -> this.app.$cookies.get('user')", (await this.app.$cookies.get('user')))

  }
}
