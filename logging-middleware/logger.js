const axios = require("axios");

const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJiYWxhc3VicmFtYW5pLjIzY3NlQGNhbWJyaWRnZS5lZHUuaW4iLCJleHAiOjE3ODI3MTMyMTEsImlhdCI6MTc4MjcxMjMxMSwiaXNzIjoiQWZmb3JkIE1lZGljYWwgVGVjaG5vbG9naWVzIFByaXZhdGUgTGltaXRlZCIsImp0aSI6IjM5MjZmZjAyLTUwODUtNGJhYi1hMjIzLTU3MTFkYTRjZmI4MiIsImxvY2FsZSI6ImVuLUlOIiwibmFtZSI6ImJhbGFzdWJyYW1hbmkgbSIsInN1YiI6ImE0Nzg5Mzc4LTlhOTQtNDVhZS1iNGUxLWZmM2JkMmQ4MWQ5ZiJ9LCJlbWFpbCI6ImJhbGFzdWJyYW1hbmkuMjNjc2VAY2FtYnJpZGdlLmVkdS5pbiIsIm5hbWUiOiJiYWxhc3VicmFtYW5pIG0iLCJyb2xsTm8iOiIxY2QyM2NzMDI4IiwiYWNjZXNzQ29kZSI6IkFwbnBUbSIsImNsaWVudElEIjoiYTQ3ODkzNzgtOWE5NC00NWFlLWI0ZTEtZmYzYmQyZDgxZDlmIiwiY2xpZW50U2VjcmV0IjoiRk1XalZVR0tRZkJubm51ZSJ9.YOR38b81JBlaWhNQ75WdVA_bkrDPiz_iDCAkYQCHN0U";


async function Log(stack, level, pkg, message) {
    try {
        const response = await axios.post(
            "http://4.224.186.213/evaluation-service/logs",
            {
                stack,
                level,
                package: pkg,
                message
            },
            {
                headers: {
                    Authorization: `Bearer ${TOKEN}`,
                    "Content-Type": "application/json"
                },
                timeout: 10000
            }
        );

        console.log("Log Success");
        return response.data;
    } catch (err) {
        console.error("Log Failed");

        if (err.response) {
            console.error(err.response.status);
            console.error(err.response.data);
        } else {
            console.error(err.message);
        }
    }
}

module.exports = Log;