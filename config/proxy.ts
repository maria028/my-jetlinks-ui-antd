/*
 * @Author: pzy 1012839072@qq.com
 * @Date: 2023-07-13 11:35:59
 * @LastEditors: pzy 1012839072@qq.com
 * @LastEditTime: 2023-10-26 08:56:54
 * @Description:
 */
/**
 * 在生产环境 代理是无法生效的，所以这里没有生产环境的配置
 * -------------------------------
 * The agent cannot take effect in the production environment
 * so there is no configuration of the production environment
 * For details, please see
 * https://pro.ant.design/docs/deploy
 */
export default {
  dev: {
    '/api': {
      // target: 'http://192.168.32.28:8844/',
      // ws: 'ws://192.168.32.28:8844/',
      // 开发环境
      // target: 'http://120.79.18.123:8844/',
      // ws: 'ws://120.79.18.123:8844/',
      // 测试环境
      // target: 'http://192.168.71.120:8828/',
      target: 'http://120.55.62.248:8828/',

      // ws: 'ws://120.77.179.54:8844/',
      // target: 'http://192.168.32.86:8844/',
      // ws: 'ws://192.168.32.86:8844/',
      //v2环境
      // ws: 'ws://47.109.52.230:8844',
      // target: 'http://47.109.52.230:8844',
      changeOrigin: true,
      pathRewrite: { '^/api': '/api' },
    },
  },
  test: {
    '/api/': {
      target: 'https://preview.pro.ant.design',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
  },
  pre: {
    '/api/': {
      target: 'your pre url',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
  },
};
