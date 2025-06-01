[plugin:vite:import-analysis] Failed to resolve import "../../../../assets/client/current-location.svg" from "src/pages/client/modules/profile/Addresses.tsx". Does the file exist?
D:/Facultad/4to Semestre/Proyecto - Buen Sabor/pizza-mia-frontend-main/src/pages/client/modules/profile/Addresses.tsx:4:28
19 |  import ProfileLayout from "../../../../components/Client/ProfileLayout/ProfileLayout";
20 |  import styles from "./Addresses.module.css";
21 |  import currentLocation from "../../../../assets/client/current-location.svg";
   |                               ^
22 |  import disabledLocation from "../../../../assets/client/disabled-location.svg";
23 |  import markedLocation from "../../../../assets/client/marked-location.svg";
    at TransformPluginContext._formatLog (file:///D:/Facultad/4to%20Semestre/Proyecto%20-%20Buen%20Sabor/pizza-mia-frontend-main/node_modules/vite/dist/node/chunks/dep-BMIURPaQ.js:42451:41)
    at TransformPluginContext.error (file:///D:/Facultad/4to%20Semestre/Proyecto%20-%20Buen%20Sabor/pizza-mia-frontend-main/node_modules/vite/dist/node/chunks/dep-BMIURPaQ.js:42448:16)
    at normalizeUrl (file:///D:/Facultad/4to%20Semestre/Proyecto%20-%20Buen%20Sabor/pizza-mia-frontend-main/node_modules/vite/dist/node/chunks/dep-BMIURPaQ.js:40427:23)
    at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
    at async file:///D:/Facultad/4to%20Semestre/Proyecto%20-%20Buen%20Sabor/pizza-mia-frontend-main/node_modules/vite/dist/node/chunks/dep-BMIURPaQ.js:40546:37
    at async Promise.all (index 6)
    at async TransformPluginContext.transform (file:///D:/Facultad/4to%20Semestre/Proyecto%20-%20Buen%20Sabor/pizza-mia-frontend-main/node_modules/vite/dist/node/chunks/dep-BMIURPaQ.js:40473:7)
    at async EnvironmentPluginContainer.transform (file:///D:/Facultad/4to%20Semestre/Proyecto%20-%20Buen%20Sabor/pizza-mia-frontend-main/node_modules/vite/dist/node/chunks/dep-BMIURPaQ.js:42246:18)
    at async loadAndTransform (file:///D:/Facultad/4to%20Semestre/Proyecto%20-%20Buen%20Sabor/pizza-mia-frontend-main/node_modules/vite/dist/node/chunks/dep-BMIURPaQ.js:35698:27)
    at async viteTransformMiddleware (file:///D:/Facultad/4to%20Semestre/Proyecto%20-%20Buen%20Sabor/pizza-mia-frontend-main/node_modules/vite/dist/node/chunks/dep-BMIURPaQ.js:37202:24
Click outside, press Esc key, or fix the code to dismiss.
You can also disable this overlay by setting server.hmr.overlay to false in vite.config.ts.