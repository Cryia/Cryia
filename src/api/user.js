import request from '@/scripts/request'
import { getUserId } from '@/scripts/auth'

export function getUserInfo () {
  const id = getUserId()
  return request({
    url: '/user/' + id + '/info',
    method: 'get'
  })
}