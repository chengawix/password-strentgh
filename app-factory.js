const webpack = require('webpack');
const log = new (require("chillogger"))("app-factory");
const HtmlWebpackPlugin = require('html-webpack-plugin');
process.env.NODE_ENV =  process.env.NODE_ENV || "development"
const {join} = require("path");


function getCompilerConfig() {
    const config = {
        optimization: {
            minimize: false,
        },
        entry: {
            example: join(__dirname,"src/example.js"),
            
        },
        output: {
            path: join(__dirname,"dist")
        },
        module: {
            rules: [
                {
                    test: /\.(js|jsx)$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            "sourceType": "unambiguous",
                            plugins: [
                                "@babel/plugin-proposal-class-properties",
                                "@babel/plugin-transform-react-jsx",
                            ]
                        }
                    }
                },
                {
                    test: /\.scss$/,
                    use: [
                        {
                            loader: "style-loader" // creates style nodes from JS strings
                        },
                        {
                            loader: "css-loader" // translates CSS into CommonJS
                        },
                        {
                            loader: "sass-loader" // compiles Sass to CSS
                        }
                    ]
                }
            ]
        },
        resolve: {
            extensions: ['*', '.js', '.jsx']
        },
        devtool: 'inline-source-map',
        devServer: {
        contentBase: './dist',
            hot: true,
        },
        plugins: [
            new HtmlWebpackPlugin({
                // chunks: ["example"],
                template: "src/example.ejs",
                filename: 'index.html'
            }),
            new webpack.SourceMapDevToolPlugin({})
        ]
    }
    return config
}




const appFactory = ()=>{
    const compiler = webpack(getCompilerConfig());
    const watching = compiler.watch({
        aggregateTimeout: 300,
        poll: undefined
    }, (err, stats) => { // Webpack stats Object
        const { errors, missingDependencies } = stats.compilation;
        if (errors.length) {
            return errors.forEach(error => log.warn(`got an error when compiling: ${error.message}`, error.stack))
        }
        log.info(`app build completed`)
});
}

appFactory();