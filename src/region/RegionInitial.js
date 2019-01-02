class Region {
  constructor() {
    this.reducerPath = null;
    this.enableLog = true;
    this.expiredTime = 0;
    this.strictLoading = true;
    this.silentConnect = false;
    this.SET_LOADING = '@redux-loadings/SET_LOADING';
    this.SET_RESULT = '@redux-loadings/SET_RESULT';
  }
}

export default Region;
