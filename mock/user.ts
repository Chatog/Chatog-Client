import { MockMethod } from 'vite-plugin-mock';

const userMock: MockMethod[] = [
  {
    url: '/api/users',
    method: 'get',
    timeout: 2000,
    response: {
      code: 0,
      data: [
        {
          uid: 0,
          uname: 'zzn'
        },
        {
          uid: 1,
          uname: 'lxc'
        }
      ]
    }
  }
];

export default userMock;
