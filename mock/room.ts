import { MockMethod } from 'vite-plugin-mock';

const roomMock: MockMethod[] = [
  {
    url: '/api/room/create',
    method: 'post',
    timeout: 2000,
    response: {
      code: 0,
      msg: '',
      data: {
        roomId: '114514',
        roomName: 'Pokemon Go!'
      }
    }
  },
  {
    url: '/api/room/join',
    method: 'post',
    timeout: 1000,
    response: {
      code: 0,
      msg: '',
      data: {
        roomId: '123456',
        roomName: 'Pokemon Go!'
      }
    }
  }
];

export default roomMock;
