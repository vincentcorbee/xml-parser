import { Server } from 'http';

const server = new Server((req, res) => {
  if (req.url === '/') {
    res.end('Hello, world!');
  } else {
    res.end('404 not found');
  }
});

server.listen(3000, () => {
  console.log('Server is running on port 3000');
});
