import request from '@/scripts/request'
import { getUserId } from '@/scripts/auth'

export function fetchList (query) {
  const id = getUserId()
  return request({
    url: '/user/' + id + '/dashboards',
    method: 'get',
    params: query
  })
}

export function fetchDashboard (hash) {
  return request({
    url: '/dashboards/' + hash,
    method: 'get'
  })
}

export function createDashboard (data) {
  const id = getUserId()
  return request({
    url: '/user/' + id + '/dashboards',
    method: 'post',
    data
  })
}

export function updateDashboard (data) {
  return request({
    url: '/dashboards/' + data.hash,
    method: 'put',
    data
  })
}

export function deleteDashboard (hash) {
  return request({
    url: '/dashboards/' + hash,
    method: 'delete'
  })
}

export function publishDashboard (hash, option) {
  return request({
    url: '/publish/' + hash,
    method: 'post',
    data: { 'option': option }
  })
}

export function fetchPublication (hash) {
  return request({
    url: '/publish/' + hash,
    method: 'get'
  })
}

export function downloadDashboard (hash) {
  return request({
    url: '/download/dashboards/' + hash,
    method: 'get'
  })
}

export function moveDashboard (hash, key) {
  return request({
    url: '/projects/' + key + '/dashboards/' + hash,
    method: 'put'
  })
}
