
const path      = require('path');
const webpack   = require('webpack');

const plugins = {
    
    css_extract_plugin:     require('mini-css-extract-plugin'),
    //const CleanWebpackPlugin = require('clean-webpack-plugin');
    //const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
    //const MiniCssExtractPlugin = require('mini-css-extract-plugin');
    //const BrowserSyncPlugin = require('browsersync-webpack-plugin');
    
}


module.exports  =   {
    
                        context:    path.resolve(__dirname, './../'), // the rest of paths shall be relative to this one - for dev server = /sites/sheo/apps/actilog/
    
                        mode:       'development', //production or development | https://webpack.js.org/concepts/mode/
    
                        devtool:    'cheap-module-source-map', // 'cheap-module-source-map'
    
                        entry: {

                            // keys of entry are the name of the outputted files [name]
                            
                            // frontend base
                            desktop:        ["./frontend/js/desktop/root.js"],        // babel polyfill will be automatically required at the start - enabling native Promise, Object.assign etc
                            mobile:       	["./frontend/js/mobile/root.js"],
     
                        },
                        output: {

                            //path:               path.resolve(__dirname, "./files/build/development/[name]/"),
                            path:               path.resolve(__dirname, "./files/build/development/"),
                            filename:           "[name].js",
                            //sourceMapFilename:  '[name].map',
                            pathinfo:           true                      // include name of file in comment 

                        },
                        module: {
                            
                            rules: [
                                
                                { // BABEL LOADER + REACT
                                    
                                    test: /\.js$|\.jsx/,
                                    exclude: /(node_modules|bower_components)/,
                                    use: {
                                            loader: 'babel-loader',
                                            options: {
                                                //presets: ['babel-preset-env', 'react'] 
                                                // presets: ['env', 'react'] 
                                                presets: ["@babel/preset-env", "@babel/preset-react"]
                                                }
                                    }
                                    
                                },
                                
                                { // SASS
                                    
                                    test:   /\.s?[ac]ss$/, // /\.(s*)css$/, // css or scss
                                    use:    [
                                                plugins.css_extract_plugin.loader,
                                        
                                                {   loader: 'css-loader',     options: { url: false, sourceMap: true } },
                                        
                                                {   
                                                    loader: 'sass-loader',    
                                                    options: { 
                                                                sourceMap:      true, 
                                                                
                                                                sassOptions: {
                                                                    
                                                                    outputStyle:    'compressed', 
                                                                    //includePaths: [path.resolve("./js/node_modules/bootstrap-sass/assets/stylesheets")] // prepends bootstrap to every build file
                                                                }
                                                    } 
                                                }
                                            ],
                                    
                                },
       
                            ],    

                        },
    
                        plugins:    [

                                        new plugins.css_extract_plugin({ 
                                            
                                            filename: "[name].css",         // available at DEV SERVER publicPath ( localhost:4333/blergh.css )
                                        
                                        }),
                            
                                    ],
    
                        resolve: {

                                    extensions: ['.js', '.js', '.css', '.sass'], //An empty string is no longer required.
                                    modules: ['node_modules']   
                            
                        },
    
                        // this is being ignored, pass the devServer options when instartiating devserver class 
                        devServer:  {
                            // IGNORED - true dev server options are in webpack/index.js
						}


                    };