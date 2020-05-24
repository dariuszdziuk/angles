Angles is a web experiment — a vinyl DJ set, decontructed.

View the full experience at https://experience.dariuszdziuk.com 

The project is featuring a recording of a DJ set using two cameras and allowing the viewer to choose between four different viewing modes:

* Front camera
* Top camera
* Both cameras
* Automatic selection (ML-based)

![Screenshot of the experience](https://dariuszdziuk.ams3.cdn.digitaloceanspaces.com/angles/Screenshot%202020-05-24%20at%2012.06.20.png)

The ML-based mode utilises Google's PoseNet library for TensorFlow.js to automatically detect the body pose that's interesting to look at from the top camera, and switches automatically to it.

Additionally, a simple additional layer (stylised after AR-like look and feel) is available showing the metadata of the music that's currently mounted in each turntable.

![Screenshof of the experience](https://dariuszdziuk.ams3.cdn.digitaloceanspaces.com/angles/Screenshot%202020-05-24%20at%2012.05.54.png)

Hardware used

* Technics SL-1210MK2 x2
* Pioneer DJM250 MK2
* iPhone XS
* Google Pixel 1

Software used

* React
* Next.js
* Rebass
* TensorFlow.js
* PoseNet
* Web Workers
* stats.js by mrdoot
