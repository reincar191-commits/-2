# 李继忠 · AI 影像作品集

React + Vite 单页作品集基础版。PC 版心最大 1700px，兼容手机。

## 运行

安装 Node.js 后执行 `npm install`，随后 `npm run dev`。生产构建为 `npm run build`，预览构建为 `npm run preview`。

当前环境没有全局 npm，可使用 `node .tools/package/bin/npm-cli.js run dev`。

## 内容替换

- `src/main.jsx`：个人介绍、数据、联系方式、projects 作品数据、abilities 能力文案。
- `src/style.css`：颜色、版心、字体与响应式布局。
- 将真实图片、头像和视频放入 `public/`，使用 `/文件名` 引用。
- Hero 使用提供的 11月2日.mp4，存放于 public/videos/hero.mp4，静音自动循环播放。视频无法加载时显示 Unsplash 静态封面。
- 姓名、介绍、教育背景、工具技能、证书、短视频成果及邮箱电话已依据简历填充，头像从简历提取。联系区支持邮件、拨号和复制邮箱。
- 精选作品区已接入提供的《创伤》完整版。公网版为 1080p HLS 分段视频，目录 `public/videos/trauma/`，封面为 `public/videos/trauma-poster.jpg`。完整原文件保留于忽略上传的 `.tools/media/trauma-final-original.mp4`。作品卡片使用真实画面封面，点击弹窗后按需加载播放器与视频，可播放、调整音量、拖动进度和全屏观看。简历中的点赞、观看数据独立保留在个人介绍区，未关联到《创伤》。

包含锚点导航、移动导航、视频暂停、作品详情弹窗、Esc 关闭、键盘焦点、减少动态效果支持。

## 动效

`src/usePortfolioMotion.js` 使用 GSAP + ScrollTrigger 编排，`src/motion.css` 管理标题遮罩与开场样式。

- 首屏：荧光绿幕布、英文署名、三字标题分字位移与压缩归位、导航和辅助信息依次进场，约 4 秒完成；支持跳过，滚动离开首屏也会立即结束开场。
- 模块：英文大标题遮罩滑入，内容与能力卡片分组错峰展开；作品画面垂直揭幕，桌面轻微视差。
- 使用浏览器原生滚动；不锁滚、不添加持续循环动画；移动端关闭视差，系统“减少动态效果”会跳过动效；卸载与媒体条件变化时清理动画。
- 本机可用 `node .tools/motion-qa.cjs` 进行无界面浏览器检查（依赖本机 Edge 与运行时 Playwright），检查首屏完成、窄屏溢出、作品弹窗、导航与减少动态效果。
