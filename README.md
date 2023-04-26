## Tampermonkey 油猴脚本合集

## Work Flow

- `git clone git@github.com:susususutie/tampermonkey.git` 拉代码
- `cd ./tampermonkey/package/juejin-show-collection` 进入指定子项目, 此处`juejin-show-collection`为例
- `pnpm install` 安装依赖
- `pnpm dev` 开发
- 打开 `http://127.0.0.1:5173/`, 点击安装开发环境的临时脚本, 脚本名称以`server:`开头
- 打开脚本生效的目标网址, 如 `https://juejin.cn/frontend`, 观察到脚本已生效
- 开发, 此时更改代码, 目标网址会自动刷新
- 开发完成后, 更新 `package.json` 中的版本号, 更新 `README.md` 中 `#Release` 列表中的版本号
- `pnpm build` 打包当前子项目
- 登录 [GreasyFork](https://greasyfork.org/zh-CN/users/1007708-susususutie)
- 脚本列表中选择当前需要更新的子项目, `更新脚本` > `选择文件` 上传 `./tampermonkey/dist` 下的打包文件
- 按需编写描述信息, 更新日志等, 最后点击`发布新版本`

## Release

- [[掘金]自动签到 v0.4.0](https://greasyfork.org/zh-CN/scripts/457881)
- [[掘金]样式优化 v0.4.0](https://greasyfork.org/zh-CN/scripts/457897)
- [[掘金]外链直达 v0.4.0](https://greasyfork.org/zh-CN/scripts/458015)
- [[掘金]显示文章收藏数 v0.4.0](https://greasyfork.org/zh-CN/scripts/459046)

## Info

- 新开子项目使用 `website-feature-demo` 模板文件夹
- 打包所有项目: `pnpm build-all`
