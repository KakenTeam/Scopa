# Scopa
- Đồ án vi điều khiển: Máy bán nước online 
- Đồ án sử dụng arduino bao gồm: Wemos d1 r2, máy bơm nước, smartphone, ....
- Server sử dụng nodejs để quản lý người dùng, các order bán nước để gửi tín hiệu arduino bán nước.

# Dependencies
`git clone https://github.com/ngohuynhngockhanh/Socket.io-v1.x-Library.git `
- thư viện socket io
`https://github.com/bblanchon/ArduinoJson` thư viện json arduino

# How to run nodejs server 
- go to server folder
- run `yarn install` or `npm install`
- how to start server `node index.js`

# In production on heroku 
- Server run on scopa-production.herokuapp.com