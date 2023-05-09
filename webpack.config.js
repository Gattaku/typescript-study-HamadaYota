const path = require("path");

module.exports = {
    mode: "development",
    entry: "./src/drag_and_drop_app.ts",
    output: {
        filename: "bundle.js",
        path: path.resolve(__dirname, "dist"),
        publicPath: "/dist",
    },
    devServer: {
        static: [
            {
                directory: path.resolve(__dirname, "dist"),
                publicPath: "/",
            },
            {
                directory: __dirname,
                publicPath: "/",
            }
        ]
    },
    devtool: "inline-sorce-map",
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: "ts-loader",
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        extensions: [".ts", ".js"]
    }
};