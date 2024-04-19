"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const path_1 = __importDefault(require("path"));
const index_js_1 = __importDefault(require("../config/index.js"));
const index_js_2 = __importDefault(require("./routes/index.js"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
// Express file upload
app.use((0, express_fileupload_1.default)({
    useTempFiles: true,
    tempFileDir: path_1.default.join(__dirname, 'temp'),
    createParentPath: true
}));
app.use('/api/workers/auth', index_js_2.default.workersAuthRoutes);
app.use('/api/workers', index_js_2.default.workersProfileRoutes);
app.listen(index_js_1.default.port, () => console.log(`App is listening on url ${index_js_1.default.host}:${index_js_1.default.port}`));
