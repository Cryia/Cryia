const getters = {
  sidebar: state => state.app.sidebar,
  language: state => state.app.language,
  size: state => state.app.size,
  device: state => state.app.device,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  userId: state => state.user.id,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  status: state => state.user.status,
  roles: state => state.user.roles,
  setting: state => state.user.setting,
  asyncRouters: state => state.permission.asyncRouters,
  permissionRouters: state => state.permission.routers,
  // dashboardsRouters: state => state.user.addRouters,
  sidebarRouters: state => state.user.routers,
  errorLogs: state => state.errorLog.logs
}
export default getters
