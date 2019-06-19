<template>
  <div class="login-container">
    <div class="login-logo">
      <span><img src="../assets/logo-white.png" class="login-logo-img" alt=""></span>
    </div>
    <div class="login-main">
      <div class="login-left">
        <div class="login-msg">
          <h3>Fly makes you faster</h3>
          <p>New free template by uicookies.com. For more templates visit the site. Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p>
          <el-button type="primary">GitHub地址</el-button>
        </div>
      </div>
      <div class="login-right">
        <el-tabs class="login-tabs" v-model="activeTag">
          <el-tab-pane label="登录" name="login">
            <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on" label-position="left">
              <el-form-item prop="username">
              <span class="svg-container">
                <svg-icon icon-class="user" />
              </span>
                <el-input
                  v-model="loginForm.username"
                  :placeholder="'请输入用户名'"
                  name="username"
                  type="text"
                  auto-complete="on"
                />
              </el-form-item>

              <el-form-item prop="password">
              <span class="svg-container">
                <svg-icon icon-class="password" />
              </span>
                <el-input
                  v-model="loginForm.password"
                  :type="passwordType"
                  :placeholder="'请输入用户密码'"
                  name="password"
                  auto-complete="on"
                  @keyup.enter.native="handleLogin"
                />
                <span class="show-pwd" @click="showPwd">
                <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
              </span>
              </el-form-item>

              <el-button class="login-button" :loading="loading" type="primary" style="width:100%;margin-bottom:30px;" @click.native.prevent="handleLogin">
                {{ '登 陆' }}
              </el-button>

            </el-form>
          </el-tab-pane>
          <el-tab-pane label="注册" name="register">
            <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on" label-position="left">
              <el-form-item prop="username">
              <span class="svg-container">
                <svg-icon icon-class="user" />
              </span>
                <el-input
                  v-model="loginForm.username"
                  :placeholder="'请输入用户名'"
                  name="username"
                  type="text"
                  auto-complete="on"
                />
              </el-form-item>

              <el-form-item prop="password">
              <span class="svg-container">
                <svg-icon icon-class="password" />
              </span>
                <el-input
                  v-model="loginForm.password"
                  :type="passwordType"
                  :placeholder="'请输入用户密码'"
                  name="password"
                  auto-complete="on"
                  @keyup.enter.native="handleLogin"
                />
                <span class="show-pwd" @click="showPwd">
                <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
              </span>
              </el-form-item>

              <el-button class="login-button" :loading="loading" type="primary" style="width:100%;margin-bottom:30px;" @click.native.prevent="handleLogin">
                {{ '注 册' }}
              </el-button>

            </el-form>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>

  </div>
</template>

<script>
import { validUsername } from '@/scripts/validate'

