import { MockMethod } from 'vite-plugin-mock';

const roomMock: MockMethod[] = [
  {
    url: '/api/room/create',
    method: 'post',
    timeout: 2000,
    rawResponse(req, res) {
      res.setHeader('Content-Type', 'application/json');
      res.setHeader(
        'Set-Auth',
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1M2RnaWE3OTFqaGsxeCIsIm5hbWUiOiJKb2tlciJ9.-l4nSMItgGggbHwApW1xB7gDtblYVJ79wbwWwYNTA9A'
      );
      res.statusCode = 200;
      res.end(
        JSON.stringify({
          code: 0,
          msg: '',
          data: {
            roomId: '114514',
            token: ''
          }
        })
      );
    }
  },
  {
    url: '/api/room/join',
    method: 'post',
    timeout: 1000,
    rawResponse(req, res) {
      res.setHeader('Content-Type', 'application/json');
      res.setHeader(
        'Set-Auth',
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1M2RnaWE3OTFqaGsxeCIsIm5hbWUiOiJKb2tlciJ9.-l4nSMItgGggbHwApW1xB7gDtblYVJ79wbwWwYNTA9A'
      );
      res.statusCode = 200;
      res.end(
        JSON.stringify({
          code: 0,
          msg: '',
          data: {
            roomId: '114514',
            token: ''
          }
        })
      );
    }
  }
];

export default roomMock;
