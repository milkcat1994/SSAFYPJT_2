import axios from "axios";

export default axios.create({
    // baseURL: "http://localhost:8080",
    baseURL: "http://j3a306.p.ssafy.io:8080",
    headers: {
        "Content-type": "application/json"
    },
});