export default {
  name: 'Login',
  data () {
    const validateUsername = (rule, value, callback) => {
      if (!validUsername(value)) {
        callback(new Error('请输入正确的用户名'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('密码必须大于6位字符'))
      } else {
        callback()
      }
    }
    return {
      activeTag: 'login',
      loginForm: {
        username: 'admin',
        password: '12345678'
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
      passwordType: 'password',
      loading: false,
      showDialog: false,
      redirect: undefined
    }
  },
  watch: {
    $route: {
      handler: function (route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  created () {
    // window.addEventListener('hashchange', this.afterQRScan)
  },
  destroyed () {
    // window.removeEventListener('hashchange', this.afterQRScan)
  },
  methods: {
    showPwd () {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
    },
    handleLogin () {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('LoginByUsername', this.loginForm).then(() => {
            this.loading = false
            this.$router.push({ path: this.redirect || '/' })
          }).catch(() => {
            this.loading = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
  $bg:#283443;
  $light_gray:#eee;
  $cursor: #495057;

  @supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
    .login-container .el-input input{
      color: $cursor;
      &::first-line {
        /*color: $light_gray;*/
        color: #495057;
      }
    }
  }

  /* reset element-ui css */
  .login-container {
    .el-input {
      display: inline-block;
      height: 47px;
      width: 85%;
      input {
        background: transparent;
        border: 0px;
        -webkit-appearance: none;
        border-radius: 0px;
        padding: 12px 5px 12px 15px;
        color: $light_gray;
        /*color: #495057;*/
        height: 47px;
        caret-color: $cursor;
        &:-webkit-autofill {
          -webkit-box-shadow: 0 0 0px 1000px $bg inset !important;
          -webkit-text-fill-color: $cursor !important;
        }
      }
    }
    .el-form-item {
      border: 1px solid rgba(255, 255, 255, 0.1);
      /*background: rgba(0, 0, 0, 0.1);*/
      background: #f2f2f2;
      border-radius: 5px;
      color: #495057;
    }
  }
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
  $bg:#1B5CBF;;
  $dark_gray:#889aa4;
  $light_gray:#eee;

  .login-container {
    min-height: 100%;
    width: 100%;
    /*background-color: $bg;*/
    background: linear-gradient(45deg, #665fee 0%, #27c2de 100%);
    background: linear-gradient(45deg, #293a4b 0%, #18509c 100%);
    overflow: hidden;
    .login-form {
      position: relative;
      width: 460px;
      max-width: 100%;
      padding: 60px 35px 0;
      margin: 0 auto;
      overflow: hidden;
    }
    .tips {
      font-size: 14px;
      color: #fff;
      margin-bottom: 10px;
      span {
        &:first-of-type {
          margin-right: 16px;
        }
      }
    }
    .svg-container {
      padding: 6px 5px 6px 15px;
      color: $dark_gray;
      vertical-align: middle;
      width: 30px;
      display: inline-block;
    }
    .title-container {
      position: relative;
      .title {
        font-size: 26px;
        color: $light_gray;
        margin: 0px auto 40px auto;
        text-align: center;
        font-weight: bold;
      }
      .set-language {
        color: #fff;
        position: absolute;
        top: 3px;
        font-size:18px;
        right: 0px;
        cursor: pointer;
      }
    }
    .show-pwd {
      position: absolute;
      right: 10px;
      top: 7px;
      font-size: 16px;
      color: $dark_gray;
      cursor: pointer;
      user-select: none;
    }
    .thirdparty-button {
      position: absolute;
      right: 0;
      bottom: 6px;
    }
  }
</style>
<style>
  .login-main{
    position: absolute;
    width:85%;
    height:600px;
    left:50%;
    top:50%;
    margin-left:-42%;
    margin-top:-300px;
    /*border:1px solid #00F*/
  }
  .login-left,.login-right{
    float: left;
  }
  .login-left{
    width: 55%;
    color:#fff;
    box-sizing: border-box;
    padding: 50px 0;
  }
  .login-logo{
    width: 85%;
    height:80px;
    margin:30px auto;
    position: relative;
  }
  .login-logo span{
    display: block;
    width:190px;
    height:80px;
  }
  .login-msg{
    margin-top:80px;
    font-weight: normal;
    font-family: "Montserrat", Arial, sans-serif;
  }
  .login-msg h3{
    font-size:50px;
    font-weight: normal;
  }
  .login-msg p{
    font-size: 25px;
    line-height:40px;
  }
  .login-right{
    width:45%;
  }
  .login-tabs{
    margin:70px auto 0;
    background-color:#fff;
    width:460px;
    height:460px;
    border-radius: 6px;
    box-shadow: 1px 11px 68px -20px rgba(0, 0, 0, 0.75);
  }
  .login-tabs .el-tabs__nav-wrap{
    height:70px;
    line-height: 70px;
  }
  .login-tabs .el-tabs__nav{
    width:100%;
  }
  .login-tabs .el-tabs__item{
    width: 50%;
    text-align: center;
    font-size: 20px;
  }
  .login-tabs .el-tabs__active-bar{
    width: 50%!important;
  }
  .login-button{
    height:50px;
    font-size:18px;
  }
  .login-logo-img{
    height:80px;
  }
  @media screen and (max-width: 960px){
    .login-logo{
      text-align: center;
    }
    .login-left{
      display: none;
    }
    .login-right{
      width:100%;
    }
  }
</style>
