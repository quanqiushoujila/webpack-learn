### loader
> 1.css-loader用来处理css中url的路径  
> 2.style-loader可以把css文件变成style标签插入head中  
> 3.file-loader 解决css等文件中引入图片路径的问题  
> 4.url-loader 当图片较小的时候会把图片BASE64编码，大于limit参数的时候还是使用file-loader 进行拷贝  

### devtool
> 1. source-map 把映射文件生成到单独的文件，最完整最慢  
> 2. cheap-module-source-map 在一个单独的文件中产生一个不带列映射的Map  
> 3. eval-source-map 使用eval打包源文件模块,在同一个文件中生成完整sourcemap  
> 4. cheap-module-eval-source-map sourcemap和打包后的JS同行显示，没有映射列  


